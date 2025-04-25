import { ConvexError, v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { auth } from "./auth";
import { Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

const getMember = async (ctx: QueryCtx, workspaceId: Id<"workspaces">, userId: Id<"users">) => {
  return ctx.db
    .query("members")
    .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", workspaceId).eq("userId", userId))
    .unique();
}



export const createSubmitAssignment = mutation({
  args: {
    assignmentId: v.id("assignments"),
    workspaceId: v.id("workspaces"),
    files: v.array(v.object({
      name: v.string(),
      storageId: v.id("_storage"),
    })),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) throw new Error("ไม่พบ ห้องเรียนนี้!");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId),
      )
      .unique();

    if (!member || member.role !== "student") {
      throw new Error("Unauthorized");
    }

    // ✅ ตรวจสอบว่ามีการส่งงานแล้วหรือยัง
    const existingSubmission = await ctx.db
      .query("submitAssignments")
      .withIndex("by_assignment_user", (q) =>
        q.eq("assignmentId", args.assignmentId).eq("userId", member.userId)
      )
      .unique();

    if (existingSubmission) {
      throw new Error("[ALREADY_SUBMITTED] คุณได้ส่งการบ้านนี้ไปแล้ว");
    }

    const assignment = await ctx.db.get(args.assignmentId);
    if (!assignment) {
      throw new Error("ไม่พบการบ้านนี้!");
    }

    const now = new Date();
    const dueDate = new Date(assignment.dueDate);

    //  console.log(now)

    const isLate = now >= dueDate;
    const status = isLate ? "late" : "submitted";

    const submitAssignmentId = await ctx.db.insert("submitAssignments", {
      assignmentId: args.assignmentId,
      workspaceId: args.workspaceId,
      userId: member.userId,
      status,
    });

    for (const file of args.files) {
      await ctx.db.insert("submitFiles", {
        name: file.name,
        file: file.storageId,
        submitAssignmentId,
      });
    }
  }
});

export const allowResubmission = mutation({
  args: {
    submitAssignmentId: v.id("submitAssignments"),
  },
  handler: async (ctx, args) => {
    const currentUserId = await auth.getUserId(ctx);
    if (!currentUserId) throw new Error("Unauthorized");

    const submit = await ctx.db.get(args.submitAssignmentId);
    if (!submit) throw new Error("ไม่พบข้อมูลการส่งงาน");

    const assignment = await ctx.db.get(submit.assignmentId);
    if (!assignment) throw new Error("ไม่พบการบ้าน");

    // const member = await ctx.db
    //   .query("members")
    //   .withIndex("by_user_id", (q) =>
    //     q.eq("userId", currentUserId),
    //   )
    //   .unique();


    // if (!member || member.role !== "teacher") {
    //   throw new Error("Unauthorized");
    // }

    const members = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", currentUserId))
      .collect();

    const isTeacher = members.some((m) => m.role === "teacher");

    if (!isTeacher) {
      throw new Error("Unauthorized");
    }


    // const feedback = await ctx.db
    //   .query("feedback")
    //   .withIndex("by_submitAssignmentId", (q) => q.eq("submitAssignmentId", args.submitAssignmentId))
    //   .unique();

    // if (!feedback) {
    //   throw new Error("ไม่พบข้อมูลขอเสนอแนะ");
    // }

    // await ctx.db.patch(feedback._id, {
    //   score: 0,
    // })

    // ดึงไฟล์ทั้งหมดที่แนบมากับการส่งงานนี้
    const files = await ctx.db
      .query("submitFiles")
      .withIndex("by_submitAssignments_id", (q) =>
        q.eq("submitAssignmentId", args.submitAssignmentId)
      )
      .collect();

    // ลบไฟล์ใน _storage (ถ้ามีไฟล์แนบ)
    for (const file of files) {
      if (file.file) {
        await ctx.storage.delete(file.file); // ลบไฟล์จาก storage
      }

      // ลบ record ใน submitFiles
      await ctx.db.delete(file._id);
    }


    // เปลี่ยนสถานะเป็นส่งใหม่ได้
    await ctx.db.patch(args.submitAssignmentId, {
      status: "canResubmit",
      canResubmit: true,
    });



    await ctx.db.insert("notifications", {
      userId: submit.userId,
      workspaceId: submit.workspaceId,
      type: "resubmit-allowed",
      title: `สามารถส่งการบ้านใหม่ได้: ${assignment.name}`,
      description: "คุณได้รับสิทธิ์ในการส่งการบ้านใหม่อีกครั้ง",
      data: {
        assignmentId: assignment._id,
        submitAssignmentId: submit._id,
      },
      read: false,
      createdAt: new Date().toISOString(),
    });

  },
});


