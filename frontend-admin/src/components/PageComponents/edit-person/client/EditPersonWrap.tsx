"use client";

import React from "react";
import { PeopleProvider } from "@/contexts/PeopleContext";
import { useSearchParams } from "next/navigation";
import EditPersonMain from "@/components/PageComponents/edit-person/client/EditPersonMain";

export default function EditPersonWrap() {
    const searchParams = useSearchParams();
    const placeId = searchParams.get('placeId');

    // Freaking Technical Debt and SHIT Design from past noob version of myself: We need to wrap EditPersonMain with PeopleProvider here
    // because usePeople() inside EditPersonMain requires the context to be present.
    // However, we cannot do this inside Page file because it needs to be a client component
    // and we cannot use useSearchParams() in a server component to get placeId.
    // So we have to do this wrapping here in this intermediate component.

    // This is a messy workaround due to the limitations of Next.js app router and React context.

    // Ideally, we would refactor to use a more robust state management solution library

    return (
        <PeopleProvider initialPlaceId={placeId || undefined}>
            <EditPersonMain />
        </PeopleProvider>
    );
}