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

function Attendance() {

    const router = useRouter();

    const workspaceId = useWorkspaceId();

    const [statusAttendance, setStatusAttendance] = useState<"present" | "late" | "leave">("present");
    const [description, setDescription] = useState("");

    const [AttendanceDialog, confirmAttendance] = useConfirm(
        "เริ่มการเช็คชื่อ?",
        "การกระทำนี้ไม่สามารถย้อนกลับได้!"
    );


    const { data: currentMember, isLoading: isLoadingCurrentMember } = useCurrentMember({
        workspaceId
    });


    const { mutate: createAttendance } = useAttendance();


    const { data: attendanceSession, isLoading: loadingAttendanceSession } = useGetAttendanceSession({ workspaceId });

    const handleAttendance = async (sessionId: string) => {

        const ok = await confirmAttendance();
        if (!ok) return;
        try {
            if (statusAttendance === "leave" && description.trim() === "") { 
                toast.error("กรุณาระบุเหตุผลการลา!");
                return;
            }
            await createAttendance({
                sessionId: sessionId as Id<"attendanceSession">,
                status: statusAttendance,
                description: description,
            });
            toast.success("เริ่มสร้างการเช็คชื่อแล้ว!");
        } catch (error) {
            toast.error("เกิดข้อผิดพลาด บางอย่าง!");
        }

    }

    if (currentMember?.role !== "student" || isLoadingCurrentMember || loadingAttendanceSession) {
        return (
            <div className="h-full flex-1 flex justify-center items-center flex-col gap-2 ">
                <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
            </div>
        );
    }



    return (
        <div className="w-full h-full flex-1 flex flex-col gap-2 items-center mb-8 overflow-y-auto messages-scrollbar">
            {
                attendanceSession?.sessions.map((session) => (
                    <div key={session._id} >
                        <AttendanceDialog />
                        {
                            session.alreadyAttendance ? (
                                <div className="w-full max-w-md grid gap-2 border rounded-md p-4">
                                    <div className="grid gap-1">
                                        <p className="text-md font-semibold bg-accent rounded-md p-2">
                                            {session.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            เริ่มการเช็คชื่อ : {formatDate(session.startTime)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            สิ้นสุดการเช็คชื่อ : {formatDate(session.endTime)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            สิ้นสุดการสอน : {formatDate(session.endTeaching)}
                                        </p>
                                    </div>
                                    <div className="space-y-4">
                                        {session.attendanceData?.status === "leave" && (
                                            <div className="space-y-1">
                                                <p className="text-yellow-600 font-medium">สถานะ: ลา</p>
                                                <p className="block text-md font-semibold text-gray-700">
                                                    เหตุผลการลา
                                                </p>
                                                <p className="block text-sm text-gray-700">
                                                    {session.attendanceData?.description}
                                                </p>
                                            </div>
                                        )}
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
                            ) : (
                                <div className="w-full max-w-md grid gap-2 border rounded-md p-4">
                                    <div className="grid gap-1">
                                        <p className="text-md font-semibold bg-accent rounded-md p-2">
                                            {session.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            เริ่มการเช็คชื่อ : {formatDate(session.startTime)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            สิ้นสุดการเช็คชื่อ : {formatDate(session.endTime)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            สิ้นสุดการสอน : {formatDate(session.endTeaching)}
                                        </p>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">สถานะการเข้าเรียน</label>
                                            <Select
                                                value={statusAttendance}
                                                onValueChange={(value) => setStatusAttendance(value as "present" | "late" | "leave")}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="เลือกสถานะ" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="present">มาเรียน</SelectItem>
                                                    <SelectItem value="leave">ลา</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {statusAttendance === "leave" && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    เหตุผลการลา <span className="text-red-500">*</span>
                                                </label>
                                                <textarea 
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    rows={3}
                                                    className="p-2 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                    placeholder="ใส่เหตุผล เช่น ลาป่วย, ติดธุระ ฯลฯ"
                                                    maxLength={255}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-4">
                                        <div>

                                        </div>
                                        <Button
                                            onClick={() => handleAttendance(session._id)}
                                            className="cursor-pointer"
                                            disabled={false}
                                        >
                                            เช็คชื่อเข้าเรียน
                                        </Button>
                                    </div>
                                </div >
                            )
                        }
                    </div >
                ))
            }

        </div >
    )
}

export default Attendance