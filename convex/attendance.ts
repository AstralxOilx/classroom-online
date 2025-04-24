import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";




export const createAttendanceSession = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    title: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    endTeaching: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUserId = await auth.getUserId(ctx);
    if (!currentUserId) throw new Error("Unauthorized");

    const member = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) =>
        q.eq("userId", currentUserId),
      )
      .unique();

    if (!member || member.role !== "teacher") {
      throw new Error("Unauthorized");
    }


    return await ctx.db.insert("attendanceSession", {
      ...args,
      createdBy: currentUserId,
    });
  },
});

export const getAttendanceSession = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const currentUserId = await auth.getUserId(ctx);
    if (!currentUserId) throw new Error("Unauthorized");

    const members = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", currentUserId))
      .collect();

    // ✅ หา member ที่อยู่ในห้องเดียวกับ session
    const member = members.find(
      (m) => m.workspaceId === args.workspaceId
    );

    if (!member || member.role !== "student") {
      throw new Error("Unauthorized");
    }


    const now = new Date().toISOString();

    const allSessions = await ctx.db
      .query("attendanceSession")
      .withIndex("by_workspace_id_and_startTime_and_endTime", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .collect();

    const sessions = allSessions.filter((session) =>
      session.startTime <= now && session.endTeaching >= now
    );

    const currentSession = sessions[0];
    if (!currentSession) {
      throw new Error("ไม่พบรอบการเช็คชื่อในขณะนี้");
    }


    return {
      sessions: await Promise.all(
        sessions
          .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()) // sort ตรงนี้!
          .map(async (session) => {
            const already = await ctx.db
              .query("attendance")
              .withIndex("by_session_user", (q) =>
                q.eq("sessionId", session._id).eq("userId", currentUserId)
              )
              .unique();

            return {
              ...session,
              alreadyAttendance: !!already,
              attendanceData: already ?? null, // ข้อมูลการเช็คชื่อ ถ้ามี
            };
          })
      )
    };


  }
});

export const studentCheckIn = mutation({
  args: {
    sessionId: v.id("attendanceSession"),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("present"),
      v.literal("late"),
      v.literal("leave")
    ),
  },
  handler: async (ctx, args) => {
    const currentUserId = await auth.getUserId(ctx);
    if (!currentUserId) throw new Error("Unauthorized");

    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("ไม่พบรอบการเช็คชื่อ");

    const members = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", currentUserId))
      .collect();

    const member = members.find((m) => m.workspaceId === session.workspaceId);
    if (!member || member.role !== "student") {
      throw new Error("Unauthorized");
    }

    const now = new Date().toISOString();

    if (now < session.startTime || now > session.endTeaching) {
      throw new Error("ไม่อยู่ในช่วงเวลาที่อนุญาตให้เช็คชื่อ");
    }

    const already = await ctx.db
      .query("attendance")
      .withIndex("by_session_user", (q) =>
        q.eq("sessionId", args.sessionId).eq("userId", currentUserId)
      )
      .unique();

    if (already) {
      throw new Error("คุณได้เช็คชื่อไปแล้ว");
    }

    // ✅ ตรวจสอบสถานะโดยไม่ใช้ args.status แล้ว
    let status: "present" | "late" | "leave";

    if (args.status === "leave") {
      status = "leave";
    } else if (now <= session.endTime) {
      status = "present";
    } else {
      status = "late";
    }

    return await ctx.db.insert("attendance", {
      sessionId: args.sessionId,
      userId: currentUserId,
      description: args.description,
      status,
      timestamp: now,
    });
  },
});
