"use client";
import { WorkspaceSwitcher } from "./workspace-switcher";
import { SidebarButton } from "./sidebar-button";
import { Bell, MoreHorizontal, School } from "lucide-react";
import { usePathname } from "next/navigation";
import { UserButton } from "@/features/auth/components/user-button";
import { useToggleMenuBar } from "@/store/use-toggle-menu-bar";
import { useIsMobile } from "@/hooks/useIsMobile";


export const Sidebar = () => {

    const pathname = usePathname();

    const [isOpen] = useToggleMenuBar();
    const isMobile = useIsMobile();


    return (
        <>
            {
                isMobile ? (
                    <>
                        {
                            isOpen === false ? (
                                <aside className="w-[70px] h-full bg-background flex flex-col gap-y-4 items-center pt-[9px] pb-4" >
                                    <WorkspaceSwitcher />
                                    <SidebarButton onLink={()=>console.log("hello world")} icon={School} label="ห้องเรียน" isActive={pathname.includes("/workspace")} />
                                    {/* <SidebarButton icon={MessagesSquare} label="แชท" /> */}
                                    <SidebarButton icon={Bell} label="แจ้งเตือน" />
                                    <SidebarButton icon={MoreHorizontal} label="อื่นๆ" />
                                    <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
                                        <UserButton />
                                    </div>
                                </aside >
                            ) : (
                                null
                            )
                        }
                    </>
                ) : (
                    <aside className="w-[70px] h-full bg-background flex flex-col gap-y-4 items-center pt-[9px] pb-4" >
                        <WorkspaceSwitcher />
                        <SidebarButton icon={School} label="ห้องเรียน" isActive={pathname.includes("/workspace")} />
                        {/* <SidebarButton icon={MessagesSquare} label="แชท" /> */}
                        <SidebarButton icon={Bell} label="แจ้งเตือน" />
                        <SidebarButton icon={MoreHorizontal} label="อื่นๆ" />
                        <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
                            <UserButton />
                        </div>
                    </aside >
                )
            }
        </>
    )
} 