export const resubmitAssignment = mutation({
  args: {
    submitAssignmentId: v.id("submitAssignments"),
    files: v.array(
      v.object({
        name: v.string(),
        storageId: v.id("_storage"),
      })
    ),
  },
  handler: async (ctx, args) => {
    const currentUserId = await auth.getUserId(ctx);
    if (!currentUserId) throw new Error("Unauthorized");

    // const member = await ctx.db
    //   .query("members")
    //   .withIndex("by_user_id", (q) =>
    //     q.eq("userId", currentUserId),
    //   )
    //   .unique();

    // if (!member || member.role !== "student") {
    // throw new Error("Unauthorized");
    // }

    const members = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", currentUserId))
      .collect();

    const isTeacher = members.some((m) => m.role === "student");

    if (!isTeacher) {
      throw new Error("Unauthorized");
    }


    const submit = await ctx.db.get(args.submitAssignmentId);
    if (!submit) throw new Error("ไม่พบข้อมูลการส่งงาน");

    // ✅ เช็คว่าอนุญาตให้ส่งใหม่ได้
    if (submit.status !== "canResubmit") {
      throw new Error("ไม่สามารถส่งใหม่ได้ในขณะนี้");
    }

    //  ลบไฟล์เดิม (ถ้ามี)
    const oldFiles = await ctx.db
      .query("submitFiles")
      .withIndex("by_submitAssignments_id", (q) =>
        q.eq("submitAssignmentId", args.submitAssignmentId)
      )
      .collect();

    for (const file of oldFiles) {
      if (file.file) {
        await ctx.storage.delete(file.file);
      }
      await ctx.db.delete(file._id);
    }

    //  เพิ่มไฟล์ใหม่
    for (const newFile of args.files) {
      await ctx.db.insert("submitFiles", {
        submitAssignmentId: args.submitAssignmentId,
        name: newFile.name,
        file: newFile.storageId,
      });
    }

    await ctx.db.patch(args.submitAssignmentId, {
      status: "canResubmit",
      canResubmit: false,
    });

    return args.submitAssignmentId;
  },
});



export const getExistingSubmissionByUserId = query({
  args: {
    assignmentId: v.id("assignments"),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) throw new Error("ไม่พบ ห้องเรียนนี้!");

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId),
      )
      .unique();

    if (!member || member.role !== "student") {
      return;
    }

    const existingSubmission = await ctx.db
      .query("submitAssignments")
      .withIndex("by_assignment_user", (q) =>
        q.eq("assignmentId", args.assignmentId).eq("userId", member.userId)
      )
      .unique();

    // ✅ ถ้าส่งแล้ว return true
    if (existingSubmission) {
      return true;
    }

    // ✅ ถ้ายังไม่ส่ง return false
    return false;
  }
});

export const getSubmitAssignmentById = query({
  args: {
    submitAssignmentId: v.id("submitAssignments"),
  },
  handler: async (ctx, args) => {
    const currentUserId = await auth.getUserId(ctx);

    if (!currentUserId) {
      throw new Error("Unauthorized");
    }

    // ดึงข้อมูล submitAssignment
    const submitAssignment = await ctx.db.get(args.submitAssignmentId);

    if (!submitAssignment) {
      return {
        submitAssignment: null,
        submitFiles: [],
        feedback: null,
        submitUser: null,
        assignment: null,
      };
    }

    // ดึงข้อมูลของผู้ส่งงาน
    const submitUser = await ctx.db.get(submitAssignment.userId);

    // ดึงข้อมูล Assignment (ชื่อของงาน)
    const assignment = await ctx.db.get(submitAssignment.assignmentId);

    // ดึงไฟล์แนบ
    const submitFiles = await ctx.db
      .query("submitFiles")
      .withIndex("by_submitAssignments_id", (q) =>
        q.eq("submitAssignmentId", submitAssignment._id)
      )
      .collect();

    // ดึง feedback
    const feedback = await ctx.db
      .query("feedback")
      .withIndex("by_submitAssignmentId", (q) =>
        q.eq("submitAssignmentId", submitAssignment._id)
      )
      .unique();

    return {
      submitAssignment,
      submitFiles,
      feedback,
      submitUser,
      assignment, // 📝 เพิ่ม assignment object เข้าไป
    };
  },
});



