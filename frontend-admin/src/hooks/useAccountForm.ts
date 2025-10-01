import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSidebarItems } from '@/services/sidebars/sidebarAPI';
import { useAccounts } from '@/contexts/AccountsContext';
import { Place } from '@/types';

interface AccountFormData {
    username: string;
    password: string;
    role: string;
}

export function useAccountForm() {
    const router = useRouter();
    const { signUp } = useAccounts();

    // Form state
    const [formData, setFormData] = useState<AccountFormData>({
        username: "",
        password: "",
        role: "",
    });

    // Places state
    const [places, setPlaces] = useState<Place[]>([]);
    const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);

    // UI state
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Fetch places on mount
    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const availablePlaces = await getSidebarItems();
                setPlaces(availablePlaces);
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : String(err);
                console.error("Failed to fetch places for dropdown", errorMessage);
                setError("ไม่สามารถโหลดหน่วยงานได้ กรุณาลองใหม่ภายหลัง");
            }
        };
        fetchPlaces();
    }, []);

    // Form handlers
    const handleInputChange = (field: keyof AccountFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear error when user starts typing
        if (error) setError(null);
        if (success) setSuccess(null);
    };

    const handlePlaceSelect = (placeId: string) => {
        const selectedPlace = places.find(place => place.id === placeId);
        if (selectedPlace && !selectedPlaces.find(p => p.id === placeId)) {
            setSelectedPlaces(prev => [...prev, selectedPlace]);
        }
    };

    const handlePlaceRemove = (placeId: string) => {
        setSelectedPlaces(prev => prev.filter(place => place.id !== placeId));
    };

    const getAvailablePlaces = () => {
        return places.filter(place => !selectedPlaces.find(selected => selected.id === place.id));
    };

    // Form validation
    const validateForm = (): boolean => {
        if (!formData.username.trim()) {
            setError("กรุณากรอก Username");
            return false;
        }
        if (formData.username.trim().length < 3) {
            setError("Username ต้องมีอย่างน้อย 3 ตัวอักษร");
            return false;
        }
        if (!formData.password) {
            setError("กรุณากรอก Password");
            return false;
        }
        if (formData.password.length < 6) {
            setError("Password ต้องมีอย่างน้อย 6 ตัวอักษร");
            return false;
        }
        if (!formData.role) {
            setError("กรุณาเลือกประเภทของบัญชี");
            return false;
        }
        if (selectedPlaces.length === 0) {
            setError("กรุณาเลือกหน่วยงานอย่างน้อย 1 แห่ง");
            return false;
        }
        return true;
    };

    // Form submission
    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        setError(null);

        try {
            const placeIds = selectedPlaces.map(place => place.id);

            const result = await signUp({
                username: formData.username.trim(),
                password: formData.password,
                role: formData.role,
                assignPlace: placeIds
            });

            if (result.success) {
                setSuccess("บัญชีผู้ใช้ถูกสร้างเรียบร้อยแล้ว");
                // Reset form
                setFormData({ username: "", password: "", role: "" });
                setSelectedPlaces([]);

                // Navigate back after success
                router.push('/listaccounts');
            } else {
                setError(result.error || "เกิดข้อผิดพลาดในการสร้างบัญชี");
            }
        } catch (err: unknown) {
            setError("เกิดข้อผิดพลาดในการสร้างบัญชี");
            console.error("Account creation error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ username: "", password: "", role: "" });
        setSelectedPlaces([]);
        setError(null);
        setSuccess(null);
    };

    return {
        // Form data
        formData,
        places,
        selectedPlaces,

        // UI state
        isLoading,
        error,
        success,

        // Computed values
        availablePlaces: getAvailablePlaces(),

        // Actions
        handleInputChange,
        handlePlaceSelect,
        handlePlaceRemove,
        handleSubmit,
        resetForm,
    };
}
