"use client"


import React, { useEffect, useState } from 'react';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useConfirm } from '@/hooks/use-confirm';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useAttendance } from '../api/use-attendance';
import { Id } from '../../../../convex/_generated/dataModel';
import { useGetAttendanceSession } from '../api/use-get-attendacne-session';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long', // วัน
        year: 'numeric', // ปี
        month: 'long',   // เดือน
        day: 'numeric',  // วันในเดือน
        hour: '2-digit', // ชั่วโมง
        minute: '2-digit', // นาที
        second: '2-digit', // วินาที
        // timeZoneName: 'short', // ชื่อเขตเวลา (เช่น UTC+7)
    };

    return date.toLocaleDateString('th-TH', options);
};

function RecordAttendance() {


    const workspaceId = useWorkspaceId();


    const { data: currentMember, isLoading: isLoadingCurrentMember } = useCurrentMember({
        workspaceId
    });

    const { data: attendanceSession, isLoading: loadingAttendanceSession } = useGetAttendanceSession({ workspaceId });



    if (currentMember?.role !== "student" || isLoadingCurrentMember || loadingAttendanceSession) {
        return (
            <div className="h-full flex-1 flex justify-center items-center flex-col gap-2 ">
                <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
            </div>
        );
    }



    return (
        <div className="w-full h-full flex-1 flex flex-col gap-2 items-center mb-8 overflow-y-auto messages-scrollbar">
            <div className="w-full max-w-md grid gap-2 border rounded-md p-4">
                <div className="grid gap-1">
                    <p className="text-md font-semibold bg-accent rounded-md p-2">
                        
                    </p>
                    <p className="text-xs text-muted-foreground">
                        เริ่มการเช็คชื่อ : 
                    </p>
                    <p className="text-xs text-muted-foreground">
                        สิ้นสุดการเช็คชื่อ :  
                    </p>
                    <p className="text-xs text-muted-foreground">
                        สิ้นสุดการสอน :  
                    </p>
                </div>
                <div className="space-y-4">
                    {/* {session.attendanceData?.status === "leave" && (
                        <div className="space-y-1">
                            <p className="text-yellow-600 font-medium">สถานะ: ลา</p>
                            <p className="block text-md font-semibold text-gray-700">
                                เหตุผลการลา
                            </p>
                            <p className="block text-sm text-gray-700">
                                {session.attendanceData?.description}
                            </p>
                        </div>
                    )} */}
                </div>
                <div className="mt-4">
                    <Button
                        disabled={false}
                        variant={"secondary"}
                    >
                        เช็คชื่อเข้าเรียน
                    </Button>
                </div>
            </div>
        </div >
    )
}

export default RecordAttendance