export const getSubmitAssignmentForMember = query({
  args: {
    assignmentId: v.id("assignments"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const assignment = await ctx.db.get(args.assignmentId);
    if (!assignment) {
      throw new Error("ไม่พบข้อมูล งานที่หมอบหมาย!");
    }

    // ค้นหาการส่งงานของผู้ใช้คนนั้นสำหรับ assignment นี้
    const submitAssignment = await ctx.db
      .query("submitAssignments")
      .withIndex("by_assignment_user", q =>
        q.eq("assignmentId", args.assignmentId).eq("userId", userId)
      )
      .unique();

    if (!submitAssignment) {
      return {
        submitted: false,
        message: "ยังไม่ได้ส่งงาน",
        submitAssignment: null,
      };
    }

    // ดึงไฟล์ที่ส่ง
    const submitFiles = await ctx.db
      .query("submitFiles")
      .withIndex("by_submitAssignments_id", q =>
        q.eq("submitAssignmentId", submitAssignment._id)
      )
      .collect();

    // ดึง feedback
    const feedback = await ctx.db
      .query("feedback")
      .withIndex("by_submitAssignmentId", q =>
        q.eq("submitAssignmentId", submitAssignment._id)
      )
      .unique();

    return {
      submitted: true,
      submitAssignment,
      submitFiles,
      feedback,
    };
  },
});


export const get = query({
  args: {
    assignmentId: v.id("assignments"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const assignment = await ctx.db.get(args.assignmentId);
    if (!assignment) {
      throw new Error("ไม่พบข้อมูล งานที่หมอบหมาย!");
    }

    const currentMember = await getMember(ctx, assignment.workspaceId, userId);
    if (!currentMember) {
      // Return PaginationResult ที่ว่างเปล่า และกำหนด continueCursor เป็น string ว่าง
      return {
        page: [],
        isDone: true,
        continueCursor: "",
      };
    }

    const results = await ctx.db
      .query("submitAssignments")
      .withIndex("by_workspace_id_and_assignment_id", (q) =>
        q.eq("workspaceId", assignment.workspaceId).eq("assignmentId", args.assignmentId)
      )
      .order("desc")
      .paginate(args.paginationOpts ?? {});


    // ตรวจสอบผลลัพธ์ว่าไม่เป็น null
    const fixedResults = results ? results : { page: [], isDone: true, continueCursor: "" };

    // เพิ่มข้อมูลของผู้ที่ส่งการบ้าน (ดึงข้อมูลผู้ใช้ และไฟล์ที่ส่ง)
    const resultsWithUserData = await Promise.all(
      fixedResults.page.map(async (result) => {
        // ดึงข้อมูลผู้ที่ส่งการบ้าน (จากตาราง users)
        const user = await ctx.db.get(result.userId);

        // ดึงข้อมูลไฟล์ที่ส่งมา
        const submitFiles = await ctx.db
          .query("submitFiles")
          .withIndex("by_submitAssignments_id", (q) =>
            q.eq("submitAssignmentId", result._id)
          )
          .collect();

        // สร้าง URL ของไฟล์ที่ส่งมา
        const filesWithUrl = await Promise.all(
          submitFiles.map(async (fileDoc) => {
            const url = fileDoc.file ? await ctx.storage.getUrl(fileDoc.file) : undefined;
            return {
              ...fileDoc,
              url,
            };
          })
        );

        // รวมข้อมูลผู้ใช้เข้าไปในผลลัพธ์
        return {
          ...result,
          user,  // เพิ่มข้อมูลผู้ใช้
          files: filesWithUrl,
        };
      })
    );

    return {
      ...fixedResults,
      page: resultsWithUserData,  // เปลี่ยนผลลัพธ์จาก `results.page` เป็น `resultsWithUserData`
    };
  }
});
