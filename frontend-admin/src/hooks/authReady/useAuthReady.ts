"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext-alternative";

export function useAuthReady() {
    const { user, isLoading } = useAuth();
    const [ ready, setReady ] = useState(false);

    useEffect(() => {
        if (!isLoading) setReady(true);
    }, [isLoading]);

    return { user, ready, isLoading };
}