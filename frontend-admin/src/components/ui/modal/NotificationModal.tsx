"use client";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

interface NotificationProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  autoDismissTime?: number; // in milliseconds
  variant?: "success" | "error" | "warning" | "info";
  position?: "top" | "bottom";
}

const variantStyles = {
  success: {
    gradient: "from-green-600 to-green-300",
    iconBg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
    borderColor: "border-green-500",
    hoverColor: "bg-green-500",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  error: {
    gradient: "from-red-600 to-red-300",
    iconBg: "bg-red-100 dark:bg-red-900/30",
    iconColor: "text-red-600 dark:text-red-400",
    borderColor: "border-red-500",
    hoverColor: "bg-red-500",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
  warning: {
    gradient: "from-yellow-600 to-yellow-300",
    iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    borderColor: "border-yellow-500",
    hoverColor: "bg-yellow-500",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  info: {
    gradient: "from-blue-600 to-blue-300",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    borderColor: "border-blue-500",
    hoverColor: "bg-blue-500",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

export default function NotificationModal({
  isOpen,
  onClose,
  title,
  message,
  autoDismissTime = 5000,
  variant = "success",
  position = "top",
}: NotificationProps) {
  const [progress, setProgress] = useState(100);
  const style = variantStyles[variant];

  useEffect(() => {
    if (!isOpen) {
      setProgress(100);
      return;
    }

    // Auto dismiss timer
    const dismissTimer = setTimeout(() => {
      onClose();
    }, autoDismissTime);

    // Progress bar animation
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / autoDismissTime) * 100);
      setProgress(remaining);

      if (remaining === 0) {
        clearInterval(progressInterval);
      }
    }, 16); // ~60fps

    return () => {
      clearTimeout(dismissTimer);
      clearInterval(progressInterval);
    };
  }, [isOpen, onClose, autoDismissTime]);

  if (!isOpen) return null;

  const positionClasses = position === "top"
    ? "top-4 animate-slide-down"
    : "bottom-4 animate-slide-up";

  return (
    <>
      <div
        className={`fixed ${positionClasses} left-1/2 z-99999 w-full max-w-md px-4`}
        style={{ transform: 'translateX(-50%)' }}
      >
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Progress Bar */}
          <div className="h-1 bg-gray-200 dark:bg-gray-700 w-full">
            <div
              className={`h-full bg-gradient-to-r ${style.gradient} transition-all duration-75 ease-linear`}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Content */}
          <div className="flex items-center gap-4 p-4">
            {/* Icon */}
            <div className={`flex-shrink-0 w-12 h-12 rounded-full ${style.iconBg} flex items-center justify-center ${style.iconColor}`}>
              {style.icon}
            </div>

            {/* Message */}
            <div className="flex-1">
              <p className="text-base font-semibold text-gray-800 dark:text-white">
                {title}
              </p>
              {message && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {message}
                </p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Auto-dismiss in {Math.ceil((progress / 100) * (autoDismissTime / 1000))}s
              </p>
            </div>

            {/* Close Button */}
            <button
              className={`flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full border-2 ${style.borderColor} ${style.iconColor} hover:${style.hoverColor} transition-all duration-200 ease-in-out`}
              onClick={onClose}
              aria-label="Close notification"
            >
              <X className="w-5 h-5 text-black dark:text-white" />
            </button>
          </div>
        </div>
      </div>

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

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(2rem);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
