"use client"


import React, { useEffect, useState } from 'react'
import { Header } from '../header'
import { Input } from '@/components/ui/input'
import CreateAttendanceSession from '@/features/attendances/components/create-attendance-session';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useRouter } from 'next/navigation';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { LoaderCircle } from 'lucide-react';
import RecordAttendance from '@/features/attendances/components/record-attendance';

function CreateCheckInPage() {

    const router = useRouter();

    const workspaceId = useWorkspaceId();

    const { data: currentMember, isLoading: isLoadingCurrentMember } = useCurrentMember({
        workspaceId
    });


    if (!currentMember || !workspaceId || isLoadingCurrentMember || status === "LoadingFirstPage") {
        return (
            <div className="h-full flex-1 flex justify-center items-center flex-col gap-2 ">
                <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <>
            <Header title='ประวัติการเช็คชื่อ' />
            <div className="w-full h-full flex-1 flex flex-col items-center justify-center p-4 overflow-y-auto messages-scrollbar">
                 
            </div>
        </>
    )
}

export default CreateCheckInPage