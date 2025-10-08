'use client';
import { Modal } from ".";
import { useState } from "react";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    requiredText?: string;
}

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, requiredText }: DeleteConfirmationModalProps) {
    const [inputText, setInputText] = useState("");
    const [error, setError] = useState("");

    const handleClose = () => {
        setInputText("");
        setError("");
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            className="max-w-[600px] p-5 lg:p-10"
        >
            <div className="text-center">
                <div className="relative flex items-center justify-center z-1 mb-3">
                    <svg
                        width="100"
                        height="100"
                        viewBox="0 0 15 15"
                        id="triangle"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="fill-error-50 dark:fill-error-300/15 -mt-4">
                        <path id="path21090-9" d="M7.5385,2&#xA;&#x9;C7.2437,2,7.0502,2.1772,6.9231,2.3846l-5.8462,9.5385C1,12,1,12.1538,1,12.3077C1,12.8462,1.3846,13,1.6923,13h11.6154&#xA;&#x9;C13.6923,13,14,12.8462,14,12.3077c0-0.1538,0-0.2308-0.0769-0.3846L8.1538,2.3846C8.028,2.1765,7.7882,2,7.5385,2z" />
                    </svg>

                    <span className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                        <svg
                            className="fill-error-600 dark:fill-error-500"
                            width="38"
                            height="38"
                            viewBox="0 0 38 38"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9.62684 11.7496C9.04105 11.1638 9.04105 10.2141 9.62684 9.6283C10.2126 9.04252 11.1624 9.04252 11.7482 9.6283L18.9985 16.8786L26.2485 9.62851C26.8343 9.04273 27.7841 9.04273 28.3699 9.62851C28.9556 10.2143 28.9556 11.164 28.3699 11.7498L21.1198 18.9999L28.3699 26.25C28.9556 26.8358 28.9556 27.7855 28.3699 28.3713C27.7841 28.9571 26.8343 28.9571 26.2485 28.3713L18.9985 21.1212L11.7482 28.3715C11.1624 28.9573 10.2126 28.9573 9.62684 28.3715C9.04105 27.7857 9.04105 26.836 9.62684 26.2502L16.8771 18.9999L9.62684 11.7496Z"
                                fill=""
                            />
                        </svg>
                    </span>
                </div>

                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-title-sm">
                    Alert!
                </h4>
                <p className="text-base leading-6 text-gray-500 dark:text-gray-400">
                    คุณกำลังจะลบ account นี้ คุณต้องการลบหรือไม่
                </p>
                <p className="text-base leading-6 text-gray-500 dark:text-gray-400">
                    หากต้องการ กรุณากรอกข้อความดังต่อไปนี้ให้ถูกต้องทุกตัวอักษร
                </p>
                <p className="font-semibold text-red-400 pt-3 select-none">" {requiredText} "</p>

                <div className="mt-7">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => {
                            setInputText(e.target.value);
                            setError("");
                        }}
                        placeholder="กรุณากรอกข้อความ"
                        className="w-full px-4 py-3 text-sm font-medium text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-error-500"
                    />
                    {error && (
                        <p className="mt-2 text-sm text-red-500">{error}</p>
                    )}
                    <div className="flex items-center justify-center gap-3 mt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-theme-xs hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                if (inputText.trim() === requiredText) {
                                    setError("");
                                    setInputText("");
                                    onConfirm();
                                    onClose();
                                } else {
                                    setError("ข้อความไม่ถูกต้อง กรุณากรอกข้อความให้ตรงกัน");
                                }
                            }}
                            className="px-4 py-3 text-sm font-medium text-white rounded-lg bg-error-500 shadow-theme-xs hover:bg-error-600"
                        >
                            ยืนยันการลบ
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}