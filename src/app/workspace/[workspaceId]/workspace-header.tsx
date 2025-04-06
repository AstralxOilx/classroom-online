import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Doc } from "../../../../convex/_generated/dataModel";
import { ChevronDown, ListFilter, SquarePen } from "lucide-react";
import { Hint } from "@/components/hint";
import { PreferencesModal } from "./preferences-modal";
import { useState } from "react";
import { InviteModal } from "./invite-modal";


interface WorkspaceHeaderProps {
    workspace: Doc<"workspaces">;
    isTeacher: boolean;
}

export const WorkspaceHeader = ({ workspace, isTeacher }: WorkspaceHeaderProps) => {

    const [preferencesOpen, setPreferencesOpen] = useState(false);
    const [inviteOpen, setInviteOpen] = useState(false);



    return (
        <>
            <InviteModal open={inviteOpen} setOpen={setInviteOpen} name={workspace.name} joinCode={workspace.joinCode}/>
            <PreferencesModal open={preferencesOpen} setOpen={setPreferencesOpen} initialValue={workspace.name} />
            <div className="flex items-center justify-between px-4 h-[49px] gap-0.5">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div
                            // variant={"transparent"}
                            className=" flex items-center hover:bg-background hover:shadow rounded-md truncate cursor-pointer text-gray-800 font-semibold w-auto text-md p-1.5 overflow-hidden"
                        // size={"sm"}
                        >
                            <span className="text-md truncate">{workspace.name}</span>
                            <ChevronDown className="size-4 ml-1 shrink-0" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="bottom" align="start" className="w-64">
                        <DropdownMenuItem
                            className="cursor-pointer capitalize"
                        >
                            <div className="size-9 relative overflow-hidden bg-primary text-white font-semibold text-xl rounded-md flex items-center justify-center">
                                {workspace.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col items-start">
                                <p className="font-bold">{workspace.name}</p>
                                <p className="text-xs text-muted-foreground">กำลังใช้งาน</p>
                            </div>
                        </DropdownMenuItem>
                        {isTeacher && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="cursor-pointer py-2"
                                    onClick={() => setInviteOpen(true)}
                                >
                                    <span className="truncate">เชิญบุคคลอื่นเข้าสู่ {workspace.name}</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="cursor-pointer py-2"
                                    onClick={() => setPreferencesOpen(true)}
                                >
                                    <span className="truncate">การตั้งค่า</span>
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className=" flex items-center gap-0.5">
                    <Hint label="กรองการสนทนา" side="bottom">
                        <Button
                            variant={"transparent"}
                            size={"iconSm"}
                            className="cursor-pointer text-gray-800 font-semibold text-md w-auto p-1.5 overflow-hidden"
                        >
                            <ListFilter className="size-4" />
                        </Button>
                    </Hint>
                    <Hint label="ข้อความใหม่" side="bottom">
                        <Button
                            variant={"transparent"}
                            size={"iconSm"}
                            className="cursor-pointer text-gray-800 font-semibold text-md w-auto p-1.5 overflow-hidden"
                        >
                            <SquarePen className="size-4" />
                        </Button>
                    </Hint>
                </div>
            </div>
        </>
    )
}