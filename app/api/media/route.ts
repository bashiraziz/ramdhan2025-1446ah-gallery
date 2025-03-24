import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Function to get all files from a directory
function getFilesFromDirectory(directoryPath: string) {
  try {
    const fullPath = path.join(process.cwd(), "public", directoryPath)

    // Check if directory exists
    if (!fs.existsSync(fullPath)) {
      return []
    }

    const files = fs.readdirSync(fullPath)

    // Filter for image and video files
    return files
      .filter((file) => {
        const extension = path.extname(file).toLowerCase()
        return [".jpg", ".jpeg", ".png", ".gif", ".webp", ".mp4", ".webm", ".mov"].includes(extension)
      })
      .map((file) => ({
        name: file,
        path: `/${directoryPath}/${file}`,
        type: getFileType(file),
        caption: generateCaption(file),
      }))
  } catch (error) {
    console.error("Error reading directory:", error)
    return []
  }
}

// Determine file type based on extension
function getFileType(filename: string) {
  const extension = path.extname(filename).toLowerCase()
  if ([".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(extension)) {
    return "image"
  } else if ([".mp4", ".webm", ".mov"].includes(extension)) {
    return "video"
  }
  return "unknown"
}

// Generate a caption from the filename
function generateCaption(filename: string) {
  // Remove extension and replace dashes/underscores with spaces
  const nameWithoutExtension = path.basename(filename, path.extname(filename))
  return nameWithoutExtension.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize first letter of each word
}

export async function GET() {
  // Get all photos
  const photos = getFilesFromDirectory("photos")

  // Get all videos
  const videos = getFilesFromDirectory("videos")

  return NextResponse.json({ photos, videos })
}

