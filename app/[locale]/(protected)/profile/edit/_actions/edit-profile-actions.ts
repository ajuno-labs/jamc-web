"use server"

import { getAuthUser } from "@/lib/auth"
import { getEnhancedPrisma } from "@/lib/db/enhanced"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { Buffer } from "buffer"
import { revalidatePath } from "next/cache"

/**
 * Update user profile information
 */
export async function updateProfile(formData: FormData) {
  try {
    const user = await getAuthUser()
    if (!user) {
      throw new Error("Authentication required")
    }

    const name = formData.get("name")?.toString()
    if (!name || name.trim().length === 0) {
      throw new Error("Name is required")
    }

    const prisma = await getEnhancedPrisma()
    
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { name: name.trim() }
    })

    revalidatePath("/profile")
    revalidatePath("/profile/edit")
    
    return { success: true, user: updatedUser }
  } catch (error) {
    console.error("Error updating profile:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update profile" 
    }
  }
}

/**
 * Upload and update user avatar
 */
export async function uploadAvatar(formData: FormData) {
  try {
    const user = await getAuthUser()
    if (!user) {
      throw new Error("Authentication required")
    }

    const file = formData.get("avatar") as File
    if (!file || file.size === 0) {
      throw new Error("No file selected")
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image")
    }

    // Validate file size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024 // 5MB
    if (file.size > MAX_SIZE) {
      throw new Error("File size must be less than 5MB")
    }

    // Setup S3 client
    const bucket = process.env.AWS_S3_BUCKET_NAME!
    const region = process.env.AWS_REGION!
    const s3 = new S3Client({ region })

    // Upload to S3
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const key = `avatars/${user.id}/${timestamp}.${extension}`

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        ContentLength: buffer.length,
      })
    )

    const imageUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`

    // Update user's image in database
    const prisma = await getEnhancedPrisma()
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { image: imageUrl }
    })

    revalidatePath("/profile")
    revalidatePath("/profile/edit")
    
    return { success: true, imageUrl, user: updatedUser }
  } catch (error) {
    console.error("Error uploading avatar:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to upload avatar" 
    }
  }
} 
