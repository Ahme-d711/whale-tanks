"use client"

import Link from "next/link"
import { Globe, Menu } from "lucide-react"
import LogoComponent from "./LogoComponent"
import ShinyButton from "./ShinyButton"

export default function Navbar() {
  const navLinks = [
    { name: "About Us", href: "/about" },
    { name: "Packages and prices", href: "/pricing" },
  ]

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="flex items-center justify-between w-full max-w-5xl border-t border-primary bg-background rounded-2xl shadow-sm p-6">
        {/* Logo Section */}
        <Link href="/">
          <LogoComponent />
        </Link>
        
        {/* Center Navigation (Desktop) */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <ShinyButton 
            href="/login"
            className="rounded-full bg-primary hover:bg-blue-700 px-6 h-10 w-auto font-semibold shadow-none"
          >
            Login
          </ShinyButton>
          
          <button className="p-2 text-foreground hover:text-primary transition-colors rounded-xl hover:bg-gray-100/50">
            <Globe className="w-6 h-6" />
            <span className="sr-only">Switch Language</span>
          </button>
          
          <button className="p-2 text-foreground hover:text-primary transition-colors rounded-lg bg-secondary-foreground hover:bg-gray-100/50">
            <Menu className="w-6 h-6" />
            <span className="sr-only">Open Menu</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
