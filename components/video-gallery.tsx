"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Play, X } from "lucide-react"

type Video = {
  name: string
  path: string
  caption: string
}

export function VideoGallery() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null)

  useEffect(() => {
    async function fetchVideos() {
      try {
        setLoading(true)
        const response = await fetch("/api/media")

        if (!response.ok) {
          throw new Error("Failed to fetch media")
        }

        const data = (await response.json()) as { videos: Video[] }
        setVideos(data.videos)
        setError(null)
      } catch (err) {
        console.error("Error fetching videos:", err)
        setError("Failed to load videos. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()

    // Set up polling to check for new videos every 30 seconds
    const intervalId = setInterval(fetchVideos, 30000)

    return () => clearInterval(intervalId)
  }, [])

  const openVideo = (index: number) => {
    setSelectedVideo(index)
  }

  const closeVideo = () => {
    setSelectedVideo(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ramadhan-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4 bg-ramadhan-500 hover:bg-ramadhan-600">
          Try Again
        </Button>
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">
          No videos found. Add videos to the public/videos folder to see them here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {videos.map((video, index) => (
          <div
            key={video.name}
            className="group relative flex flex-col overflow-hidden rounded-lg border border-ramadhan-200 bg-white text-card-foreground shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="relative aspect-video cursor-pointer overflow-hidden" onClick={() => openVideo(index)}>
              {/* Use a video thumbnail or first frame */}
              <div className="absolute inset-0 bg-black flex items-center justify-center">
                <video src={video.path} className="w-full h-full object-cover" preload="metadata" muted playsInline />
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-gold-500 hover:bg-gold-400 text-ramadhan-900"
                >
                  <Play className="h-6 w-6" />
                  <span className="sr-only">Play video</span>
                </Button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{video.caption}</h3>
              <p className="text-sm text-muted-foreground mt-1">Click to play video</p>
            </div>
          </div>
        ))}
      </div>

      {/* Video Dialog */}
      <Dialog open={selectedVideo !== null} onOpenChange={closeVideo}>
        <DialogContent className="max-w-4xl p-0 bg-background">
          <DialogHeader className="absolute top-0 right-0 z-10 p-2">
            <DialogTitle className="sr-only">
              {selectedVideo !== null && videos[selectedVideo]
                ? `Video: ${videos[selectedVideo].caption}`
                : "Video Player"}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => closeVideo()}
              className="h-8 w-8 rounded-full bg-ramadhan-500/80 text-white hover:bg-ramadhan-600/80"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogHeader>

          {selectedVideo !== null && videos[selectedVideo] && (
            <div className="p-4">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <video src={videos[selectedVideo].path} controls autoPlay className="w-full h-full">
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="mt-4">
                <h2 className="text-xl font-semibold">{videos[selectedVideo].caption}</h2>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}