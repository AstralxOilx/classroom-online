import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { FaCaretDown } from "react-icons/fa";
import { useToggle } from 'react-use';

interface WorkspaceSectionProps {
    children: React.ReactNode;
    label: string;
    hint: string;
    onNew?: () => void;

}

export const WorkspaceSection = ({
    children,
    label,
    hint,
    onNew,
}: WorkspaceSectionProps) => {

    const [on, toggle] = useToggle(true);

    return (
        <>
            <div className="flex flex-col mt-3 px-2">
                <div className="flex items-center px-0 group">
                    <Button
                        onClick={toggle}
                        variant={"transparent"}
                        className="p-0.5 text-sm text-gray-800 shrink-0 "
                    >
                        <span className=" truncate ">{label}</span>
                        <FaCaretDown className={cn(
                            "size-4 transition-transform",
                            !on && "-rotate-90"
                        )} />
                    </Button>
                    {/* <Button
                        variant={"transparent"}
                        size={"sm"}
                        className="group  px-1.5 text-sm text-gray-800 h-[28px] justify-items-start overflow-hidden"
                    >
                        <span className=" truncate ">{label}</span>
                    </Button> */}
                    {
                        onNew && (
                            <Hint label={hint} side="top" align="center">
                                <Button
                                    onClick={onNew}
                                    size={"icon"}
                                    variant={"transparent"}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-0.5 text-sm text-gray-800 size-6 shrink-0"
                                >
                                    <PlusIcon className="size-5" />
                                </Button>
                            </Hint>
                        )
                    }
                </div>
                {on && children}
            </div>
        </>
    )
}