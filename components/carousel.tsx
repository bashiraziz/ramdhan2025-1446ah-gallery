"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import { cn } from "@/lib/utils"

export type ImageType = {
  path: string
  caption: string
}

interface CarouselProps {
  images: ImageType[]
  autoPlayInterval?: number
  className?: string
}

export function Carousel({ images, autoPlayInterval = 5000, className }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  const goToNext = useCallback(() => {
    if (images.length <= 1) return
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }, [images.length])

  const goToPrevious = useCallback(() => {
    if (images.length <= 1) return
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }, [images.length])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  const toggleAutoPlay = useCallback(() => {
    setIsPlaying((prev) => !prev)
  }, [])

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || images.length <= 1) return

    const interval = setInterval(() => {
      goToNext()
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [isPlaying, autoPlayInterval, goToNext, images.length])

  // Simple image preloading
  useEffect(() => {
    if (images.length === 0 || typeof window === "undefined") {
      setIsLoaded(true)
      return
    }

    setIsLoaded(false)
    let loadedCount = 0

    const markLoaded = () => {
      loadedCount++
      if (loadedCount >= images.length) {
        setIsLoaded(true)
      }
    }

    images.forEach((image) => {
      if (typeof window !== "undefined") {
        const img = new window.Image()
        img.onload = markLoaded
        img.onerror = markLoaded
        img.src = image.path

        if (img.complete) {
          markLoaded()
        }
      }
    })

    const timeout = setTimeout(() => {
      setIsLoaded(true)
    }, 5000)

    return () => clearTimeout(timeout)
  }, [images])

  if (images.length === 0) {
    return (
      <div className={cn("relative aspect-[21/9] overflow-hidden rounded-xl bg-muted", className)}>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-muted-foreground">No images available</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative aspect-[21/9] overflow-hidden rounded-xl bg-muted",
        !isLoaded && "animate-pulse",
        className,
      )}
    >
      {/* Carousel slides */}
      <div className="relative h-full w-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none",
            )}
          >
            <Image
              src={image.path || "/placeholder.svg"}
              alt={image.caption}
              fill
              priority={index === currentIndex}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <p className="text-lg font-medium md:text-xl">{image.caption}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="absolute inset-0 flex items-center justify-between p-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-black/20 text-white backdrop-blur-sm hover:bg-black/30"
          onClick={goToPrevious}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-black/20 text-white backdrop-blur-sm hover:bg-black/30"
          onClick={goToNext}
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Play/Pause button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute bottom-4 right-4 h-8 w-8 rounded-full bg-black/20 text-white backdrop-blur-sm hover:bg-black/30"
        onClick={toggleAutoPlay}
        aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-0 right-0">
        <div className="flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-2 rounded-full transition-all",
                index === currentIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white/80",
              )}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}