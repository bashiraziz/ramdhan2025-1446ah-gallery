"use client"

import type React from "react"

import Link from "next/link"
import type { ReactNode } from "react"

interface NavLinkProps {
  href: string
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function NavLink({ href, children, className = "", onClick }: NavLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Only handle hash links
    if (!href.startsWith("#")) return

    e.preventDefault()

    // Call the onClick handler if provided
    if (onClick) {
      onClick()
    }

    // Get the target element
    const targetId = href.replace("#", "")
    const element = document.getElementById(targetId)

    if (element) {
      // Calculate position with header offset
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - headerOffset

      // Scroll to the element
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })

      // Update URL without reload
      window.history.pushState(null, "", href)
    }
  }

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  )
}