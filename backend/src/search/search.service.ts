import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SearchService {
    constructor(private readonly prisma: PrismaService) { }

    async searchYears(nameOrYear: string | number, limit = 10, offset = 0) {
        const raw = typeof nameOrYear === 'number' ? String(nameOrYear) : (nameOrYear ?? '');
        const term = raw.trim();

        if (!term) {
            return [];
        }

        const isNumeric = typeof nameOrYear === 'number' || /^\d{1,4}$/.test(term);

        const where: Prisma.PersonWhereInput = isNumeric
            ? { year: Number(term) }
            : {
                OR: [
                    { name: { contains: term, mode: Prisma.QueryMode.insensitive } },
                    { surname: { contains: term, mode: Prisma.QueryMode.insensitive } },
                    {
                        name: {
                            contains: term.split(' ')[0],
                            mode: Prisma.QueryMode.insensitive
                        }
                    },
                    {
                        surname: {
                            contains: term.split(' ')[1] || '',
                            mode: Prisma.QueryMode.insensitive
                        }
                    }
                ]
            };

        try {
            return await this.prisma.person.findMany({
                where,
                orderBy: [
                    { surname: 'asc' },
                    { name: 'asc' }
                ],
                take: limit,
                skip: offset,
                select: {
                    id: true,
                    name: true,
                    surname: true,
                    position: true,
                    department: true,
                    year: true,
                    imageUrl: true,
                    placeId: true,
                }
            });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to search people by name/year: ${errorMessage}`);
        }
    }

    async searchPlacesByName(name: string, limit = 10, offset = 0, agency?: string) {

        if (!name || name.trim() === '') {
            return [];
        }

        const searchTerm = name.trim();

        try {
            // Enhanced Thai text search combining multiple strategies
            const searchLength = searchTerm.length;

            let query: string;
            let params: any[];
            let paramIndex: number;

            if (searchLength === 1) {
                // For single characters, use simple prefix matching
                query = `
                    SELECT id, name, agency
                    FROM places 
                    WHERE name ILIKE $1
                `;
                params = [`${searchTerm}%`];
                paramIndex = 2;
            } else if (searchLength === 2) {
                // For 2 characters, combine prefix matching with contains
                query = `
                    SELECT id, name, agency, 
                    CASE 
                        WHEN name ILIKE $1 THEN 3
                        WHEN name ILIKE $2 THEN 2
                        ELSE 1
                    END as match_priority
                    FROM places 
                    WHERE name ILIKE $1 OR name ILIKE $2
                `;
                params = [`${searchTerm}%`, `%${searchTerm}%`];
                paramIndex = 3;
            } else {
                // For 3+ characters, use enhanced trigram + prefix + contains
                const similarityThreshold = 0.05; // Even lower threshold for more results

                query = `
                    SELECT id, name, agency,
                    CASE 
                        WHEN name ILIKE $1 THEN 4
                        WHEN similarity(name, $2) > $3 THEN 3
                        WHEN name ILIKE $4 THEN 2
                        ELSE 1
                    END as match_priority,
                    similarity(name, $2) as similarity_score
                    FROM places 
                    WHERE name ILIKE $1 
                       OR similarity(name, $2) > $3 
                       OR name ILIKE $4
                `;
                params = [`${searchTerm}%`, searchTerm, similarityThreshold, `%${searchTerm}%`];
                paramIndex = 5;
            }

            // Add agency filter if provided and not empty
            if (agency && agency.trim() !== '' && agency.trim().toLowerCase() !== 'undefined') {
                query += ` AND agency = $${paramIndex}`;
                params.push(agency.trim());
                paramIndex++;
            }

            // Order by match priority and similarity
            if (searchLength <= 2) {
                query += ` ORDER BY match_priority DESC, name ASC`;
            } else {
                query += ` ORDER BY match_priority DESC, similarity_score DESC, name ASC`;
            }

            query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
            params.push(limit, offset);

            const result = await this.prisma.$queryRawUnsafe(query, ...params);

            return result as Array<{
                id: string;
                name: string;
                agency: string;
            }>;
        } catch (error: unknown) {
            // Fallback to original method if trigram extension is not available
            console.warn('[searchPlacesByName] Trigram search failed, falling back to contains search:', error);

            // Enhanced fallback search for better Thai support
            const whereClause: Prisma.PlaceWhereInput = {
                OR: [
                    // Prefix matching (highest priority)
                    {
                        name: {
                            startsWith: searchTerm,
                            mode: 'insensitive'
                        }
                    },
                    // Contains matching (lower priority)
                    {
                        name: {
                            contains: searchTerm,
                            mode: 'insensitive'
                        }
                    }
                ]
            };

            // Add agency filter if provided and not empty
            if (agency && agency.trim() !== '' && agency.trim().toLowerCase() !== 'undefined') {
                whereClause.agency = agency.trim();
            }

            const fallbackResult = await this.prisma.place.findMany({
                where: whereClause,
                orderBy: {
                    name: 'asc'
                },
                take: limit,
                skip: offset,
                select: {
                    id: true,
                    name: true,
                    agency: true,
                }
            });

            return fallbackResult;
        }
    }

    // async searchPeopleByName(name: string, limit = 10, offset = 0) {
    //     if (!name || name.trim() === '') {
    //         return [];
    //     }

    //     const searchTerm = name.trim();

    //     try {
    //         // Use raw SQL with trigram similarity for better Thai text matching
    //         const similarityThreshold = 0.1;

    //         const query = `
    //             SELECT id, name, surname, position, department, year, "imageUrl", "placeId"
    //             FROM people 
    //             WHERE similarity(name, $1) > $2 
    //                OR similarity(surname, $1) > $2
    //                OR similarity(CONCAT(name, ' ', surname), $1) > $2
    //             ORDER BY GREATEST(
    //                 similarity(name, $1),
    //                 similarity(surname, $1),
    //                 similarity(CONCAT(name, ' ', surname), $1)
    //             ) DESC, surname ASC, name ASC
    //             LIMIT $3 OFFSET $4
    //         `;

    //         const result = await this.prisma.$queryRawUnsafe(
    //             query,
    //             searchTerm,
    //             similarityThreshold,
    //             limit,
    //             offset
    //         );

    //         return result as Array<{
    //             id: string;
    //             name: string;
    //             surname: string;
    //             position: string | null;
    //             department: string;
    //             year: number;
    //             imageUrl: string | null;
    //             placeId: string | null;
    //         }>;
    //     } catch (error: unknown) {
    //         // Fallback to original Prisma method if trigram search fails
    //         console.warn('Trigram search failed for people, falling back to contains search:', error);

    //         return await this.prisma.person.findMany({
    //             where: {
    //                 OR: [
    //                     { name: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } },
    //                     { surname: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } },
    //                     { name: { startsWith: searchTerm, mode: Prisma.QueryMode.insensitive } },
    //                     { surname: { startsWith: searchTerm, mode: Prisma.QueryMode.insensitive } },
    //                     {
    //                         name: {
    //                             contains: searchTerm.split(' ')[0],
    //                             mode: Prisma.QueryMode.insensitive
    //                         }
    //                     },
    //                     {
    //                         surname: {
    //                             contains: searchTerm.split(' ')[1] || '',
    //                             mode: Prisma.QueryMode.insensitive
    //                         }
    //                     }
    //                 ]
    //             },
    //             orderBy: [
    //                 { surname: 'asc' },
    //                 { name: 'asc' }
    //             ],
    //             take: limit,
    //             skip: offset,
    //             select: {
    //                 id: true,
    //                 name: true,
    //                 surname: true,
    //                 position: true,
    //                 department: true,
    //                 year: true,
    //                 imageUrl: true,
    //                 placeId: true,
    //             }
    //         });
    //     }
    // }

    // =================================== Separator =================================== //

    // async searchNames(query: string, type: 'all' | 'people' | 'places' = 'all', limit = 10, offset = 0) {
    //     if (!query || query.trim() === '') {
    //         return {
    //             people: [],
    //             places: [],
    //             meta: {
    //                 total: 0,
    //                 limit,
    //                 offset,
    //             }
    //         };
    //     }

    //     const results = {
    //         people: [] as any[],
    //         places: [] as any[],
    //         meta: {
    //             total: 0,
    //             limit,
    //             offset,
    //         }
    //     };

    //     if (type === 'all' || type === 'people') {
    //         const people = await this.searchPeopleByName(query, limit, offset);
    //         results.people = people;
    //         results.meta.total += people.length;
    //     }

    //     if (type === 'all' || type === 'places') {
    //         const places = await this.searchPlacesByName(query, limit, offset);
    //         results.places = places;
    //         results.meta.total += places.length;
    //     }

    //     return results;
    // }
}