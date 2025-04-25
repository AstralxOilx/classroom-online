"use client"

import React from 'react'
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { useGetScoreStudent } from '@/features/dashboard/api/use-get-score-student';


import { TrendingUp } from "lucide-react"
import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from "recharts"
import { useGetAttendanceStudentProps } from '../api/use-get-attendance-student';
import { PolarAngleAxis, Radar, RadarChart } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";


function DashboardStudent() {


    const workspaceId = useWorkspaceId();
    const { data: scoreStudent, isLoading: loadingScoreStudent } = useGetScoreStudent({ workspaceId });
    const { data: attendanceStudent, isLoading: loadingAttendanceStudent } = useGetAttendanceStudentProps({ workspaceId });

    const now = new Date();

    console.log(attendanceStudent);

    const formatThaiMonthYear = (date: Date) =>
        new Intl.DateTimeFormat("th-TH", {
            year: "numeric",
            month: "long",
            calendar: "buddhist",
        }).format(date);

    const thaiRange = `${formatThaiMonthYear(now)}`;

    const chartData = [
        {
            browser: "safari",
            visitors: Number(scoreStudent?.totalScore ?? 0), // ป้องกัน undefined
            fill: "var(--color-safari)",
        },
    ];

    const chartConfig = {
        visitors: {
            label: "Visitors",
        },
        safari: {
            label: "Safari",
            color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig


    console.log(scoreStudent);


    const chartAttendanceStudentData = [
        { month: "ตรงเวลา", desktop: attendanceStudent?.statusSummary.present },
        { month: "สาย", desktop: attendanceStudent?.statusSummary.late },
        { month: "ขาด", desktop: attendanceStudent?.statusSummary.leave },
        { month: "ลา", desktop: attendanceStudent?.statusSummary.absent },
    ]
    const chartAttendanceStudentConfig = {
        desktop: {
            label: "จำนวนครั้ง",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig


    return (
        <div className='h-full p-4 space-y-4 overflow-y-auto messages-scrollbar'>
            <div className='flex gap-1 items-center justify-center'>
                <Card className="w-full rounded-sm">
                    <CardHeader>
                        <CardTitle>งานที่มอบหมาย</CardTitle>
                        <CardDescription>จำนวนการส่งงานตามสถานะ</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* ส่งตรงเวลา */}
                            <Card className="rounded-sm shadow-sm border border-green-200">
                                <CardHeader>
                                    <CardTitle className="text-green-600">ส่งตรงเวลา</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-5xl font-bold text-green-700">
                                        {scoreStudent?.submitStatusSummary.submitted ?? 0}
                                        <span className="text-xs text-muted-foreground ml-1">ครั้ง</span>
                                    </p>
                                </CardContent>
                            </Card>

                            {/* ส่งล้า */}
                            <Card className="rounded-sm shadow-sm border border-yellow-200">
                                <CardHeader>
                                    <CardTitle className="text-yellow-600">ส่งล้า</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-5xl font-bold text-yellow-700">
                                        {scoreStudent?.submitStatusSummary.late ?? 0}
                                        <span className="text-xs text-muted-foreground ml-1">ครั้ง</span>
                                    </p>
                                </CardContent>
                            </Card>

                            {/* ส่งใหม่ */}
                            <Card className="rounded-sm shadow-sm border border-blue-200">
                                <CardHeader>
                                    <CardTitle className="text-blue-600">ส่งใหม่</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-5xl font-bold text-blue-700">
                                        {scoreStudent?.submitStatusSummary.canResubmit ?? 0}
                                        <span className="text-xs text-muted-foreground ml-1">ครั้ง</span>
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className='flex gap-1 items-center justify-center'>
                <Card className="flex flex-col p-4 rounded-sm w-[50%]">
                    <CardHeader className="items-center pb-0">
                        <CardTitle>คะแนนงานที่หมอบหมาย</CardTitle>
                        <CardDescription>{thaiRange}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 pb-0">
                        <ChartContainer
                            config={chartConfig}
                            className="mx-auto aspect-square max-h-[250px]"
                        >
                            <RadialBarChart
                                data={chartData}
                                endAngle={100}
                                innerRadius={90}
                                outerRadius={150}
                            >
                                <PolarGrid
                                    gridType="circle"
                                    radialLines={false}
                                    stroke="none"
                                    className="first:fill-muted last:fill-background"
                                    polarRadius={[86, 74]}
                                />
                                <RadialBar dataKey="visitors" background />
                                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                                    <Label
                                        content={({ viewBox }) => {
                                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                return (
                                                    <text
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        textAnchor="middle"
                                                        dominantBaseline="middle"
                                                    >
                                                        <tspan
                                                            x={viewBox.cx}
                                                            y={viewBox.cy}
                                                            className="fill-foreground text-4xl font-bold"
                                                        >
                                                            {chartData[0].visitors.toLocaleString()}
                                                        </tspan>
                                                        <tspan
                                                            x={viewBox.cx}
                                                            y={(viewBox.cy || 0) + 24}
                                                            className="fill-muted-foreground"
                                                        >
                                                            Visitors
                                                        </tspan>
                                                    </text>
                                                )
                                            }
                                        }}
                                    />
                                </PolarRadiusAxis>
                            </RadialBarChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex-col gap-2 text-sm">
                        <div className="flex items-center gap-2 font-medium leading-none">
                            {scoreStudent?.percentage !== null && scoreStudent?.percentage !== undefined ? (
                                <>
                                    คะแนนรวม {scoreStudent.percentage.toFixed(2)}% <TrendingUp className="h-4 w-4" />
                                </>
                            ) : (
                                <>คะแนนรวม -%</>
                            )}
                        </div>
                        <div className="leading-none text-muted-foreground">
                            คะแนนงานที่หมอบหมาย {scoreStudent?.totalScore} จาก {scoreStudent?.totalPossibleScore}
                        </div>
                    </CardFooter>
                </Card>

                <Card className="flex flex-col p-4 rounded-sm w-[50%]">
                    <CardHeader className="items-center pb-4">
                        <CardTitle>การเข้าเรียน</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-0">
                        <ChartContainer
                            config={chartAttendanceStudentConfig}
                            className="mx-auto aspect-square max-h-[250px]"
                        >
                            <RadarChart data={chartAttendanceStudentData}>
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <PolarGrid gridType="circle" radialLines={false} />
                                <PolarAngleAxis dataKey="month" />
                                <Radar
                                    dataKey="desktop"
                                    fill="var(--color-desktop)"
                                    fillOpacity={0.6}
                                    dot={{
                                        r: 4,
                                        fillOpacity: 1,
                                    }}
                                />
                            </RadarChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex-col gap-2 text-sm">
                        <div className="flex items-center gap-2 font-medium leading-none">
                            <p>ขาดเรียน:{attendanceStudent?.statusSummary.absent}</p>
                            <p>ลา:{attendanceStudent?.statusSummary.leave}</p>
                            <p>มาสาย:{attendanceStudent?.statusSummary.late}</p>
                            <p>ตรงเวลา:{attendanceStudent?.statusSummary.present}</p>
                        </div>
                        <br />
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default DashboardStudent