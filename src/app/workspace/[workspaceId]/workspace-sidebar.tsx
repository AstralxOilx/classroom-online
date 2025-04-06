import { useCurrentMember } from "@/app/features/members/api/use-current-member";
import { useGetWorkspace } from "@/app/features/workspaces/api/user-get-workspace";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { AlertTriangle, HashIcon, LoaderCircle, MessageSquareText, RefreshCcw, SendHorizonal } from "lucide-react";
import { useRouter } from "next/navigation";
import { WorkspaceHeader } from "./workspace-header";
import { SidebarItem } from "./sidebar-item";
import { UseGetChannels } from "@/app/features/channels/api/use-get-channels";
import { WorkspaceSection } from "./workspace-section";
import { useGetMembers } from "@/app/features/members/api/use-get-member";
import { UserItem } from "./user-item";
import { useCreateChannelModal } from "@/app/features/channels/store/use-create-channel-modal";
import { useChannelId } from "@/hooks/use-channel-Id";


export const WorkspaceSidebar = () => {

    const router = useRouter();

    const workspaceId = useWorkspaceId();
    const channelId = useChannelId();

    const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId });
    const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId });
    const { data: channels, isLoading: channelsLoading } = UseGetChannels({ workspaceId });
    const { data: members, isLoading: membersLoading } = useGetMembers({ workspaceId });

    const [_open, setOpen] = useCreateChannelModal();

    if (workspaceLoading || memberLoading) {
        return (
            <div className="flex flex-col h-full items-center justify-center">
                <LoaderCircle className="size-5 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!member || !workspace) {
        return (
            <div className="flex flex-col gap-y-2 h-full items-center justify-center">
                <AlertTriangle className="size-8 text-red-700" />
                <p className="text-red-700 text-sm">
                    ไม่พบข้อมูล ลองใหม่อีกครั้ง!
                </p>
                <Button
                    variant={"outline"}
                    onClick={() => router.refresh()}
                    className="cursor-pointer"
                >
                    <RefreshCcw />
                    Refresh Data
                </Button>
            </div>
        )
    }

    return (
        <div className="flex flex-col bg-secondary/30 h-full">
            <WorkspaceHeader workspace={workspace} isTeacher={member.role === "teacher"} />
            <div className="flex flex-col px-2 mt-3 ">
                <SidebarItem
                    label="Threads"
                    icon={MessageSquareText}
                    id="threads"
                />
                <SidebarItem
                    label="Drafts & Sent"
                    icon={SendHorizonal}
                    id="drafts"
                />
            </div>
            <WorkspaceSection
                label="Channels"
                hint="New Channel"
                onNew={member.role === "teacher" ? () => setOpen(true) : undefined}
            >
                {channels?.map((item) => (
                    <SidebarItem
                        key={item.name}
                        icon={HashIcon}
                        label={item.name}
                        id={item._id}
                        variant={channelId === item._id ? "active" : "default"}
                    />
                ))}
            </WorkspaceSection>
            <WorkspaceSection
                label="Messages"
                hint="New Messages"
            // onNew={() => { }}
            >
                {channels?.map((item) => (
                    <SidebarItem
                        key={item.name}
                        icon={HashIcon}
                        label={item.name}
                        id={item._id}
                    />
                ))}
            </WorkspaceSection>
            {members?.map((item) => (
                <UserItem
                    key={item._id}
                    id={item._id}
                    label={item.user.name}
                    image={item.user.image}
                />
            ))}
        </div>
    )
}