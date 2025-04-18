"use client";

import { Button } from "@/components/ui/button";
import { useCreateOrGetConversation } from "@/features/conversations/api/use-create-or-get-conversation";
import { useMemberId } from "@/hooks/use-member-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { AlertTriangle, LoaderCircle, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Conversation } from "./conversation";

const MemberIdPage = () => {
    const router = useRouter();

    const memberId = useMemberId();
    const workspaceId = useWorkspaceId();

    const { data, mutate, isPending } = useCreateOrGetConversation();

    const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null);

    useEffect(() => {
        mutate({
            workspaceId,
            memberId,
        }, {
            onSuccess(data) {
                setConversationId(data);
            },
            onError() {
                toast.error("เกิดข้อผิดพลาด สร้างหรือค้นหาผู้ใช้ไม่สำเร็จ!");
            },
        })
    }, [memberId, workspaceId, mutate]);

    if (isPending) {
        return (
            <div className="h-full  flex-1 flex items-center justify-center flex-col gap-2 ">
                <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!conversationId) {
        return (
            <div className="flex flex-col gap-y-2 h-full items-center justify-center">
                <AlertTriangle className="size-8 text-red-700" />
                <p className="text-red-700 text-sm">
                    ไม่พบข้อมูล ลองใหม่อีกครั้ง!
                </p>
                <Button
                    variant={"outline"}
                    onClick={() => router.replace("/")}
                    className="cursor-pointer"
                >
                    <RefreshCcw />
                    Refresh Data
                </Button>
            </div>
        )
    }

    return <Conversation id={conversationId}/>
}

export default MemberIdPage;