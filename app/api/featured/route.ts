import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Function to get a limited number of featured images
function getFeaturedImages(limit = 4) {
  try {
    const photosPath = path.join(process.cwd(), "public", "photos")

    // Check if directory exists
    if (!fs.existsSync(photosPath)) {
      return []
    }

    const files = fs.readdirSync(photosPath)

    // Filter for image files
    const imageFiles = files.filter((file) => {
      const extension = path.extname(file).toLowerCase()
      return [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(extension)
    })

    // Get a random selection of images if there are more than the limit
    let selectedFiles = imageFiles
    if (imageFiles.length > limit) {
      // Shuffle array and take the first 'limit' elements
      selectedFiles = [...imageFiles].sort(() => 0.5 - Math.random()).slice(0, limit)
    }

    return selectedFiles.map((file) => ({
      path: `/photos/${file}`,
      caption: generateCaption(file),
    }))
  } catch (error) {
    console.error("Error getting featured images:", error)
    return []
  }
}

// Generate a caption from the filename
function generateCaption(filename: string) {
  // Remove extension and replace dashes/underscores with spaces
  const nameWithoutExtension = path.basename(filename, path.extname(filename))
  return nameWithoutExtension.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize first letter of each word
}

export async function GET() {
  const featuredImages = getFeaturedImages(4)

  return NextResponse.json({ featuredImages })
}

