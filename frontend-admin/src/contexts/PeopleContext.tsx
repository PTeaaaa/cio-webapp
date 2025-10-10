"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  getPeopleByPlaceId,
  createPerson as apiCreatePerson,
  updatePerson as apiUpdatePerson,
  deletePerson as apiDeletePerson
} from '@/services/people/peopleAPI';
import { Person, CreatePersonPayload, UpdatePersonPayload } from '@/types'; // นำเข้า Person และ Payload types

interface PeopleContextType {
  people: Person[];
  loading: boolean;
  error: string | null;
  placeId: string | null;
  setPlaceId: (id: string | null) => void;
  refetchPeople: () => void;
  addPerson: (person: CreatePersonPayload) => Promise<void>;
  updatePerson: (id: string, person: UpdatePersonPayload) => Promise<void>;
  deletePerson: (id: string, onSuccess?: () => void) => Promise<{ success: boolean; error?: string }>;
}

const PeopleContext = createContext<PeopleContextType | undefined>(undefined);

export function PeopleProvider({
  children,
  initialPlaceId,
}: {
  children: ReactNode,
  initialPlaceId?: string,
}) {

  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [placeId, setPlaceId] = useState<string | null>(initialPlaceId || null);

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

  const deletePerson = async (id: string, onSuccess?: () => void): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);
      await apiDeletePerson(id);

      // Call the success callback immediately (for navigation)
      if (onSuccess) {
        onSuccess();
      }

      sessionStorage.setItem('personNotification', JSON.stringify({
        type: 'deleted',
        title: 'ลบบัญชีผู้ใช้สำเร็จ',
        message: 'บัญชีผู้ใช้ถูกลบออกจากระบบแล้ว',
        variant: 'success'
      }));

      // Delay state update to allow navigation to complete first
      // This prevents the edit page from trying to refetch the deleted person
      setTimeout(() => {
        setPeople(prevPeople => prevPeople.filter(person => person.id !== id));
      }, 100);

      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || `Failed to delete person with ID: ${id}`;
      console.error("[PeopleContext] deletePerson api failed", { id, errorMessage });
      setError(errorMessage);
      return { success: false, error: errorMessage };
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