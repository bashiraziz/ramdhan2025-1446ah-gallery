"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

type Photo = {
  name: string
  path: string
  caption: string
}

export function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)

  const photosPerPage = 12

  useEffect(() => {
    async function fetchPhotos() {
      try {
        setLoading(true)
        const response = await fetch("/api/media")

        if (!response.ok) {
          throw new Error("Failed to fetch media")
        }

        const data = (await response.json()) as { photos: Photo[] }
        setPhotos(data.photos)
        setError(null)
      } catch (err) {
        console.error("Error fetching photos:", err)
        setError("Failed to load photos. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchPhotos()

    // Set up polling to check for new photos every 30 seconds
    const intervalId = setInterval(fetchPhotos, 30000)

    return () => clearInterval(intervalId)
  }, [])

  const totalPages = Math.ceil(photos.length / photosPerPage)

  const indexOfLastPhoto = currentPage * photosPerPage
  const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage
  const currentPhotos = photos.slice(indexOfFirstPhoto, indexOfLastPhoto)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const openLightbox = (index: number) => {
    setSelectedPhoto(indexOfFirstPhoto + index)
  }

  const closeLightbox = () => {
    setSelectedPhoto(null)
  }

  const goToPrevious = () => {
    setSelectedPhoto((prev) => (prev !== null && prev > 0 ? prev - 1 : photos.length - 1))
  }

  const goToNext = () => {
    setSelectedPhoto((prev) => (prev !== null && prev < photos.length - 1 ? prev + 1 : 0))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      goToPrevious()
    } else if (e.key === "ArrowRight") {
      goToNext()
    } else if (e.key === "Escape") {
      closeLightbox()
    }
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

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">
          No photos found. Add photos to the public/photos folder to see them here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentPhotos.map((photo, index) => (
          <div
            key={photo.name}
            className="relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer group"
            onClick={() => openLightbox(index)}
          >
            <Image
              src={photo.path || "/placeholder.svg"}
              alt={photo.caption}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <p className="text-white text-sm truncate">{photo.caption}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => paginate(currentPage > 1 ? currentPage - 1 : currentPage)}
            disabled={currentPage === 1}
            className="border-ramadhan-200 hover:border-ramadhan-300 hover:bg-ramadhan-50"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => paginate(i + 1)}
                className={`w-8 h-8 p-0 ${currentPage === i + 1 ? "bg-ramadhan-500 hover:bg-ramadhan-600" : "border-ramadhan-200 hover:border-ramadhan-300 hover:bg-ramadhan-50"}`}
              >
                {i + 1}
              </Button>
            )).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}

            {currentPage + 2 < totalPages && (
              <>
                {currentPage + 3 < totalPages && <span className="px-1">...</span>}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(totalPages)}
                  className="w-8 h-8 p-0 border-ramadhan-200 hover:border-ramadhan-300 hover:bg-ramadhan-50"
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : currentPage)}
            disabled={currentPage === totalPages}
            className="border-ramadhan-200 hover:border-ramadhan-300 hover:bg-ramadhan-50"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={selectedPhoto !== null} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-4xl p-0 bg-background/95 backdrop-blur-sm" onKeyDown={handleKeyDown}>
          <DialogHeader className="absolute top-0 right-0 z-10 p-2">
            <DialogTitle className="sr-only">
              {selectedPhoto !== null && photos[selectedPhoto]
                ? `Photo: ${photos[selectedPhoto].caption}`
                : "Photo Viewer"}
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => closeLightbox()} className="h-8 w-8 rounded-full">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogHeader>

          {selectedPhoto !== null && photos[selectedPhoto] && (
            <div className="relative h-[80vh] w-full">
              <Image
                src={photos[selectedPhoto].path || "/placeholder.svg"}
                alt={photos[selectedPhoto].caption}
                fill
                className="object-contain"
                sizes="100vw"
              />

              <Button
                variant="ghost"
                size="icon"
                onClick={() => goToPrevious()}
                className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-ramadhan-500/80 hover:bg-ramadhan-600/80 text-white"
              >
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Previous photo</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => goToNext()}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-ramadhan-500/80 hover:bg-ramadhan-600/80 text-white"
              >
                <ChevronRight className="h-6 w-6" />
                <span className="sr-only">Next photo</span>
              </Button>

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white text-center">{photos[selectedPhoto].caption}</p>
                <p className="text-white/70 text-sm text-center mt-1">
                  {selectedPhoto + 1} of {photos.length}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}