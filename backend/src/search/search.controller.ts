import { Controller, Get, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) { }

    @Get('years')
    searchYears(
        @Query('name') name: string,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    ) {
        return this.searchService.searchYears(name, limit, offset);
    }

    @Get('places')
    searchPlaces(
        @Query('name') name: string,
        @Query('agency') agency: string | undefined,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    ) {
        return this.searchService.searchPlacesByName(name, limit, offset, agency);
    }
}