
import { Button } from "@/components/ui/button"
import { useGetWorkspace } from "@/features/workspaces/api/user-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { Info, Search } from "lucide-react"
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";
import { useState } from "react";
import { UseGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetMembers } from "@/features/members/api/use-get-members";
import Link from "next/link";
import { useRouter } from "next/navigation";


export const Toolbar = () => {

    const router = useRouter();

    const [open, setOpen] = useState(false);

    const onChannelClick = (channelId: string) => {
        setOpen(false);
        router.push(`/workspace/${workspaceId}/channel/${channelId}`)
    }

    const onMemberClick = (memberId: string) => {
        setOpen(false);
        router.push(`/workspace/${workspaceId}/member/${memberId}`)
    }

    const workspaceId = useWorkspaceId();
    const { data } = useGetWorkspace({ id: workspaceId });

    const { data: channels } = UseGetChannels({ workspaceId });
    const { data: members } = useGetMembers({ workspaceId });

    return (
        <nav className="bg-background flex items-center justify-between h-10 p-1.5">
            <div className="flex-1" />
            <div className="min-w-[280px] max-[642px] grow-[2] shrink">
                <Button
                    onClick={() => setOpen(true)}
                    size={"sm"}
                    variant={"ghost"}
                    className="shadow cursor-pointer w-full text-gray-500 justify-start h-8 px-2"
                >
                    <Search className="size-4 mr-2" />
                    <span className="truncate">
                        ค้นหา {data?.name}
                    </span>
                </Button>

                <CommandDialog open={open} onOpenChange={setOpen}>
                    <CommandInput placeholder="ค้นหา..." />
                    <CommandList>
                        <CommandEmpty>ไม่พบข้อมูล!</CommandEmpty>
                        <CommandGroup heading="Channels">
                            {channels?.map((channel) => (
                                <CommandItem key={channel._id} onSelect={() => onChannelClick(channel._id)}>
                                    {channel.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandGroup heading="Member">
                            {members?.map((member) => (
                                <CommandItem key={member._id} onSelect={() => onMemberClick(member._id)}>
                                    {member.user.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </CommandDialog>


            </div>
            <div className="ml-auto flex-1 flex items-center justify-end">
                <Button
                    className="cursor-pointer rounded-md"
                    variant={"transparent"}
                >
                    <Info className="size-5" />
                </Button>
            </div>
        </nav>
    )
}