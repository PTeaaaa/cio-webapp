"use client";

import { useState } from 'react';
import { createPlaces, CreatePlaceData, deletePlaceById } from '@/services/places/placesAPI';
import { useRouter, useSearchParams } from 'next/navigation';

interface PlaceFormData {
    name: string;
    agency: string;
}

export const usePlaceForm = () => {
    const [formData, setFormData] = useState<PlaceFormData>({
        name: '',
        agency: ''
    });

    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();
    const placeId = searchParams.get('id');

    const handleInputChange = (field: keyof PlaceFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear messages when user starts typing
        if (error) setError(null);
        if (success) setSuccess(null);
    };

    const validateForm = (): boolean => {
        if (!formData.name.trim()) {
            setError('กรุณากรอกชื่อสถานที่');
            return false;
        }

        if (!formData.agency.trim()) {
            setError('กรุณาเลือกหน่วยงานที่สังกัด');
            return false;
        }

        return true;
    };

    const resetForm = () => {
        setFormData({
            name: '',
            agency: ''
        });
        setError(null);
        setSuccess(null);

        // Force reset the input field by clearing its value directly
        const nameInput = document.querySelector('input[placeholder="ชื่อสถานที่"]') as HTMLInputElement;
        if (nameInput) {
            nameInput.value = '';
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const placeData: CreatePlaceData[] = [{
                name: formData.name.trim(),
                agency: formData.agency.trim()
            }];

            const result = await createPlaces(placeData);

            if (result) {
                setSuccess(`เพิ่มสถานที่ "${formData.name}" สำเร็จแล้ว`);
                resetForm();

                sessionStorage.setItem('placeNotification', JSON.stringify({
                    type: 'created',
                    title: 'สร้างสถานที่สำเร็จ',
                    message: 'สถานที่ถูกสร้างเรียบร้อยแล้ว',
                    variant: 'success'
                }));
                router.push('/listplaces');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการเพิ่มสถานที่';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!placeId) {
            console.warn("[page: edit-account] handleDelete triggered without accountId");
            return;
        }
        try {
            await deletePlaceById(placeId);
            // Navigate immediately when deletion succeeds
            sessionStorage.setItem('placeNotification', JSON.stringify({
                type: 'deleted',
                title: 'ลบข้อมูลสถานที่สำเร็จ',
                message: 'สถานที่ถูกลบออกจากระบบแล้ว',
                variant: 'success'
            }));

            router.replace('/listplaces');
        } catch (error) {
            console.error("Failed to delete place:", { placeId, error });
        }
    };

    return {
        formData,
        isLoading,
        error,
        success,
        handleInputChange,
        handleSubmit,
        resetForm,
        handleDelete
    };
};
