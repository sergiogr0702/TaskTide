"use client";

import { useOrganizationList } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export const OrganizationControl = () => {
    const params = useParams();
    const { setActive } = useOrganizationList();

    useEffect(() => {
        if (!setActive) return;
        setActive({
            organization: params.orgId as string,
        });
    }, [setActive, params.orgId])


    return null;
};