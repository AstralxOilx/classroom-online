"use client"

import React, { useEffect } from 'react'
import { Header } from '../header'
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { useGetScoreStudent } from '@/features/dashboard/api/use-get-score-student';
import DashboardStudent from '@/features/dashboard/components/dashboard-student';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { LoaderCircle } from 'lucide-react';
import DashboardTeacher from '@/features/dashboard/components/dashboard-teacher';

function DashboardPage() {


  const workspaceId = useWorkspaceId();

  const { data: currentMember, isLoading: isLoadingCurrentMember } = useCurrentMember({
    workspaceId
  });

  // useEffect(() => {
  //   if (!currentMember || !workspaceId) return;


  // }, [currentMember, workspaceId]);

  if (!currentMember || !workspaceId || isLoadingCurrentMember) {
    return (
      <div className="h-full flex-1 flex justify-center items-center flex-col gap-2 ">
        <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (currentMember?.role === "student") {
    return (
      <div className='flex flex-col h-full'>
        <Header title="แดชบอร์ด" />
        <DashboardStudent />
      </div>
    )
  } else if (currentMember?.role === "teacher") {

    return (
      <div className='flex flex-col h-full'>
        <Header title="แดชบอร์ด" />
        <DashboardTeacher />
      </div>
    )
  }

  return (
    <div className="h-full flex-1 flex justify-center items-center flex-col gap-2 ">
      <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
    </div>
  );


}

export default DashboardPage