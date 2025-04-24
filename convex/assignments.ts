import { mutation, query, QueryCtx } from "./_generated/server";
import { Id, TableNames } from "./_generated/dataModel";
import { v } from "convex/values";
import { auth } from "./auth";
import { paginationOptsValidator } from "convex/server";
import { url } from "inspector";

const getMember = async (ctx: QueryCtx, workspaceId: Id<"workspaces">, userId: Id<"users">) => {
    return ctx.db
        .query("members")
        .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", workspaceId).eq("userId", userId))
        .unique();
}

const getFiles = async (ctx: QueryCtx, assignmentId: Id<"assignments">) => {
    const files = await ctx.db
        .query("files")
        .withIndex("by_assignment_id", (q) =>
            q.eq("assignmentId", assignmentId)
        )
        .collect();

    const filesWithUrl = await Promise.all(
        files.map(async (fileDoc) => {
            const url = fileDoc.file
                ? await ctx.storage.getUrl(fileDoc.file)
                : undefined;
            return {
                ...fileDoc,
                url,
            };
        })
    );

    return filesWithUrl;
}



export const createAssignmentWithFiles = mutation({
    args: {
        name: v.string(),
        description: v.string(),
        score: v.number(),
        publishDate: v.string(),
        dueDate: v.string(),
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
            .withIndex("by_workspace_id_user_id", (q) => q.eq("workspaceId", args.workspaceId).eq("userId", userId),)
            .unique();

        if (!member || member.role !== "teacher") {
            throw new Error("Unauthorized");
        }

        const assignmentId = await ctx.db.insert("assignments", {
            name: args.name,
            description: args.description,
            score: args.score,
            publishDate: args.publishDate,
            dueDate: args.dueDate,
            workspaceId: args.workspaceId,
        });

        for (const file of args.files) {
            await ctx.db.insert("files", {
                name: file.name,
                assignmentId,
                file: file.storageId,
            });
        }
    }
});


export const removeAssign = mutation({
    args: {
      assignmentId: v.id("assignments"),
      workspaceId: v.id("workspaces"),
    },
    handler: async (ctx, args) => {
      const userId = await auth.getUserId(ctx);
      if (!userId) throw new Error("Unauthorized");
  
      const workspace = await ctx.db.get(args.workspaceId);
      if (!workspace) throw new Error("ไม่พบห้องเรียนนี้!");
  
      // ตรวจสอบสิทธิ์ครู
      const member = await ctx.db
        .query("members")
        .withIndex("by_workspace_id_user_id", (q) =>
          q.eq("workspaceId", args.workspaceId).eq("userId", userId)
        )
        .unique();
  
      if (!member || member.role !== "teacher") {
        throw new Error("คุณไม่มีสิทธิ์ลบการบ้านนี้");
      }
  
      // ✅ ลบไฟล์ของ assignment
      const files = await ctx.db
        .query("files")
        .withIndex("by_assignment_id", (q) => q.eq("assignmentId", args.assignmentId))
        .collect();
  
      for (const file of files) {
        if (file.file) {
          await ctx.storage.delete(file.file);
        }
        await ctx.db.delete(file._id);
      }
  
      // ✅ ลบ submitAssignments และไฟล์ที่ส่ง
      const submissions = await ctx.db
        .query("submitAssignments")
        .withIndex("by_workspace_id_and_assignment_id", (q) =>
          q.eq("workspaceId", args.workspaceId).eq("assignmentId", args.assignmentId)
        )
        .collect();
  
      for (const submission of submissions) {
        // ลบ submitFiles
        const submitFiles = await ctx.db
          .query("submitFiles")
          .withIndex("by_submitAssignments_id", (q) =>
            q.eq("submitAssignmentId", submission._id)
          )
          .collect();
  
        for (const file of submitFiles) {
          if (file.file) {
            await ctx.storage.delete(file.file);
          }
          await ctx.db.delete(file._id);
        }
  
        // ลบ feedback ถ้ามี
        const feedback = await ctx.db
        .query("feedback")
        .withIndex("by_submitAssignmentId", (q) => q.eq("submitAssignmentId", submission._id))
        .collect();
        
        for (const fb of feedback) {
          await ctx.db.delete(fb._id);
        }
  
        await ctx.db.delete(submission._id); // ลบ submitAssignment
      }
  
      // ✅ ลบ assignment
      await ctx.db.delete(args.assignmentId);
    },
  });
  

export const getById = query({
    args: {
        id: v.id("assignments")
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized");
        }

        const assignment = await ctx.db.get(args.id);

        if (!assignment) {
            throw new Error("ไม่พบข้อมูล งานที่หมอบหมาย!");
        }

        const currentMember = await getMember(ctx, assignment.workspaceId, userId);

        if (!currentMember) {
            return null;
        }

        const filesWithUrl = await getFiles(ctx, args.id)



        return {
            ...assignment,
            files: await Promise.all(
                filesWithUrl.map(async (file) => ({
                    id: file._id,
                    name: file.name,
                    url: file.url // ต้องใส่ f.url หรือเรียกจาก f ด้วย
                }))
            )
        };

    }
})

