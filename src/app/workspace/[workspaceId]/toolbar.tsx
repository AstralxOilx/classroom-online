import { useGetWorkspace } from "@/app/features/workspaces/api/user-get-workspace";
import { Button } from "@/components/ui/button"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { Info, Search } from "lucide-react"

export const Toolbar = () => {

    const workspaceId = useWorkspaceId();
    const { data } = useGetWorkspace({ id: workspaceId });

    return (
        <nav className="bg-background flex items-center justify-between h-10 p-1.5">
            <div className="flex-1" />
            <div className="min-w-[280px] max-[642px] grow-[2] shrink">
                <Button
                    size={"sm"}
                    variant={"ghost"}
                    className="shadow cursor-pointer w-full text-gray-500 justify-start h-8 px-2"
                >
                    <Search className="size-4 mr-2" />
                    <span className="truncate">
                        ค้นหา {data?.name}
                    </span>
                </Button>
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