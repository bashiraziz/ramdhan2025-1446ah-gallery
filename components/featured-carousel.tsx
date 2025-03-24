"use client"

import { useState, useEffect } from "react"
import { Carousel, type ImageType } from "./carousel"

export function FeaturedCarousel() {
  const [featuredImages, setFeaturedImages] = useState<ImageType[]>([])
  const [loading, setLoading] = useState(true)

  // Fallback images to use if there's an error or no images
  const fallbackImages: ImageType[] = [
    {
      path: "/placeholder.svg?height=600&width=1200",
      caption: "Food distribution in Kampala, Uganda",
    },
    {
      path: "/placeholder.svg?height=600&width=1200",
      caption: "Volunteers preparing food packages for families",
    },
    {
      path: "/placeholder.svg?height=600&width=1200",
      caption: "Community members receiving Ramadhan food supplies",
    },
    {
      path: "/placeholder.svg?height=600&width=1200",
      caption: "Children celebrating during the food distribution event",
    },
  ]

  useEffect(() => {
    async function fetchFeaturedImages() {
      try {
        setLoading(true)
        const response = await fetch("/api/featured")

        if (!response.ok) {
          throw new Error("Failed to fetch featured images")
        }

        const data = (await response.json()) as { featuredImages: ImageType[] }
        if (data.featuredImages && data.featuredImages.length > 0) {
          setFeaturedImages(data.featuredImages)
        } else {
          // Use fallback if no images returned
          setFeaturedImages(fallbackImages)
        }
      } catch (err) {
        console.error("Error fetching featured images:", err)
        // Use fallback images on error
        setFeaturedImages(fallbackImages)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedImages()
  }, [])

  if (loading) {
    return <div className="aspect-[21/9] max-w-5xl mx-auto rounded-xl bg-muted animate-pulse" />
  }

  return (
    <Carousel
      images={featuredImages.length > 0 ? featuredImages : fallbackImages}
      className="mx-auto max-w-5xl shadow-xl"
    />
  )
}