export const getUpcoming = query({
    args: {
        workspaceId: v.id("workspaces"),
        now: v.string(),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized");
        }
        // const now = new Date();
        const now = new Date().toISOString(); 

        const results = await ctx.db
            .query("assignments")
            .withIndex("by_workspace_id_and_publish", (q) =>
                q.eq("workspaceId", args.workspaceId).gt("publishDate", now)
            )
            .order("desc") // เรียงจากล่าสุด -> เก่าสุด
            .paginate(args.paginationOpts);

        return {
            ...results,
            page: await Promise.all(
                results.page.map(async (assignment) => {
                    const files = await ctx.db
                        .query("files")
                        .withIndex("by_assignment_id", (q) =>
                            q.eq("assignmentId", assignment._id)
                        )
                        .collect();

                    const filesWithUrl = await Promise.all(
                        files.map(async (fileDoc) => {
                            const url = fileDoc.file
                                ? await ctx.storage.getUrl(fileDoc.file)
                                : undefined;
                            return {
                                ...fileDoc,
                                url,
                            };
                        })
                    );

                    return {
                        ...assignment,
                        files: filesWithUrl,
                    };
                })
            ),
        };


    }

});


export const getPublic = query({
    args: {
        workspaceId: v.id("workspaces"),
        now: v.string(),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized");
        }
        // const now = new Date();
        const now = new Date().toISOString();

        const results = await ctx.db
            .query("assignments")
            .withIndex("by_workspace_id_and_publish", (q) =>
                q.eq("workspaceId", args.workspaceId).lt("publishDate", now)
            )
            .order("desc")
            .paginate(args.paginationOpts);


        return {
            ...results,
            page: await Promise.all(
                results.page.map(async (assignment) => {
                    const files = await ctx.db
                        .query("files")
                        .withIndex("by_assignment_id", (q) =>
                            q.eq("assignmentId", assignment._id)
                        )
                        .collect();

                    const filesWithUrl = await Promise.all(
                        files.map(async (fileDoc) => {
                            const url = fileDoc.file
                                ? await ctx.storage.getUrl(fileDoc.file)
                                : undefined;
                            return {
                                ...fileDoc,
                                url,
                            };
                        })
                    );

                    return {
                        ...assignment,
                        files: filesWithUrl,
                    };
                })
            ),
        };


    }

});

export const upDateDataText = mutation({
    args: {
        id: v.id("assignments"),
        name: v.string(),
        description: v.string(),
        score: v.number(),
        publishDate: v.string(),
        dueDate: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Unauthorized");
        }

        const assignment = await ctx.db.get(args.id);

        if (!assignment) {
            throw new Error("ไม่พบข้อมูล งานที่หมอบหมาย!");
        }

        const currentMember = await getMember(ctx, assignment.workspaceId, userId);

        if (!currentMember) {
            return null;
        }

        await ctx.db.patch(args.id, {
            name: args.name,
            description: args.description,
            score: args.score,
            publishDate: args.publishDate,
            dueDate: args.dueDate,
        });

        return args.id;
    }
})


export const upDateFile = mutation({
    args: {
        assignmentId: v.id("assignments"),
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

        const assignment = await ctx.db.get(args.assignmentId);

        if (!assignment) {
            throw new Error("ไม่พบข้อมูล งานที่หมอบหมาย!");
        }

        const currentMember = await getMember(ctx, assignment.workspaceId, userId);

        if (!currentMember) {
            return null;
        }

        for (const file of args.files) {
            await ctx.db.insert("files", {
                name: file.name,
                assignmentId: args.assignmentId,
                file: file.storageId,
            });
        }

        return;
    }
})


export const removeFile = mutation({
    args: {
        id: v.id("files"),
        assignmentId: v.id("assignments"),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const message = await ctx.db.get(args.id);

        if (!message) {
            throw new Error("ไม่พบข้อความนี้!");
        }
        const assignment = await ctx.db.get(args.assignmentId);

        if (!assignment) {
            throw new Error("ไม่พบข้อมูล งานที่หมอบหมาย!");
        }

        const currentMember = await getMember(ctx, assignment.workspaceId, userId);

        if (!currentMember) {
            return null;
        }

        const file = await ctx.db.get(args.id);

        if (!file) {
            throw new Error("ไม่พบไฟล์นี้!");
        }


        if (file.file) {
            await ctx.storage.delete(file.file);
        }

        await ctx.db.delete(args.id);

        return args.id;

    }
})
