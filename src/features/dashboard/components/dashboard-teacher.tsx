"use client"

import React from 'react'
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useGetTeacherDashboardData } from '../api/use-get-dashboard-teacher';


import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"
const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
]
const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig



function DashboardTeacher() {


    const workspaceId = useWorkspaceId();
    const { data: dashboardData, isLoading: loadingDashboardData } = useGetTeacherDashboardData({ workspaceId });


    const chartData = [
        { month: "ตรงเวลา", desktop: dashboardData?.submitStatusSummary.canResubmit },
        { month: "ล้าช้า", desktop: dashboardData?.submitStatusSummary.late },
        { month: "ส่งใหม่", desktop: dashboardData?.submitStatusSummary.submitted },
    ]
    const chartConfig = {
        desktop: {
            label: "จำนวน",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig

    const chartAttendanceData = [
        { month: "ตรงเวลา", desktop: dashboardData?.attendanceStatusSummary.present },
        { month: "สาย", desktop: dashboardData?.attendanceStatusSummary.late },
        { month: "ลา", desktop: dashboardData?.attendanceStatusSummary.leave },
        { month: "ขาด", desktop: dashboardData?.attendanceStatusSummary.absent },
    ]
    const chartAttendanceConfig = {
        desktop: {
            label: "จำนวน",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig


    // console.log(dashboardData)


    return (
        <div className='h-full p-4 space-y-4 overflow-y-auto messages-scrollbar'>
            <div className='flex gap-1 items-center justify-center'>
                <Card className="w-full rounded-sm">
                    <CardHeader>
                        <CardTitle>ทั่วไป</CardTitle>
                        <CardDescription>จำนวนนักเรียน,จำนวนงานที่มอบหมาย,จำนวนการเช็คชื่อ</CardDescription>
                    </CardHeader>

                    <CardContent className='w-full overflow-x-auto messages-scrollbar'>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* ส่งตรงเวลา */}
                            <Card className="rounded-sm shadow-sm border border-green-200">
                                <CardHeader>
                                    <CardTitle className="text-green-600">จำนวนนักเรียน</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-5xl font-bold text-green-700">
                                        {dashboardData?.studentCount ?? 0}
                                        <span className="text-xs text-muted-foreground ml-1">คน</span>
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="rounded-sm shadow-sm border border-yellow-200">
                                <CardHeader>
                                    <CardTitle className="text-yellow-600">จำนวนงานที่มอบหมาย</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-5xl font-bold text-yellow-700">
                                        {dashboardData?.totalAssignments ?? 0}
                                        <span className="text-xs text-muted-foreground ml-1">งาน</span>
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="rounded-sm shadow-sm border border-blue-200">
                                <CardHeader>
                                    <CardTitle className="text-blue-600">จำนวนการเช็คชื่อ</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-5xl font-bold text-blue-700">
                                        {dashboardData?.attendanceSessions ?? 0}
                                        <span className="text-xs text-muted-foreground ml-1">ครั้ง</span>
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className='flex gap-1'>
                <Card className='rounded-sm w-[50%]'>
                    <CardHeader className="items-center pb-4">
                        <CardTitle>จำนวนการส่งงานตามสถานะ</CardTitle>
                        <CardDescription>
                            จำนวนนักเรียน ที่ ส่งตรงเวลา,ส่งล้าช้า,ส่งใหม่
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-0">
                        <ChartContainer
                            config={chartConfig}
                            className="mx-auto aspect-square max-h-[250px]"
                        >
                            <RadarChart data={chartData}>
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <PolarGrid radialLines={false} polarRadius={[90]} strokeWidth={1} />
                                <PolarAngleAxis dataKey="month" />
                                <Radar
                                    dataKey="desktop"
                                    fill="var(--color-desktop)"
                                    fillOpacity={0.6}
                                />
                            </RadarChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex-col gap-2 text-sm">
                        <div className="flex items-center gap-2 leading-none text-md font-semibold text-muted-foreground">
                            <p>ส่งตรงเวลา:{dashboardData?.submitStatusSummary.submitted}</p>
                            <p>ส่งล้าช้า:{dashboardData?.submitStatusSummary.late}</p>
                            <p>ส่งใหม่:{dashboardData?.submitStatusSummary.canResubmit}</p>
                        </div>
                    </CardFooter>
                </Card>

                <Card className='rounded-sm  w-[50%]'>
                    <CardHeader>
                        <CardTitle>จำนวนการเช็คชื่อ ของนักเรียน</CardTitle>
                        <CardDescription>จำนวนนักเรียน ที่ ขาด,ลา,มาสาย มตรงเวลา</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartAttendanceConfig}>
                            <BarChart
                                accessibilityLayer
                                data={chartAttendanceData}
                                margin={{
                                    top: 20,
                                }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8}>
                                    <LabelList
                                        position="top"
                                        offset={12}
                                        className="fill-foreground"
                                        fontSize={12}
                                    />
                                </Bar>
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2 text-sm">
                        <div className="flex items-center gap-2 leading-none text-md font-semibold text-muted-foreground">
                            <p>ตรงเวลา:{dashboardData?.attendanceStatusSummary.present}</p>
                            <p>สาย:{dashboardData?.attendanceStatusSummary.late}</p>
                            <p>ลา:{dashboardData?.attendanceStatusSummary.leave}</p>
                            <p>ขาด:{dashboardData?.attendanceStatusSummary.absent}</p>
                        </div>
                    </CardFooter>
                </Card>
            </div>

        </div>
    )
}

export default DashboardTeacher