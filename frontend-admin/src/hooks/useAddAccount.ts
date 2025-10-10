import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSidebarItems } from '@/services/sidebars/sidebarAPI';
import { useAccounts } from '@/contexts/AccountsContext';
import { Place } from '@/types';
import toast from 'react-hot-toast';

interface AccountFormData {
    username: string;
    password: string;
    role: string;
}

export function useAccountForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { createAccount, deleteAccount } = useAccounts();

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
                const errorMsg = "ไม่สามารถโหลดหน่วยงานได้ กรุณาลองใหม่ภายหลัง";
                setError(errorMsg);
                toast.error(errorMsg);
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
            const errorMsg = "กรุณากรอก Username";
            setError(errorMsg);
            toast.error(errorMsg);
            return false;
        }
        if (formData.username.trim().length < 3) {
            const errorMsg = "Username ต้องมีอย่างน้อย 3 ตัวอักษร";
            setError(errorMsg);
            toast.error(errorMsg);
            return false;
        }
        if (!formData.password) {
            const errorMsg = "กรุณากรอก Password";
            setError(errorMsg);
            toast.error(errorMsg);
            return false;
        }
        if (formData.password.length < 6) {
            const errorMsg = "Password ต้องมีอย่างน้อย 6 ตัวอักษร";
            setError(errorMsg);
            toast.error(errorMsg);
            return false;
        }
        if (!formData.role) {
            const errorMsg = "กรุณาเลือกประเภทของบัญชี";
            setError(errorMsg);
            toast.error(errorMsg);
            return false;
        }
        // Only require assignPlace for user role, admin can have empty assignPlace
        if (formData.role === 'user' && selectedPlaces.length === 0) {
            const errorMsg = "กรุณาเลือกหน่วยงานอย่างน้อย 1 แห่ง";
            setError(errorMsg);
            toast.error(errorMsg);
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

            const result = await createAccount({
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

                // Store success notification in sessionStorage
                sessionStorage.setItem('accountNotification', JSON.stringify({
                    type: 'created',
                    title: 'สร้างบัญชีผู้ใช้สำเร็จ',
                    message: 'บัญชีผู้ใช้ถูกสร้างเรียบร้อยแล้ว',
                    variant: 'success'
                }));

                // Navigate back after success
                resetForm();
                router.push('/listaccounts');
            } else {
                if (result.error === 'DUPLICATE_USERNAME') {
                    // Handle duplicate username directly - set sessionStorage and show notification
                    sessionStorage.setItem('accountNotification', JSON.stringify({
                        type: 'duplicated',
                        title: 'สร้างบัญชีผู้ใช้ไม่สำเร็จ',
                        message: 'Username นี้มีอยู่ในระบบแล้ว',
                        variant: 'warning'
                    }));

                    // Trigger a re-render by updating state to show the notification
                    setTimeout(() => {
                        window.dispatchEvent(new CustomEvent('accountNotificationUpdate'));
                    }, 100);

                    return;
                }

                const errorMsg = result.error || "เกิดข้อผิดพลาดในการสร้างบัญชี";
                setError(errorMsg);
                toast.error(errorMsg);
            }
        } catch (err: unknown) {
            const errorMsg = "เกิดข้อผิดพลาดในการสร้างบัญชี";
            setError(errorMsg);
            toast.error(errorMsg);
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
