"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { PersonForm } from "@/types";
import { getPersonByPersonId } from "@/services/peoplePublicAPI/peoplePublicAPI";

interface FilterResultProps {
    category: string;
    placeUUID: string;
    items?: PersonForm[]; // Optional - used when showing all people from agency
    personUUID?: string; // Optional - used when showing specific person
}

export default function FilterResult({ category, placeUUID, items, personUUID }: FilterResultProps) {
    const [specificPerson, setSpecificPerson] = useState<PersonForm | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch specific person when personUUID is provided
    useEffect(() => {
        const fetchSpecificPerson = async () => {
            if (!personUUID) {
                setSpecificPerson(null);
                return;
            }

            setIsLoading(true);
            setError(null);
            try {
                const person = await getPersonByPersonId(personUUID);
                setSpecificPerson(person);
            } catch (err) {
                console.error('Error fetching specific person:', err);
                setError('เกิดข้อผิดพลาดในการโหลดข้อมูลบุคลากร');
                setSpecificPerson(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSpecificPerson();
    }, [personUUID]);

    // Determine what to display
    let displayItems: PersonForm[] = [];
    let isSpecificPersonMode = false;

    if (personUUID) {
        // Mode 1: Show specific person
        isSpecificPersonMode = true;
        if (specificPerson) {
            displayItems = [specificPerson];
        }
    } else if (items) {
        // Mode 2: Show all people from agency
        displayItems = items;
    }

    // Handle loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-gray-500">กำลังโหลดข้อมูล...</div>
            </div>
        );
    }

    // Handle error state
    if (error) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-red-500 bg-red-50 px-4 py-2 rounded-md">
                    {error}
                </div>
            </div>
        );
    }

    // Handle empty state
    if (displayItems.length === 0) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="text-gray-500 text-center">
                    {isSpecificPersonMode 
                        ? 'ไม่พบข้อมูลบุคลากรที่เลือก' 
                        : 'ไม่พบข้อมูลบุคลากรในหน่วยงานนี้'
                    }
                </div>
            </div>
        );
    }

    return (
        <div className="font-prompt grid grid-cols-1 gap-4 mb-6">
            {/* Show summary */}
            <div className="text-sm text-gray-600 mb-2 text-center">
                {isSpecificPersonMode 
                    ? 'ข้อมูลบุคลากรที่เลือก' 
                    : `พบบุคลากรทั้งหมด ${displayItems.length} คน`
                }
            </div>
            
            {displayItems.map((person, index) => (
                <div key={person.id || index}>
                    <Link
                        href={`/${category}/${placeUUID}/${person.id}`}
                        className="block p-4 shadow-md rounded-xl border hover:bg-gray-100 transition-all duration-300 text-center"
                    >
                        <h2 className="font-semibold text-lg mb-1">
                            ปีงบประมาณ {person.year}
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            {person.prefix}{person.name} {person.surname}
                        </p>
                    </Link>
                </div>
            ))}
        </div>
    );
}