"use client";

import React, { useEffect, useState } from "react";
import TimeLimitModal from "@/components/ui/modal/NotificationModal";

export default function ListAccountsNotification() {
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [title, setTitle] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [variant, setVariant] = useState<"success" | "error" | "warning" | "info">("success");
    const autoDismissTime = 5000;
    const position: "top" | "bottom" = "top";

    useEffect(() => {
        // Check sessionStorage for notification
        const notificationData = sessionStorage.getItem('placeNotification');

        if (notificationData) {
            try {
                const notification = JSON.parse(notificationData);

                // Only handle 'created' and 'deleted' type notifications on this page
                if (notification.type === 'created' || notification.type === 'deleted') {
                    setTitle(notification.title || "");
                    setMessage(notification.message || "");
                    setVariant(notification.variant || "success");
                    setShowSuccessNotification(true);

                    // Clear the notification from sessionStorage immediately
                    sessionStorage.removeItem('placeNotification');
                }
            } catch (error) {
                console.error("Error parsing notification data:", error);
                sessionStorage.removeItem('placeNotification');
            }
        }
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