"use client";

import { CreateWorkspaceModal } from "@/app/features/workspaces/components/create-workspace-modal";
import { CreateChannelModal } from "@/app/features/channels/components/create-channels-modal";
import { useEffect, useState } from "react";

export const Modals = () => {
    const [mounted, setMounted] = useState(false);


    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <>
            <CreateChannelModal />
            <CreateWorkspaceModal />
        </>
    )
}