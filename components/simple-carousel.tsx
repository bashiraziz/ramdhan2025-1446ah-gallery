"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"

type CarouselProps = {
  images: Array<{
    path: string
    caption: string
  }>
  className?: string
}

export function SimpleCarousel(props: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || props.images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % props.images.length)
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [isPlaying, props.images.length])

  function handlePrevious() {
    if (props.images.length <= 1) return
    setCurrentIndex((prevIndex) => (prevIndex - 1 + props.images.length) % props.images.length)
  }

  function handleNext() {
    if (props.images.length <= 1) return
    setCurrentIndex((prevIndex) => (prevIndex + 1) % props.images.length)
  }

  function handlePlayPause() {
    setIsPlaying((prev) => !prev)
  }

  function handleIndicatorClick(index: number) {
    setCurrentIndex(index)
  }

  if (props.images.length === 0) {
    return (
      <div className={`relative aspect-[21/9] overflow-hidden rounded-xl bg-muted ${props.className || ""}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-muted-foreground">No images available</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative aspect-[21/9] overflow-hidden rounded-xl bg-muted ${props.className || ""}`}>
      {/* Carousel slides */}
      <div className="relative h-full w-full">
        {props.images.map((image, index) => {
          const isActive = index === currentIndex
          const visibilityClass = isActive ? "opacity-100" : "opacity-0 pointer-events-none"

          return (
            <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${visibilityClass}`}>
              <Image
                src={image.path || "/placeholder.svg"}
                alt={image.caption}
                fill
                priority={isActive}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <p className="text-lg font-medium md:text-xl">{image.caption}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation buttons */}
      <div className="absolute inset-0 flex items-center justify-between p-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-black/20 text-white backdrop-blur-sm hover:bg-black/30"
          onClick={handlePrevious}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-black/20 text-white backdrop-blur-sm hover:bg-black/30"
          onClick={handleNext}
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
        onClick={handlePlayPause}
        aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-0 right-0">
        <div className="flex justify-center gap-2">
          {props.images.map((_, index) => {
            const isActive = index === currentIndex
            const widthClass = isActive ? "w-6" : "w-2"
            const bgClass = isActive ? "bg-white" : "bg-white/50 hover:bg-white/80"

            return (
              <button
                key={index}
                className={`h-2 rounded-full transition-all ${widthClass} ${bgClass}`}
                onClick={() => {
                  handleIndicatorClick(index)
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}