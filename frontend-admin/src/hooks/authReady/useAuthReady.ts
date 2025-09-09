"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function useAuthReady() {
    const { user, isLoading, isLoggingOut } = useAuth();
    const [ ready, setReady ] = useState(false);

    useEffect(() => {
        // Only mark as ready when not loading and not logging out
        if (!isLoading && !isLoggingOut) {
            setReady(true);
        } else {
            setReady(false);
        }
    }, [isLoading, isLoggingOut]);

    return { user, ready, isLoading, isLoggingOut };
}