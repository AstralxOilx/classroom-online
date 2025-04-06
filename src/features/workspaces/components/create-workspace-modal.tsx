
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCreateWorkspace } from "../api/use-crate-workspace";
import { useRouter } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner"; 






export const CreateWorkspaceModal = () => {

    const router = useRouter();

    const [open, setOpen] = useCreateWorkspaceModal();
    const [name, setName] = useState('');

    const { mutate, isPending } = useCreateWorkspace();

   

    const handleClose = () => {
        setOpen(false);
        setName('');
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        mutate({ name }, {
            onSuccess(id) {
                toast.success("Workspace created");
                router.push(`/workspace/${id}`);
                handleClose();
            }
        })

    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>สร้างห้องเรียนใหม่</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isPending}
                        required
                        autoFocus
                        minLength={3}
                        placeholder="Class name e.g. 'Work' ,'Personal' ,'Home'"
                    />
                    <div className="flex justify-end">
                        <Button disabled={isPending}>
                            สร้าง
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
