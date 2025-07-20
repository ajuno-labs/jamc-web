"use server";

import { getCurrentUser } from "@/lib/auth/user";
import { activityBus } from "@/lib/events";
import { ActivityType } from "@prisma/client";

/**
 * Wraps a server action to automatically emit an activity event.
 * The wrapped function receives (userId, entityId) and returns a Promise.
 * The returned action takes (entityId) and infers user in wrapper.
 */
export async function withActivity<T>(
  type: ActivityType,
  entityType: string,
  fn: (userId: string, entityId: string) => Promise<T>
) {
  return async (entityId: string): Promise<T> => {
    const user = await getCurrentUser();
    if (!user?.id) throw new Error("Authentication required");
    // Perform the business logic
    const result = await fn(user.id, entityId);
    // Emit the activity event for logging
    activityBus.emit("activity", {
      userId: user.id,
      type,
      entityType,
      entityId,
      metadata: {},
    });
    return result;
  };
}
