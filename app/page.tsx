"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PhotoGallery } from "@/components/photo-gallery"
import { VideoGallery } from "@/components/video-gallery"
import { FeaturedCarousel } from "@/components/featured-carousel"
import { NavLink } from "@/components/nav-link"
import { Mail, Moon } from "lucide-react"
import { useState } from "react"

export default function Home() {
  const [activeTab, setActiveTab] = useState("photos")

  const handleTabChange = (value: string) => {
    setActiveTab(value)

    // Update URL hash and scroll to the section
    const sectionId = value === "photos" ? "photos-section" : "videos-section"
    window.history.replaceState(null, "", `#${sectionId}`)

    const element = document.getElementById(sectionId)
    if (element) {
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
    // Remove hash from URL
    window.history.replaceState(null, "", window.location.pathname)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-ramadhan-600 text-white shadow-md">
        <div className="container flex h-16 items-center justify-between py-4">
          <div
            className="flex items-center gap-2 font-bold cursor-pointer hover:text-gold-300 transition-colors"
            onClick={scrollToTop}
            role="button"
            tabIndex={0}
            aria-label="Go to home page"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                scrollToTop()
              }
            }}
          >
            <h1 className="text-xl md:text-2xl">Ramadhan 2025-1446ah</h1>
          </div>
          <nav className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={scrollToTop}
              className="text-sm font-medium hover:text-gold-300 transition-colors"
              aria-label="Go to home page"
            >
              Home
            </button>
            <NavLink
              href="#photos-section"
              className="text-sm font-medium hover:text-gold-300 transition-colors"
              onClick={() => setActiveTab("photos")}
            >
              Photos
            </NavLink>
            <NavLink
              href="#videos-section"
              className="text-sm font-medium hover:text-gold-300 transition-colors"
              onClick={() => setActiveTab("videos")}
            >
              Videos
            </NavLink>
            <NavLink href="#about" className="text-sm font-medium hover:text-gold-300 transition-colors">
              About
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section
          id="home-section"
          className="relative py-16 md:py-24 bg-gradient-to-b from-ramadhan-500 to-ramadhan-700 text-white overflow-hidden"
        >
          <div className="absolute inset-0 hero-pattern"></div>
          <div className="container relative">
            <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
              <div className="inline-block p-2 bg-gold-500 text-ramadhan-900 rounded-full mb-2">
                <Moon className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
                Food Distribution in Uganda
              </h1>
              <p className="max-w-[750px] text-lg text-ramadhan-100 sm:text-xl">
                Documenting our efforts to provide food and support during Ramadhan 2025-1446ah
              </p>
              <div className="mt-4">
                <NavLink
                  href="#photos-section"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-gold-500 px-8 text-sm font-medium text-ramadhan-900 shadow transition-colors hover:bg-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300"
                  onClick={() => setActiveTab("photos")}
                >
                  View Gallery
                </NavLink>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Carousel Section */}
        <section className="py-12 bg-white">
          <div className="container">
            <h2 className="text-2xl font-bold text-center mb-8 text-ramadhan-800">Featured Moments</h2>
            <FeaturedCarousel />
          </div>
        </section>

        <section id="gallery-section" className="container py-12 md:py-16">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-ramadhan-100">
              <TabsTrigger
                value="photos"
                className="data-[state=active]:bg-ramadhan-500 data-[state=active]:text-white"
              >
                Photos
              </TabsTrigger>
              <TabsTrigger
                value="videos"
                className="data-[state=active]:bg-ramadhan-500 data-[state=active]:text-white"
              >
                Videos
              </TabsTrigger>
            </TabsList>
            <TabsContent value="photos" id="photos-section" className="pt-8">
              <h2 className="text-2xl font-bold text-center mb-8 text-ramadhan-800">Photo Gallery</h2>
              <PhotoGallery />
            </TabsContent>
            <TabsContent value="videos" id="videos-section" className="pt-8">
              <h2 className="text-2xl font-bold text-center mb-8 text-ramadhan-800">Video Gallery</h2>
              <VideoGallery />
            </TabsContent>
          </Tabs>
        </section>

        <section id="about" className="py-16 md:py-20 bg-accent">
          <div className="container">
            <div className="mx-auto max-w-[768px] bg-white p-8 rounded-xl shadow-lg border border-ramadhan-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-1 bg-ramadhan-500 rounded-full"></div>
                <h2 className="text-2xl font-bold text-ramadhan-800">About This Initiative</h2>
              </div>
              <p className="mb-4 text-muted-foreground">
                During the blessed month of Ramadhan 1446ah (2025), we organized a food distribution program in Uganda
                to support families in need. This gallery documents our efforts and the impact of the initiative.
              </p>
              <p className="mb-4 text-muted-foreground">
                With the help of our generous donors and dedicated volunteers, we were able to provide essential food
                supplies to hundreds of families across multiple communities in Uganda.
              </p>
              <p className="text-muted-foreground">
                The photos and videos in this gallery capture the moments of distribution, the gratitude of recipients,
                and the spirit of community that defined this blessed initiative.
              </p>
              <div className="mt-8 p-4 bg-ramadhan-50 border-l-4 border-ramadhan-500 rounded">
                <p className="text-ramadhan-700 font-medium">
                  "Whoever feeds a fasting person will have a reward like that of the fasting person, without any
                  reduction in the reward of the fasting person." - Prophet Muhammad (PBUH)
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-ramadhan-800 text-white py-8 md:py-10">
        <div className="container">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gold-400" />
              <a href="mailto:bashiraziz@yahoo.com" className="text-sm hover:text-gold-300 transition-colors">
                bashiraziz@yahoo.com
              </a>
            </div>
            <p className="text-center text-sm leading-loose">
              &copy; {new Date().getFullYear()} Ramadhan Food Distribution Initiative. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}