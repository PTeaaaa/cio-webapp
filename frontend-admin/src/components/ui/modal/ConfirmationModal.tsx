"use client";
import React from "react";
import { Modal } from "./index";
import Button from "../button/Button";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmationCard: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title = "มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก",
  message = "คุณมีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก คุณต้องการปิดโดยที่ไม่บันทึกหรือไม่?",
  confirmText = "ละทิ้งและปิด",
  cancelText = "ยกเลิก",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} className="max-w-xl m-4" showCloseButton={false}>
      <div className="p-6 lg:p-11">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {message}
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};