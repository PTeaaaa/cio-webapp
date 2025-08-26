"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function useAuthReady() {
    const { user, isLoading, isRefreshing } = useAuth();
    const [ ready, setReady ] = useState(false);

    useEffect(() => {
        if (!isLoading && !isRefreshing) setReady(true);
    }, [isLoading, isRefreshing]);

    return { user, ready, isLoading, isRefreshing };
}