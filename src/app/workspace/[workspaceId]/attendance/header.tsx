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
 


    return (
        <>
            <ConfirmDialog />
            <div className="bg-secondary/50 h-[45px] flex items-center px-4 overflow-hidden">
                 {title}
            </div>
        </>
    );

}