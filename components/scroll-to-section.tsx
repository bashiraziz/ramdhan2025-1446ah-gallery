"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function ScrollToSection() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Handle hash links when the URL changes
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash) {
        // Remove the # from the hash
        const id = hash.substring(1)
        const element = document.getElementById(id)

        if (element) {
          // Wait a bit for any layout shifts to complete
          setTimeout(() => {
            const headerOffset = 80 // Adjust based on your header height
            const elementPosition = element.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            })
          }, 100)
        }
      }
    }

    // Initial check for hash in URL
    handleHashChange()

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange)

    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [pathname, searchParams])

  return null
}