"use client";
 
import { Button } from "@/components/ui/button";
import { UseGetChannels } from "@/features/channels/api/use-get-channels";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/user-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { AlertTriangle, LoaderCircle, RefreshCcw} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";



const WorkspaceIdPage = () => {

    const workspaceId = useWorkspaceId();
    const router = useRouter();
    const [open, setOpen] = useCreateChannelModal();

    const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId });
    const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId });
    const { data: channels, isLoading: channelsLoading } = UseGetChannels({ workspaceId });

    const channelId = useMemo(() => channels?.[0]?._id, [channels]);
    const isTeacher = useMemo(() => member?.role === "teacher", [member?.role]);


    useEffect(() => {
        if (workspaceLoading || channelsLoading || memberLoading || !member || !workspace) return;

        if (channelId) {
            router.push(`/workspace/${workspaceId}/channel/${channelId}`);
        } else if (!open && isTeacher) {
            setOpen(true);
        }
    }, [
        channelId,
        workspaceLoading,
        channelsLoading,
        workspace,
        open,
        setOpen,
        router,
        workspaceId,
        member,
        memberLoading,
        isTeacher,
    ]);



    if (workspaceLoading || channelsLoading) {

        return (
            <div className="h-full  flex-1 flex items-center justify-center flex-col gap-2 ">
                <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
            </div>
        ) 
    }

    if (!workspace) {
        return (
            <div className="flex flex-col gap-y-2 h-full items-center justify-center">
                <AlertTriangle className="size-8 text-red-700" />
                <p className="text-red-700 text-sm">
                    ไม่พบข้อมูล ลองใหม่อีกครั้ง!
                </p>
                <Button
                    variant={"outline"}
                    onClick={() => router.replace('/')}
                    className="cursor-pointer"
                >
                    <RefreshCcw />
                    Refresh Data
                </Button>
            </div>
        );

    }

    // return null;

    // return (
    //     <div>
    //         WorkspaceIdPage
    //     </div>
    // )
}

export default WorkspaceIdPage;