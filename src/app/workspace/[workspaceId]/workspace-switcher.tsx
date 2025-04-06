 
import { useWorkspaceId } from "@/hooks/use-workspace-id"; 
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoaderCircle, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useGetWorkspaces } from "@/features/workspaces/api/user-get-workspaces";
import { useGetWorkspace } from "@/features/workspaces/api/user-get-workspace";

export const WorkspaceSwitcher = () => {

    const router = useRouter();

    const workspaceId = useWorkspaceId();
    const [_open, setOpen] = useCreateWorkspaceModal();

    const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces();
    const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId });

    const filteredWorkspaces = workspaces?.filter(
        (workspace) => workspace?._id !== workspaceId
    );

    return ( 
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="secondary"
                        className=" rounded-md border size-10 relative overflow-hidden bg-primary text-slate-100 hover:bg-bg-primary/90 cursor-pointer font-semibold text-xl"
                    >
                        {workspaceLoading ? (
                            <LoaderCircle className="size-5 animate-spin shrink-0 text-muted-foreground" />
                        ) : (
                            workspace?.name.charAt(0).toUpperCase()
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="start" className="w-64">
                    <DropdownMenuItem
                        onClick={() => router.push(`/workspace/${workspaceId}`)}
                        className="cursor-pointer flex-col justify-start items-start capitalize">
                        {workspace?.name}
                        <span className="text-xs text-muted-foreground">
                            ห้องเรียนของคุณ!
                        </span>
                    </DropdownMenuItem>
                    {filteredWorkspaces?.map((workspace) => (
                        <DropdownMenuItem
                            key={workspace._id}
                            className="cursor-pointer capitalize"
                            onClick={() => router.push(`/workspace/${workspace._id}`)}
                        >
                            <div className="shrink-0 size-9 relative overflow-hidden bg-[#f2f2f2] text-slate-800 font-semibold text-lg rounded-md flex items-center justify-center mr-2">
                                {workspace.name.charAt(0).toUpperCase()}
                            </div>
                            <p className="truncate">{workspace.name}</p>
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => setOpen(true)}
                    >
                        <div className="size-9 relative overflow-hidden bg-[#f2f2f2] text-slate-800 font-semibold text-lg rounded-md flex items-center justify-center mr-2">
                            <Plus />
                        </div>
                        สร้างห้องเรียนใหม่
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu> 

    )
}