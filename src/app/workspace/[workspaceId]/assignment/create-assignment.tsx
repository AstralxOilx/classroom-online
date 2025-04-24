import { Button } from "@/components/ui/button";
import { CalendarIcon, ChartNoAxesGantt, Paperclip, Plus } from "lucide-react";


import { useChannelId } from "@/hooks/use-channel-Id";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useCreateAssignmentWithFiles } from "@/features/assignments/api/use-crate-assignment";
import { useState } from "react";
import { toast } from "sonner";
import React from "react";

interface HeaderProps {
    title: string;
}

export const CreateAssignMent = ({ title }: HeaderProps) => {

    const [date, setDate] = useState<Date | undefined>(new Date());

    const [open, setOpen] = useState(false);

    const workspaceId = useWorkspaceId();
    const channelId = useChannelId();

    const router = useRouter();
    const { mutate, isPending } = useCreateAssignmentWithFiles();

    const [files, setFiles] = useState<File[]>([]);
    const [form, setForm] = useState({
        name: "",
        description: "",
        score: 10,
        publishDate: "",
        dueDate: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        }
    };

    const handleRemoveFile = (indexToRemove: number) => {
        setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
    };


    const handleSubmit = async () => {

        if (!form.name) {
            toast.error("กรุณาระบุชื่อการบ้าน!");
            return;
        }

        if (!form.publishDate) {
            toast.error("กรุณาระบุวันที่เผยแพร่!");
            return;
        }

        if (!form.dueDate) {
            toast.error("กรุณาระบุกำหนดส่ง!");
            return;
        }

        await mutate({
            name: form.name,
            description: form.description,
            score: Number(form.score),
            publishDate: new Date(form.publishDate).toISOString(),
            dueDate: new Date(form.dueDate).toISOString(),
            workspaceId,
            fileObjects: files,
        }, {
            onSuccess: () => {
                toast.success("สร้างการบ้านสำเร็จ!");
                setForm({
                    name: "",
                    description: "",
                    score: 10,
                    publishDate: "",
                    dueDate: "",
                });
                setFiles([]);
                setOpen(!open);
            },
            onError: () => {
                toast.success("เกิดข้อผิดพลาด สร้างการบ้านไม่สำเร็จ!");
            },
        });
    };

    return (
        <>
            <div className="bg-secondary/50 h-[45px] flex items-center px-4 overflow-hidden">
                <AlertDialog open={open}>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant={"outline"}
                            className="cursor-pointer"
                            onClick={() => setOpen(!open)}
                        >
                            <Plus className="size-4" />
                            {title}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle
                                className="flex gap-1 items-center p-2 bg-accent/80 rounded-sm text-lg "
                            ><Plus className="size-6" /> {title}</AlertDialogTitle>
                            <AlertDialogDescription></AlertDialogDescription>
                            <div className="p-2 overflow-y-auto messages-scrollbar h-96">
                                <div className="p-2 space-y-2">
                                    <div className="grid gap-1">
                                        <div className="flex gap-1 text-sm">
                                            <ChartNoAxesGantt className="size-5" />
                                            <p className="">ชื่อการบ้าน</p>
                                        </div>
                                        <Input disabled={isPending} type="text" name="name" placeholder="ชื่อการบ้าน" maxLength={50} onChange={handleChange} />
                                    </div>
                                    <div className="grid gap-1">
                                        <div className="flex gap-1 text-sm">
                                            <ChartNoAxesGantt className="size-5" />
                                            <p className="">คำอธิบาย</p>
                                        </div>
                                        <textarea disabled={isPending} name="description" placeholder="คำอธิบาย" maxLength={255} onChange={handleChange} className="h-24 p-2 border rounded-md" />
                                    </div>
                                    <div className="grid gap-1">
                                        <div className="flex gap-1 text-sm">
                                            <ChartNoAxesGantt className="size-5" />
                                            <p className="">คะแนน</p>
                                        </div>
                                        <Input disabled={isPending} type="number" name="score" placeholder="คะแนน" defaultValue={10} onChange={handleChange} />
                                    </div>
                                    <div className="grid gap-1">
                                        <div className="flex gap-1 text-sm">
                                            <ChartNoAxesGantt className="size-5" />
                                            <p className="">วันที่เผยแพร่</p>
                                        </div>
                                        <Input
                                            disabled={isPending}
                                            type="datetime-local"
                                            name="publishDate"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="grid gap-1">
                                        <div className="flex gap-1 text-sm">
                                            <ChartNoAxesGantt className="size-5" />
                                            <p className="">กำหนดส่ง</p>
                                        </div>
                                        <Input
                                            disabled={isPending}
                                            type="datetime-local"
                                            name="dueDate"
                                            onChange={handleChange}
                                        // min={new Date().toISOString().slice(0, 16)} // ป้องกันการเลือกเวลาย้อนหลัง
                                        />
                                    </div>
                                    {/* <Input disabled={isPending} type="date" name="publishDate" onChange={handleChange} /> */}
                                    {/* <Input disabled={isPending} type="date" name="dueDate" onChange={handleChange} /> */}
                                    <Input disabled={isPending} type="file" multiple onChange={handleFileChange} />

                                    {files.length > 0 && (
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            {files.map((file, index) => (
                                                <li key={index} className="flex justify-between items-center bg-muted/30 p-1 px-2 rounded">
                                                    <span className="flex gap-1 items-center justify-start"><Paperclip className="size-4" />{file.name}</span>
                                                    <Button
                                                        disabled={isPending}
                                                        // type="button"
                                                        variant={"ghost"}
                                                        onClick={() => handleRemoveFile(index)}
                                                        className="cursor-pointer hover:text-red-700 text-xs"
                                                    >
                                                        ลบ
                                                    </Button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                </div>

                            </div>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isPending} onClick={() => setOpen(!open)}>ยกเลิก</AlertDialogCancel>
                            <Button onClick={handleSubmit} disabled={isPending}>ตกลง</Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </>
    );

}