import { v } from "convex/values";
import { query, QueryCtx } from "./_generated/server";
import { auth } from "./auth";
import { Id } from "./_generated/dataModel";


const getMember = async (ctx: QueryCtx, workspaceId: Id<"workspaces">, userId: Id<"users">) => {
  return ctx.db
    .query("members")
    .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", workspaceId).eq("userId", userId))
    .unique();
}

export const getScore = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const currentUserId = await auth.getUserId(ctx);
    if (!currentUserId) throw new Error("Unauthorized");

    // assignments ทั้งหมดใน workspace
    const assignments = await ctx.db
      .query("assignments")
      .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    const assignmentMap = new Map(
      assignments.map((a) => [a._id, a])
    );

    const totalPossibleScore = assignments.reduce(
      (sum, a) => sum + (a.score ?? 0),
      0
    );

    // submission ทั้งหมดของ user
    const submissions = await ctx.db
      .query("submitAssignments")
      .withIndex("by_user_id", (q) => q.eq("userId", currentUserId))
      .collect();

    const filtered = submissions.filter(
      (s) => s.workspaceId === args.workspaceId
    );

    let totalScore = 0;
    let count = 0;
    const details = [];

    // สถิติสถานะการส่ง
    let submitted = 0;
    let late = 0;
    let canResubmit = 0;

    for (const submission of filtered) {
      // นับ status
      if (submission.status === "submitted") submitted++;
      else if (submission.status === "late") late++;
      else if (submission.status === "canResubmit") canResubmit++;

      const feedback = await ctx.db
        .query("feedback")
        .filter((q) => q.eq(q.field("submitAssignmentId"), submission._id))
        .first();

      const score = feedback?.score ?? null;
      if (score !== null) {
        totalScore += score;
        count += 1;
      }

      const assignment = assignmentMap.get(submission.assignmentId);

      details.push({
        assignmentId: submission.assignmentId,
        assignmentTitle: assignment?.name ?? "ไม่ทราบชื่อ",
        maxScore: assignment?.score ?? 0,
        score,
        status: submission.status,
        submittedAt: submission._creationTime ?? null,
      });
    }

    return {
      totalScore,
      totalPossibleScore,
      averageScore: count > 0 ? totalScore / count : null,
      percentage:
        totalPossibleScore > 0 ? (totalScore / totalPossibleScore) * 100 : null,
      submissionCount: filtered.length,
      scoredCount: count,
      submitStatusSummary: {
        submitted,
        late,
        canResubmit,
      },
      details,
    };
  },
});


export const getAttendanceStatus = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const currentUserId = await auth.getUserId(ctx);
    if (!currentUserId) {
      throw new Error("Unauthorized");
    }

    // ดึง session ทั้งหมดใน workspace
    const sessions = await ctx.db
      .query("attendanceSession")
      .withIndex("by_workspaces", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    const results = [];
    const statusCount = {
      present: 0,
      late: 0,
      leave: 0,
      absent: 0,
    };

    for (const session of sessions) {
      // ดึงข้อมูลการเช็คชื่อของ currentUser สำหรับ session นี้
      const attendance = await ctx.db
        .query("attendance")
        .withIndex("by_session_user", (q) =>
          q.eq("sessionId", session._id).eq("userId", currentUserId)
        )
        .first();

      const status = attendance?.status ?? "absent"; // ถ้าไม่มีข้อมูล ให้ถือว่าไม่มา
      statusCount[status]++;

      results.push({
        sessionId: session._id,
        title: session.title,
        startTime: session.startTime,
        endTime: session.endTime,
        endTeaching: session.endTeaching,
        status,
        timestamp: attendance?.timestamp ?? null,
        description: attendance?.description ?? null,
      });
    }

    return {
      studentId: currentUserId,
      attendance: results,
      statusSummary: statusCount, // ส่งข้อมูลสรุปจำนวนสถานะเข้าเรียน
    };
  },
});


