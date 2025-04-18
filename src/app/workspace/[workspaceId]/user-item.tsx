import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Id } from "../../../../convex/_generated/dataModel";
import { cva, type VariantProps } from "class-variance-authority";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useWorkspaceId } from "@/hooks/use-workspace-id"; 


// const userItemVariants = cva(
//     "flex items-center gap-1.5 justify-start font-normal h-8 px-4 text-sm overflow-hidden",
//     {
//         variants: {
//             variant: {
//                 default: "text-gray-600",
//                 active: "text-primary bg-background hover:bg-background hover:text-primary"
//             },
//         },
//         defaultVariants: {
//             variant: "default",
//         }
//     },
// );

const userItemVariants = cva(
    "flex items-center gap-1.5 justify-start font-normal h-8 px-[18px] text-sm overflow-hidden rounded-sm",
    {
        variants: {
            variant: {
                default: "text-gray-600",
                active: "shadow-xs text-primary bg-background hover:bg-background hover:text-primary rounded-l-none rounded-r-sm border-l-2 border-primary"
            },
        },
        defaultVariants: {
            variant: "default",
        }
    },
);


interface UserItemProps {
    id: Id<"members">;
    label?: string;
    image?: string;
    variant?: VariantProps<typeof userItemVariants>["variant"]
}

export const UserItem = ({
    id,
    label = "Member",
    image,
    variant,
}: UserItemProps) => {

    const workspaceId = useWorkspaceId();
    const avatarFallback = label.charAt(0).toUpperCase();
 
    return (
        <>
            <Button
                variant={"ghost"}
                className={cn(userItemVariants({ variant: variant }))}
                size={"sm"}
                asChild
            >
                <Link href={`/workspace/${workspaceId}/member/${id}`}>
                    <Avatar className="size-6 rounded-sm mr-1 border">
                        <AvatarImage className="rounded-sm" src={image} />
                        <AvatarFallback className="rounded-sm">
                            {avatarFallback}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-sm truncate">{label}</span>
                </Link>
            </Button> 
        </>
    );
}