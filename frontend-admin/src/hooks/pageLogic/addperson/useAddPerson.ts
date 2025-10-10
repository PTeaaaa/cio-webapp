import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { useModal } from "../../useModal";
import { getSidebarItems } from "@/services/sidebars/sidebarAPI";
import { createPerson } from "@/services/people/peopleAPI";
import { uploadPersonImage } from "@/services/upload/uploadAPI";
import { CreatePersonPayload, PersonForm, Place } from "@/types";

export function useAddPerson() {
    const router = useRouter();
    const [places, setPlaces] = useState<Place[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // State for person form data
    const [formData, setFormData] = useState<CreatePersonPayload>({
        prefix: "",
        name: "",
        surname: "",
        email: "",
        phone: "",
        position: "",
        placeId: "",
        department: "",
        year: new Date().getFullYear(),
    });

    // State for image upload
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [imageUploadLoading, setImageUploadLoading] = useState(false);
    const [imageUploadError, setImageUploadError] = useState<string | null>(null);

    // Modal for image upload notification
    const {
        isOpen: isUploadModalOpen,
        openModal: openUploadModal,
        closeModal: closeUploadModal,
    } = useModal();

    // useEffect to fetch places for dropdown
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

    // handleInputChange: Handle changes in input fields
    const handleInputChange = useCallback((field: keyof CreatePersonPayload, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    }, []);

    // handleSave: Handle saving person data and uploading image
    const handleSave = useCallback(async () => {
        // Validate required fields
        if (!formData.name || !formData.surname || !formData.email || !formData.placeId || !formData.year) {
            alert("ข้อมูลที่จำเป็นยังถูกกรอกไม่ครบ กรุณากรอกข้อมูลที่จำเป็น");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // 1. Create new person
            let newPerson: PersonForm = await createPerson(formData);

            if (newPerson) {
                sessionStorage.setItem('personNotification', JSON.stringify({
                    type: 'created',
                    title: 'สร้างบัญชีผู้ใช้สำเร็จ',
                    message: 'บัญชีผู้ใช้ถูกสร้างเรียบร้อยแล้ว',
                    variant: 'success'
                }));
            }

            // 2. If image file is selected, upload it
            if (selectedFile && newPerson?.id) {
                setImageUploadLoading(true);
                setImageUploadError(null);
                try {
                    const url = await uploadPersonImage(selectedFile, newPerson.id);
                    setUploadedImageUrl(url);
                    openUploadModal();
                } catch (imgErr: unknown) {
                    const errorMessage = imgErr instanceof Error ? imgErr.message : String(imgErr);
                    setImageUploadError(`อัปโหลดรูปภาพไม่สำเร็จ: ${errorMessage}`);
                    console.error("Error uploading image:", errorMessage);
                    alert(`อัปโหลดรูปภาพไม่สำเร็จ: ${errorMessage}`);
                } finally {
                    setImageUploadLoading(false);
                }
            } else {
                // If no image file, navigate to list page
                router.push(`/listpeople/${formData.placeId}`);
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(`บันทึกข้อมูลไม่สำเร็จ: ${errorMessage}`);
            console.error("Error saving person:", errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [formData, selectedFile, router, openUploadModal]);

    // handleCancel: Handle cancel action
    const handleCancel = useCallback(() => {
        router.back();
    }, [router]);

    // onDrop function: Handle file drop in Dropzone
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];

            // Check file size (limit to 5MB)
            const MAX_FILE_SIZE_MB = 5;
            if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                alert(`ขนาดไฟล์ควรน้อยกว่า ${MAX_FILE_SIZE_MB}MB`);
                setSelectedFile(null);
                setImageUploadError(`ขนาดไฟล์ใหญ่เกินไป (สูงสุด ${MAX_FILE_SIZE_MB}MB)`);
                return;
            }

            setSelectedFile(file);
            setUploadedImageUrl(null);
            setImageUploadError(null);
            console.log("File selected:", file.name);
        }
    }, []);

    // useDropzone hook for Dropzone functionality
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/png": [],
            "image/jpeg": [],
            "image/jpg": [],
        },
        maxFiles: 1,
    });

    // handlePhotoSave: Handle saving after successful image upload
    const handlePhotoSave = useCallback(() => {
        closeUploadModal();
        router.push(`/listpeople/${formData.placeId}`);
    }, [closeUploadModal, router, formData.placeId]);

    // handleModalClose: Handle modal close
    const handleModalClose = useCallback(() => {
        closeUploadModal();
        router.push(`/listpeople/${formData.placeId}`);
    }, [closeUploadModal, router, formData.placeId]);

    return {
        // State
        places,
        isLoading,
        error,
        formData,
        selectedFile,
        uploadedImageUrl,
        imageUploadLoading,
        imageUploadError,
        isUploadModalOpen,

        // Handlers
        handleInputChange,
        handleSave,
        handleCancel,
        handlePhotoSave,
        handleModalClose,

        // Dropzone
        getRootProps,
        getInputProps,
        isDragActive,
    };
}