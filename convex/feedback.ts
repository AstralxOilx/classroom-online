import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";



export const createFeedback = mutation({
    args: {
        submitAssignmentId: v.id("submitAssignments"),
        score: v.number(),
        description: v.string(),
    },
    handler: async (ctx, args) => {
        const currentUserId = await auth.getUserId(ctx);

        if (!currentUserId) {
            throw new Error("Unauthorized");
        }

        const submitAssignment = await ctx.db.get(args.submitAssignmentId);

        if (!submitAssignment) {
            throw new Error("ไม่พบข้อมูล การส่งงานที่หมอบหมาย!");
        }

        const feedback = await ctx.db.insert("feedback", {
            submitAssignmentId: args.submitAssignmentId,
            score: args.score,
            description: args.description
        });



    }
});

export const updateFeedback = mutation({
    args: { 
        feedbackId: v.id("feedback"),
        score: v.number(),
        description: v.string(),
    },
    handler: async (ctx, args) => {
        const currentUserId = await auth.getUserId(ctx);

        if (!currentUserId) {
            throw new Error("Unauthorized");
        }

        

        const feedback = await ctx.db.get(args.feedbackId);

        if (!feedback) {
            throw new Error("ไม่พบข้อมูล ข้อเสนอแนะงานที่หมอบหมาย!");
        }

        await ctx.db.patch(args.feedbackId, {
            score: args.score,
            description: args.description,
          }); 
    }
});

export const getFeedbackById = query({
    args: {
        submitAssignmentId: v.id("submitAssignments"),
    },
    handler: async (ctx, args) => {
        const currentUserId = await auth.getUserId(ctx);

        if (!currentUserId) {
            throw new Error("Unauthorized");
        }

        const submitAssignment = await ctx.db.get(args.submitAssignmentId);

        if (!submitAssignment) {
            throw new Error("ไม่พบข้อมูลการส่งงานที่มอบหมาย!");
        }


        const feedback = await ctx.db
            .query("feedback")
            .withIndex("by_submitAssignmentId", (q) =>
                q.eq("submitAssignmentId", args.submitAssignmentId)
            )
            .unique(); // ดึงรายการเดียว

        return feedback;
    },
});
