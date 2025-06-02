import { EventEmitter } from "events";
import { getEnhancedPrisma } from "@/lib/db/enhanced";
import { ActivityType, Prisma } from "@prisma/client";

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
    await db.activityLog.create({
      data: {
        userId: payload.userId,
        type: payload.type,
        entityType: payload.entityType,
        entityId: payload.entityId,
        metadata: payload.metadata ?? ({} as Prisma.InputJsonValue),
      },
    });
  }
);
