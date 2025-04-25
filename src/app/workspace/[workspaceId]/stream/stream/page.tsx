"use client"

import { useCurrentMember } from '@/features/members/api/use-current-member';
// import JitsiMeet from '@/features/stream/components/jitsi-meet'
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { LoaderCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const JitsiMeet = dynamic(() => import('@/features/stream/components/jitsi-meet'), { ssr: false });


function CreateStreamPage() {

    const router = useRouter();
    const workspaceId = useWorkspaceId();

    const { data: currentMember, isLoading: isLoadingCurrentMember } = useCurrentMember({
        workspaceId
    });
 

    if (!currentMember || !workspaceId || isLoadingCurrentMember) {
        return (
            <div className="h-full flex-1 flex justify-center items-center flex-col gap-2 ">
                <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
            </div>
        );
    }


    const handleRoomLink = (link: string) => {
        // console.log("Room link: ", link);
    };

    return (
        <div>
            <JitsiMeet displayName={workspaceId} onRoomLinkGenerated={handleRoomLink} />
        </div>
    );
}

export default CreateStreamPage