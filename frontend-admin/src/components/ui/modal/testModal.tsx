"use client";
import React, { useEffect, useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import Button from "../button/Button";
import { useModal } from "@/hooks/useModal";
import { X } from "lucide-react";

export default function TestModal() {
  const { isOpen, openModal, closeModal } = useModal();
  const [progress, setProgress] = useState(100);
  const AUTO_DISMISS_TIME = 5000; // 5 seconds

  return (
    <ComponentCard title="Test Component">
      <Button size="sm" onClick={openModal}>
        Show Notification
      </Button>

      {/* Notification Card - Only shows when isOpen is true */}
      {isOpen && (
        <div className="fixed top-4 left-1/2 z-99999 w-full max-w-md px-4 animate-slide-down" style={{ transform: 'translateX(-50%)' }}>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">

            {/* Progress Bar */}
            <div className="h-1 bg-gray-200 dark:bg-gray-700 w-full">
              <div
                className="h-full bg-gradient-to-r from-green-600 to-green-300 transition-all duration-75 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Content */}
            <div className="flex items-center gap-4 p-4">
              {/* Message */}
              <div className="flex-1">
                <p className="text-base font-semibold text-gray-800 dark:text-white">
                  Data deleted successfully
                </p>
              </div>

              {/* Close Button */}
              <button
                className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 ease-in-out"
                onClick={closeModal}
                aria-label="Close notification"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-2rem);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </ComponentCard>
  );
}
