"use client"


import React, { useEffect, useState } from 'react'
import { Header } from '../header'
import { Input } from '@/components/ui/input'
import CreateAttendanceSession from '@/features/attendances/components/create-attendance-session';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { useRouter } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';

function CreateCheckInPage() {


    const router = useRouter();

    const workspaceId = useWorkspaceId();

    const { data: currentMember, isLoading: isLoadingCurrentMember } = useCurrentMember({
        workspaceId
    });

    useEffect(() => {
        if (!currentMember || !workspaceId) return;  

        if (currentMember.role !== "teacher") {
            router.replace(`/workspace/${workspaceId}`);
        }
    }, [currentMember, workspaceId]);

    if (!currentMember || !workspaceId || isLoadingCurrentMember || currentMember?.role !== "teacher") {
        return ( 
            <div className="h-full flex-1 flex justify-center items-center flex-col gap-2 ">
                <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <>
            <Header title='สร้างการเช็คชื่อ' />
            <div className="w-full h-full flex-1 flex flex-col items-center justify-center p-4 overflow-y-auto messages-scrollbar">
                <CreateAttendanceSession />
            </div>
        </>
    )
}

export default CreateCheckInPage