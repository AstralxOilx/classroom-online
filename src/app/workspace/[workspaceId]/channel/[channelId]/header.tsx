import { Button } from "@/components/ui/button";
import { Hash, TrashIcon } from "lucide-react";
import { FaChevronDown } from "react-icons/fa";


import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useChannelId } from "@/hooks/use-channel-Id";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useUpdateChannel } from "@/features/channels/api/use-update-channel";
import { useRemoveChannel } from "@/features/channels/api/use-remove-channel";
import { useCurrentMember } from "@/features/members/api/use-current-member";



interface HeaderProps {
    title: string;
}

export const Header = ({ title }: HeaderProps) => {

    const workspaceId = useWorkspaceId();
    const channelId = useChannelId();

    const router = useRouter();

    const [ConfirmDialog, confirm] = useConfirm(
        "คุณแน่ใจแล้วใช่ไหม ?",
        "การกระทำนี้ไม่สามารถย้อนกลับได้!"
    );

    const { mutate: updateChannel, isPending: updateChannelLoading } = useUpdateChannel();
    const { mutate: removeChannel, isPending: removeChannelLoading } = useRemoveChannel();

    const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId });

    const [value, setValue] = useState(title);
    const [editOpen, setEditOpen] = useState(false);


    const handleEditOpen = (value: boolean) => {

        if (member?.role !== "teacher") return;

        setEditOpen(value);
    }

    const handleChang = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g, "-");
        setValue(value);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        updateChannel({
            id: channelId,
            name: value,
        },
            {
                onSuccess: () => {
                    toast.success("อัปเดต Channel สำเร็จ!");
                    setEditOpen(false);
                },
                onError: () => {
                    toast.error("อัปเดต Channel ไม่สำเร็จ!");
                }
            }
        )
    }

    const handleRemove = async () => {
        const ok = await confirm();

        if (!ok) return;

        removeChannel({ id: channelId }, {
            onSuccess: () => {
                toast.success("ลบ Channel สำเร็จ!");
                setEditOpen(false);
                router.push(`/workspace/${workspaceId}`);
            },
            onError: () => {
                toast.error("ลบ Channel ไม่สำเร็จ!");
            }
        })

    }


    return (
        <>
            <ConfirmDialog />
            <div className="bg-secondary/50 h-[45px] flex items-center px-4 overflow-hidden">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant={"outline"}
                            className="text-sm font-semibold px-2 overflow-hidden w-auto cursor-pointer rounded-sm border-none"
                            size={"sm"}
                        >

                            <span className="truncate flex items-center"><Hash className="size-4" />{title}</span>
                            <FaChevronDown className="size-2.5 ml-2" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="p-0 bg-gray-50 overflow-hidden">
                        <DialogHeader className="p-4 border-b bg-background">
                            <DialogTitle>
                                <span className="truncate flex items-center"><Hash  className="size-4" />{title}</span>
                            </DialogTitle>
                        </DialogHeader>
                        <div className="px-4 pb-4 flex flex-col gap-y-2">
                            <Dialog open={editOpen} onOpenChange={handleEditOpen}>
                                <DialogTrigger asChild>
                                    <div className="px-5 py-4 bg-background rounded-md border cursor-pointer hover:bg-secondary/30">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-semibold">Channel name</p>
                                            {
                                                member?.role === "teacher" && (
                                                    <p className="text-sm text-primary hover:underline font-semibold">
                                                        แก้ไข
                                                    </p>
                                                )
                                            }
                                        </div>
                                        <span className="text-sm truncate flex items-center"><Hash className="size-4" />{title}</span>
                                    </div>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>เปลี่ยนชื่อ Channel</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmit} className=" space-y-4 ">
                                        <Input
                                            value={value}
                                            disabled={updateChannelLoading}
                                            onChange={handleChang}
                                            required
                                            autoFocus
                                            maxLength={80}
                                            minLength={3}
                                            placeholder="Class name e.g. 'Work' ,'Personal' ,'Home'"
                                        />
                                    </form>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button
                                                variant={"outline"}
                                                disabled={updateChannelLoading}

                                            >
                                                ยกเลิก
                                            </Button>
                                        </DialogClose>
                                        <Button disabled={updateChannelLoading}>
                                            บันทึก
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            {
                                member?.role === "teacher" ? (
                                    <Button
                                        variant={"destructive"}
                                        className="cursor-pointer mt-6"
                                        size={"lg"}
                                        onClick={handleRemove}
                                    >
                                        <TrashIcon className="size-4" />
                                        <p className="text-sm font-semibold">ลบ Channel</p>
                                    </Button>
                                ): null
                            }

                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );

}