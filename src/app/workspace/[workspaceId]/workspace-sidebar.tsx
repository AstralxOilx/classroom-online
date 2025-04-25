
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { AlertTriangle, BackpackIcon, ClipboardCheck, Earth, EarthLock, HashIcon, LayoutGrid, LoaderCircle, MessageSquareText, RefreshCcw, SendHorizonal, SquareCheckBig, Video } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { WorkspaceHeader } from "./workspace-header";
import { SidebarItem } from "./sidebar-item";
import { WorkspaceSection } from "./workspace-section";
import { UserItem } from "./user-item";
import { useChannelId } from "@/hooks/use-channel-Id";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/user-get-workspace";
import { UseGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useMemberId } from "@/hooks/use-member-id";
import { CreateAssignMent } from "@/app/workspace/[workspaceId]/assignment/create-assignment";


export const WorkspaceSidebar = () => {

    const router = useRouter();

    const memberId = useMemberId();
    const workspaceId = useWorkspaceId();
    const channelId = useChannelId();

    const pathname = usePathname();

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
                    onClick={() => router.replace("/")}
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
            <WorkspaceSection
                label="แดชบอร์ด"
                hint="แดชบอร์ด"
            // onNew={member.role === "teacher" ? () => setOpen(true) : undefined}
            >

                <SidebarItem
                    key={"dashboard"}
                    icon={LayoutGrid}
                    label={"แดชบอร์ด"}
                    id={"dashboard"}
                    type="dashboard"
                    variant={pathname.includes("/dashboard") ? "active" : "default"}
                />

            </WorkspaceSection>
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
            {
                member.role === "teacher" ? (
                    <WorkspaceSection
                        label="งานที่หมอบหมาย"
                        hint="งานที่หมอบหมาย"
                    >
                        <CreateAssignMent title="เพิ่มการบ้าน" />
                        <SidebarItem
                            icon={EarthLock}
                            label={"ส่วนตัว"}
                            id={"private"}
                            type="assignment"
                            variant={pathname.includes("/private") ? "active" : "default"}
                        />
                        <SidebarItem
                            icon={Earth}
                            label={"สาธาระ"}
                            id={"public"}
                            type="assignment"
                            variant={pathname.includes("/public") ? "active" : "default"}
                        />
                    </WorkspaceSection>
                ) : (
                    <WorkspaceSection
                        label="งานที่หมอบหมาย"
                        hint="งานที่หมอบหมาย"
                    >
                        <SidebarItem
                            icon={ClipboardCheck}
                            label={"การบ้าน"}
                            id={"public"}
                            type="assignment"
                            variant={pathname.includes("/public") ? "active" : "default"}
                        />
                        {/* <SidebarItem
                            icon={HashIcon}
                            label={"ส่งแล้ว"}
                            id={"complete"}
                            type="assignment"
                            variant={pathname.includes("/complete") ? "active" : "default"}
                        /> */}
                    </WorkspaceSection>
                )
            }
            <WorkspaceSection
                label="เช็คชื่อ"
                hint="เช็คชื่อ"
            // onNew={member.role === "teacher" ? () => setOpen(true) : undefined}
            >
                {
                    member.role === "teacher" ? (
                        <SidebarItem
                            key={"create-check-in"}
                            icon={SquareCheckBig}
                            label={"สร้างเช็คชื่อ"}
                            id={"create-check-in"}
                            type="attendance"
                            variant={pathname.includes("/create-check-in") ? "active" : "default"}
                        />
                    ) : (
                        <SidebarItem
                            key={"check-in"}
                            icon={SquareCheckBig}
                            label={"เช็คชื่อ"}
                            id={"check-in"}
                            type="attendance"
                            variant={pathname.includes("/check-in") ? "active" : "default"}
                        />
                    )
                }
                {/* <SidebarItem
                    key={"recordn"}
                    icon={HashIcon}
                    label={"ประวัติการเช็คชื่อ"}
                    id={"record"}
                    type="attendance"
                    variant={pathname.includes("/record") ? "active" : "default"}
                /> */}
            </WorkspaceSection>
            <WorkspaceSection
                label="เริ่มเรียนออนไลน์"
                hint="เริ่มเรียนออนไลน์"
            // onNew={member.role === "teacher" ? () => setOpen(true) : undefined}
            >
                <SidebarItem
                    key={"create-check-in"}
                    icon={Video}
                    label={"เริ่มต้นเรียนออนไลน์"}
                    id={"stream"}
                    type="stream"
                    variant={pathname.includes("/stream") ? "active" : "default"}
                />
                {/* {
                    member.role === "teacher" ? (
                        <SidebarItem
                            key={"create-check-in"}
                            icon={HashIcon}
                            label={"เริ่มต้นเรียนออนไลน์"}
                            id={"stream"}
                            type="stream"
                            variant={pathname.includes("/stream") ? "active" : "default"}
                        />
                    ) : (
                        <SidebarItem
                            key={"check-in"}
                            icon={HashIcon}
                            label={"เช็คชื่อ"}
                            id={"check-in"}
                            type="attendance"
                            variant={pathname.includes("/check-in") ? "active" : "default"}
                        />
                    )
                } */}
            </WorkspaceSection>
            <WorkspaceSection
                label="สมาชิก"
                hint="สมาชิก"
            >
                {members?.map((item) => (
                    <UserItem
                        key={item._id}
                        id={item._id}
                        label={item.user.name}
                        image={item.user.image}
                        variant={item._id === memberId ? "active" : "default"}
                    />
                ))}
            </WorkspaceSection>
        </div>
    )
}