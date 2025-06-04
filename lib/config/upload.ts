import { z } from "zod";

// Centralized environment schema for upload settings
const envVars = z.object({
  NEXT_PUBLIC_UPLOAD_MAX_SIZE: z.string().optional(),
}).parse(process.env);

// Use a default of 1MB if the env var is missing or invalid
const parsedValue = envVars.NEXT_PUBLIC_UPLOAD_MAX_SIZE
  ? Number(envVars.NEXT_PUBLIC_UPLOAD_MAX_SIZE)
  : NaN;

const MAX_UPLOAD_SIZE = !isNaN(parsedValue) ? parsedValue : 1048576;

export const MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE;
export const MAX_UPLOAD_SIZE_MB = +(MAX_UPLOAD_SIZE / 1024 / 1024).toFixed(1); 