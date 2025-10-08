"use client";

import React, { useEffect, useState } from "react";
import TimeLimitModal from "@/components/ui/modal/NotificationModal";

export default function AddAccountNotification() {
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [title, setTitle] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [variant, setVariant] = useState<"success" | "error" | "warning" | "info">("success");
    const autoDismissTime = 7000;
    const position: "top" | "bottom" = "top";

    useEffect(() => {
        // Check sessionStorage for notification periodically to catch async updates
        const checkNotification = () => {
            const notificationData = sessionStorage.getItem('accountNotification');

            if (notificationData) {
                try {
                    const notification = JSON.parse(notificationData);

                    // Only handle 'duplicated' type notifications on this page
                    // 'created' notifications are for listaccounts page
                    if (notification.type === 'duplicated') {
                        setTitle(notification.title || "");
                        setMessage(notification.message || "");
                        setVariant(notification.variant || "success");
                        setShowSuccessNotification(true);

                        // Clear the notification from sessionStorage
                        sessionStorage.removeItem('accountNotification');
                        return true; // Found and processed
                    }
                } catch (error) {
                    console.error("Error parsing notification data:", error);
                    sessionStorage.removeItem('accountNotification');
                }
            }
            return false;
        };

        // Check immediately
        if (checkNotification()) {
            return; // Skip setting up listeners - notification already handled
        }

        // Listen for custom event to trigger immediate check
        const handleNotificationUpdate = () => {
            checkNotification();
        };

        window.addEventListener('accountNotificationUpdate', handleNotificationUpdate);

        // Also check with delay timing to catch async updates
        const timeout = setTimeout(() => {
            checkNotification();
        }, 100);

        return () => {
            window.removeEventListener('accountNotificationUpdate', handleNotificationUpdate);
            clearTimeout(timeout);
        };
    }, []);

    const handleNotificationClose = () => {
        setShowSuccessNotification(false);
    };

    return (
        <TimeLimitModal
            isOpen={showSuccessNotification}
            onClose={handleNotificationClose}
            title={title}
            message={message}
            variant={variant}
            autoDismissTime={autoDismissTime}
            position={position}
        />
    );
}