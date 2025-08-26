"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  getPeopleByPlaceId,
  createPerson as apiCreatePerson,
  updatePerson as apiUpdatePerson,
  deletePerson as apiDeletePerson
} from '@/services/peopleAPI/peopleAPI';
import { Person, PersonForm, CreatePersonPayload, UpdatePersonPayload } from '@/types'; // นำเข้า Person และ Payload types

interface PeopleContextType {
  people: Person[];
  loading: boolean;
  error: string | null;
  placeId: string | null;
  setPlaceId: (id: string | null) => void;
  refetchPeople: () => void;
  addPerson: (person: CreatePersonPayload) => Promise<void>;
  updatePerson: (id: string, person: UpdatePersonPayload) => Promise<void>;
  deletePerson: (id: string) => Promise<void>;
}

const PeopleContext = createContext<PeopleContextType | undefined>(undefined);

export function PeopleProvider({ children, initialPlaceId, initialPersonId }: { children: ReactNode, initialPlaceId?: string, initialPersonId?: string }) {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [placeId, setPlaceId] = useState<string | null>(initialPlaceId || null);
  const [onePerson, setOnePerson] = useState<PersonForm[]>([]);
  const [personId] = useState<string | null>(initialPersonId || null);

  // --- fetch People for list table ---
  const fetchPeople = async (placeId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPeopleByPlaceId(placeId);
      setPeople(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch people");
      setPeople([]); // Clear people on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (placeId) {
      fetchPeople(placeId);
    } else {
      setPeople([]); // Clear people if no placeId is set
      setLoading(false);
    }
  }, [placeId]); // เมื่อ placeId เปลี่ยน ให้ดึงข้อมูลใหม่

  const refetchPeople = () => {
    if (placeId) {
      fetchPeople(placeId);
    }
  };

  const addPerson = async (personPayload: CreatePersonPayload) => {
    try {
      setLoading(true); // อาจจะเพิ่ม loading state สำหรับ CRUD operation ด้วย
      await apiCreatePerson(personPayload);
      refetchPeople(); // รีเฟรชข้อมูลทั้งหมดหลังจากเพิ่มสำเร็จ
    } catch (err: any) {
      setError(err.message || 'Failed to add person');
      throw err; // ส่ง error กลับไปให้ component จัดการ
    } finally {
      setLoading(false);
    }
  };

  const updatePerson = async (id: string, updatedData: UpdatePersonPayload) => {
    try {
      setLoading(true);
      await apiUpdatePerson(id, updatedData);
      refetchPeople(); // รีเฟรชข้อมูลทั้งหมดหลังจากอัปเดตสำเร็จ
    } catch (err: any) {
      setError(err.message || `Failed to update person with ID: ${id}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePerson = async (id: string) => {
    try {
      setLoading(true);
      await apiDeletePerson(id);
      refetchPeople(); // รีเฟรชข้อมูลทั้งหมดหลังจากลบสำเร็จ
    } catch (err: any) {
      setError(err.message || `Failed to delete person with ID: ${id}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <PeopleContext.Provider value={{ people, loading, error, placeId, setPlaceId, refetchPeople, addPerson, updatePerson, deletePerson }}>
      {children}
    </PeopleContext.Provider>
  );
};

export const usePeople = () => {
  const context = useContext(PeopleContext);
  if (context === undefined) {
    throw new Error('usePeople must be used within a PeopleProvider');
  }
  return context;
}