export const getClassroomOverviewForTeacher = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    // ✅ ตรวจสอบสิทธิ์ครู
    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .first();

    if (!member || member.role !== "teacher") {
      throw new Error("Access denied");
    }

    // ✅ ข้อมูลพื้นฐาน
    const members = await ctx.db
      .query("members")
      .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();
    const students = members.filter((m) => m.role === "student");

    const assignments = await ctx.db
      .query("assignments")
      .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    const submissions = await ctx.db
      .query("submitAssignments")
      .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    const feedbacks = await ctx.db.query("feedback").collect();

    // ✅ คำนวณ
    const submittedStudents = new Set(submissions.map((s) => s.userId));
    const studentsSubmittedCount = submittedStudents.size;
    const studentsNotSubmittedCount = students.length - studentsSubmittedCount;

    // งานที่ยังไม่มีใครส่ง
    const assignmentsWithNoSubmissions = assignments.filter(
      (a) => !submissions.find((s) => s.assignmentId === a._id)
    );

    // งานที่ยังไม่มี feedback
    const assignmentsWithNoFeedback = assignments.filter(
      (a) => !submissions.find((s) =>
        feedbacks.find((f) => f.submitAssignmentId === s._id && s.assignmentId === a._id)
      )
    );

    // ค่าเฉลี่ยคะแนนของแต่ละงาน
    const avgScoresByAssignment = assignments.map((assignment) => {
      const scores = feedbacks
        .filter((f) => {
          const sub = submissions.find((s) => s._id === f.submitAssignmentId);
          return sub?.assignmentId === assignment._id;
        })
        .map((f) => f.score);

      const avgScore =
        scores.length > 0
          ? scores.reduce((sum, s) => sum + s, 0) / scores.length
          : 0;

      return {
        assignmentId: assignment._id,
        assignmentName: assignment.name,
        averageScore: avgScore,
      };
    });

    // สถานะการส่งงานของนักเรียน
    const submitStatusSummary = {
      submitted: submissions.filter((s) => s.status === "submitted").length,
      late: submissions.filter((s) => s.status === "late").length,
      canResubmit: submissions.filter((s) => s.status === "canResubmit").length,
    };

    // การเข้าเรียนทั้งหมด
    const sessions = await ctx.db
      .query("attendanceSession")
      .withIndex("by_workspaces", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    const allAttendance = await Promise.all(
      sessions.map((s) =>
        ctx.db
          .query("attendance")
          .withIndex("by_session_user", (q) => q.eq("sessionId", s._id))
          .collect()
      )
    );

    // const flatAttendance = allAttendance.flat();
    // const attendanceStatusSummary = {
    //   present: flatAttendance.filter((a) => a.status === "present").length,
    //   late: flatAttendance.filter((a) => a.status === "late").length,
    //   leave: flatAttendance.filter((a) => a.status === "leave").length,
    //   absent: flatAttendance.filter((a) => a.status === "").length,
    // };

    const flatAttendance = allAttendance.flat();

    // สร้าง Map สำหรับตรวจสอบว่าคนไหนเช็คชื่อในแต่ละ session
    const attendanceMap = new Map<string, Set<string>>(); // sessionId => Set<userId>
    for (const att of flatAttendance) {
      if (!attendanceMap.has(att.sessionId)) {
        attendanceMap.set(att.sessionId, new Set());
      }
      attendanceMap.get(att.sessionId)!.add(att.userId);
    }

    // หาจำนวนนักเรียนที่ไม่มาเรียน (absent)
    let absentCount = 0;
    for (const session of sessions) {
      const checkedUserIds = attendanceMap.get(session._id) || new Set();
      for (const student of students) {
        if (!checkedUserIds.has(student.userId)) {
          absentCount++;
        }
      }
    }

    // สรุปสถานะการเข้าเรียน
    const attendanceStatusSummary = {
      present: flatAttendance.filter((a) => a.status === "present").length,
      late: flatAttendance.filter((a) => a.status === "late").length,
      leave: flatAttendance.filter((a) => a.status === "leave").length,
      absent: absentCount,
    };



    return {
      studentCount: students.length,
      studentsSubmittedCount,
      studentsNotSubmittedCount,
      totalAssignments: assignments.length,
      assignmentsWithNoSubmissions,
      assignmentsWithNoFeedback,
      averageScoresByAssignment: avgScoresByAssignment,
      submitStatusSummary,
      attendanceSessions: sessions.length,
      totalAttendanceRecords: allAttendance.flat().length,
      attendanceStatusSummary,
    };
  },
});
