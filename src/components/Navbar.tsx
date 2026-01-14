"use client"

import { Link } from "@/i18n/routing"
import { Menu } from "lucide-react"
import LogoComponent from "./shared/LogoComponent"
import ShinyButton from "./shared/ShinyButton"
import LanguageSelector from "./shared/LanguageSelector"
import { useTranslations } from "next-intl"

export default function Navbar() {
  const t = useTranslations('Navigation');

  const navLinks = [
    { name: t("about"), href: "/about" },
    { name: t("pricing"), href: "/pricing" },
  ]

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="flex items-center justify-between w-full max-w-5xl border-t-2 border-primary bg-background rounded-2xl shadow-sm p-6">
        {/* Logo Section */}
        <Link href="/">
          <LogoComponent />
        </Link>
        
        {/* Center Navigation (Desktop) */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className="relative text-base font-bold! text-foreground hover:text-primary transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 group"
            >
              <span className="relative z-10">{link.name}</span>
              {/* <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span> */}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <ShinyButton 
            href="/login"
            className="rounded-full! text-base bg-primary hover:bg-blue-700 px-6 h-12 font-normal! shadow-none"
          >
            {t("login")}
          </ShinyButton>
          
          <LanguageSelector />
          
          <button className="p-2 text-foreground cursor-pointer hover:text-primary transition-colors rounded-lg bg-secondary-foreground hover:bg-gray-100/50">
            <Menu className="w-6 h-6" />
            <span className="sr-only">Open Menu</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
