import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { useCreateChannelModal } from "../store/use-create-channel-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCreateChannel } from "../api/use-crate-channel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


export const CreateChannelModal = () => {

    const router = useRouter();

    const workspaceId = useWorkspaceId();

    const [open, setOpen] = useCreateChannelModal();
    const [name, setName] = useState('');
    const { mutate, isPending } = useCreateChannel();


    const handleClose = () => {
        setName('');
        setOpen(false);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g, "-").toLowerCase();

        setName(value);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate(
            {
                name,
                workspaceId,
            },
            {
                onSuccess: (id) => {
                    router.push(`/workspace/${workspaceId}/channel/${id}`);
                    toast.success("เพิ่ม Channel สำเร็จ!");
                    handleClose();
                },
                onError: () => {
                    toast.error("เพิ่ม Channel ไม่สำเร็จ!");
                }
            }
        )
    }


    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>เพิ่ม Channel</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        value={name}
                        disabled={isPending}
                        onChange={handleChange}
                        required
                        autoFocus
                        maxLength={80}
                        minLength={3}
                        placeholder="e.g plan-budget"
                    />
                    <div className="flex justify-end">
                        <Button
                            disabled={isPending}
                        >
                            เพิ่ม
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}