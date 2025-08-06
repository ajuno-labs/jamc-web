import { EventEmitter } from "events";
import { getEnhancedPrisma } from "@/lib/db/enhanced";
import { ActivityType, Prisma } from "@prisma/client";
import { updateUserContribution } from "@/lib/services/contribution-service";

export const activityBus = new EventEmitter();

// Subscribe to all activity events and log them to the database
activityBus.on(
  "activity",
  async (payload: {
    userId: string;
    type: ActivityType;
    entityType?: string;
    entityId?: string;
    metadata?: Prisma.InputJsonValue;
  }) => {
    const db = await getEnhancedPrisma();
    
    // Log to ActivityLog table
    await db.activityLog.create({
      data: {
        userId: payload.userId,
        type: payload.type,
        entityType: payload.entityType,
        entityId: payload.entityId,
        metadata: payload.metadata ?? ({} as Prisma.InputJsonValue),
      },
    });

    // Update contribution tracking
    try {
      await updateUserContribution(payload.userId, payload.type);
    } catch (error) {
      console.error("Error updating user contribution:", error);
      // Don't throw here to avoid breaking the activity logging
    }
  }
);
