"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { usePeople } from "@/contexts/PeopleContext";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import { ConfirmationCard } from "../ui/modal/ConfirmationCard";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import ComponentCard from '@/components/common/ComponentCard';
import Select from '@/components/form/Select';
import { ChevronDownIcon, EyeCloseIcon, EyeIcon, TimeIcon } from '@/icons';
import DatePicker from '@/components/form/date-picker';

interface FormData {
    prefix: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
}

export default function EgInfoCard() {
    const router = useRouter();
    const { addPerson } = usePeople();

    const [formData, setFormData] = useState<FormData>({
        prefix: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        position: "",
    });

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        
        if (!formData.firstName || !formData.lastName || !formData.email) {
            alert("ข้อมูลที่จำเป็นยังถูกกรอกไม่ครบ กรุณากรอกข้อมูลที่จำเป็น");
            return;
        }

        // Add person to context
        addPerson(formData);

        // Navigate back to list page
        router.push('/ListPeople');
    };

    const handleCancel = () => {
        router.push('/ListPeople');
    };

    const options = [
        { value: "marketing", label: "Marketing" },
        { value: "template", label: "Template" },
        { value: "development", label: "Development" },
    ];

    return (
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            <ComponentCard title="ข้อมูลส่วนตัว" className="w-full">
                <div className="gap-x-6 gap-y-6 px-2 grid grid-cols-1 md:grid-cols-2">
                    <div>
                        <Label>คำนำหน้า</Label>
                        <Input 
                            type="text" 
                            placeholder="ตัวอย่าง : นาง นายแพทย์"
                            defaultValue={formData.prefix}
                            onChange={(e) => handleInputChange('prefix', e.target.value)}
                        />
                    </div>
                    <div>
                        <Label>ชื่อ<span className="text-red-500">*</span></Label>
                        <Input 
                            type="text" 
                            placeholder="ตัวอย่าง : พรสวรรค์"
                            defaultValue={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                        />
                    </div>
                    <div>
                        <Label>นามสกุล<span className="text-red-500">*</span></Label>
                        <Input 
                            type="text" 
                            placeholder="ตัวอย่าง : ก้อยสุวรรณ"
                            defaultValue={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                        />
                    </div>
                    <div>
                        <Label>อีเมล<span className="text-red-500">*</span></Label>
                        <Input 
                            type="email" 
                            placeholder="fishstop@ussr.com"
                            defaultValue={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                    </div>
                    <div>
                        <Label>เบอร์โทรศัพท์</Label>
                        <Input 
                            type="text" 
                            placeholder="02 590 1214"
                            defaultValue={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                    </div>
                    <div className="">
                        <Label>ตำแหน่งตามหน่วยงานที่สังกัด</Label>
                        <Input 
                            type="text" 
                            placeholder="ตัวอย่าง : ผู้อำนวยการศูนย์เทคโนโลยีสารสนเทศและการสื่อสาร"
                            defaultValue={formData.position}
                            onChange={(e) => handleInputChange('position', e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="flex justify-end gap-4 mt-6">
                    <Button 
                        variant="outline" 
                        onClick={handleCancel}
                    >
                        ยกเลิก
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleSave}
                    >
                        บันทึก
                    </Button>
                </div>
            </ComponentCard>
        </div>
    );
}