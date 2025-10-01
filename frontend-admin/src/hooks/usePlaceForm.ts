"use client";

import { useState } from 'react';
import { createPlaces, CreatePlaceData } from '@/services/places/placesAPI';

interface PlaceFormData {
    name: string;
    agency: string;
}

export const usePlaceForm = () => {
    const [formData, setFormData] = useState<PlaceFormData>({
        name: '',
        agency: ''
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

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
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการเพิ่มสถานที่';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        formData,
        isLoading,
        error,
        success,
        handleInputChange,
        handleSubmit,
        resetForm
    };
};
