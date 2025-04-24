"use client"


import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { AlertTriangle, LoaderCircle, RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCreateAttendanceSession } from '../api/use-crate-attendance';
import { useConfirm } from '@/hooks/use-confirm';
import { toast } from 'sonner';

function CreateAttendanceSession() {

    const router = useRouter();

    const workspaceId = useWorkspaceId();

    const [CreateAttendanceSessionDialog, confirmCreateAttendanceSession] = useConfirm(
        "เริ่มการสร้างการเช็คชื่อ?",
        "การกระทำนี้ไม่สามารถย้อนกลับได้!"
    );


    const [form, setForm] = useState({
        title: "",
        startTime: "",
        endTime: "",
        endTeaching:"",
    });
    const { data: currentMember, isLoading: isLoadingCurrentMember } = useCurrentMember({
        workspaceId
    });

    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toLocaleDateString("th-TH", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
        setForm((prev) => ({
            ...prev,
            title: `เช็คชื่อประจำวันที่ ${formattedDate}`,
        }));
    }, []);



    const { mutate: createAttendanceSession } = useCreateAttendanceSession();


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCreateAttendanceSession = async () => {

        const ok = await confirmCreateAttendanceSession();
        if (!ok) return;

        if (!form.title) {
            toast.error("กรุณาระบุ หัวข้อ!");
            return;
        }

        if (!form.startTime) {
            toast.error("กรุณาระบุ เวลาเริ่มการเช็คชื่อ!");
            return;
        }

        if (!form.endTime) {
            toast.error("กรุณาระบุ เวลาสิ้นสุดการเช็คชื่อ!");
            return;
        }


        try {
            await createAttendanceSession({
                workspaceId: workspaceId,
                title: form.title,
                startTime: new Date(form.startTime).toISOString(),
                endTime: new Date(form.endTime).toISOString(),
                endTeaching: new Date(form.endTeaching).toISOString(),
            });
            toast.success("เริ่มสร้างการเช็คชื่อแล้ว!");
        } catch (error) {
            toast.error("เกิดข้อผิดพลาด บางอย่าง!");
        }

    }

    if (currentMember?.role !== "teacher" || isLoadingCurrentMember) {
        return (
            <div className="h-full flex-1 flex justify-center items-center flex-col gap-2 ">
                <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
            </div>
        );
    }



    return (
        <>
            <CreateAttendanceSessionDialog />
            <div className="w-full h-full flex-1 flex flex-col items-center justify-center p-4 overflow-y-auto messages-scrollbar">
                <div className='w-full max-w-96 grid gap-2 border rounded-md p-4'>
                    <div className='grid gap-1'>
                        <p className='text-md font-semibold'>เรื่อง</p>
                        <Input
                            disabled={false}
                            placeholder=''
                            name='title'
                            id='title'
                            value={form.title}
                            onChange={handleChange}
                            required
                            maxLength={50}
                        />
                    </div>
                    <div className='grid gap-1'>
                        <p className='text-md font-semibold'>เริ่มการเช็คชื่อ</p>
                        <Input
                            disabled={false}
                            type="datetime-local"
                            name="startTime"
                            id='startTime'
                            onChange={handleChange}
                            required
                        // min={new Date().toISOString().slice(0, 16)} // ป้องกันการเลือกเวลาย้อนหลัง
                        />
                    </div>
                    <div className='grid gap-1'>
                        <p className='text-md font-semibold'>สิ้นสุดการเช็คชื่อ</p>
                        <Input
                            disabled={false}
                            type="datetime-local"
                            name="endTime"
                            id='endTime'
                            onChange={handleChange}
                            required
                        // min={new Date().toISOString().slice(0, 16)} // ป้องกันการเลือกเวลาย้อนหลัง
                        />
                    </div>
                    <div className='grid gap-1'>
                        <p className='text-md font-semibold'>สิ้นสุดการสอน</p>
                        <Input
                            disabled={false}
                            type="datetime-local"
                            name="endTeaching"
                            id='endTeaching'
                            onChange={handleChange}
                            required
                        // min={new Date().toISOString().slice(0, 16)} // ป้องกันการเลือกเวลาย้อนหลัง
                        />
                    </div>
                    <Button
                        variant={"default"}
                        className="cursor-pointer"
                        onClick={handleCreateAttendanceSession}
                    >เริ่มสร้างการเช็คชื่อ</Button>
                </div>
            </div>
        </>
    )
}

export default CreateAttendanceSession