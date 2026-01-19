"use client"

import { Link } from "@/i18n/routing"
import { ChevronDown, UserRound, PanelLeft, Menu, X } from "lucide-react"
import LogoComponent from "./shared/LogoComponent"
import ShinyButton from "./shared/ShinyButton"
import LanguageSelector from "./shared/LanguageSelector"
import { useTranslations } from "next-intl"
import { useState, useEffect } from "react"
import { useAuthStore } from "@/features/auth/stores/authStore"
import EditProfileDialog from "@/features/auth/components/EditProfileDialog"
import { Button } from "./ui/button"
import { AnimatePresence, motion } from "motion/react"

interface NavbarProps {
  onSidebarToggle?: () => void
}

export default function Navbar({ onSidebarToggle }: NavbarProps) {
  const t = useTranslations('Navigation');
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user } = useAuthStore()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY < 10) {
        // Always show navbar at the top
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false)
        setIsMobileMenuOpen(false) // Close mobile menu on scroll down
      } else {
        // Scrolling up
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollY])

  const navLinks = [
    { name: t("about"), href: "/about" },
    { name: t("pricing"), href: "/pricing" },
  ]

  return (
    <div 
      className={`sticky z-50 flex justify-center px-4 transition-transform duration-300 w-full ${
        isVisible ? 'top-6 translate-y-0' : 'top-6 -translate-y-32'
      }`}
    >
      <nav className="flex flex-col bg-background rounded-2xl shadow-sm overflow-hidden w-full max-w-5xl border border-primary/20">
        <div className="flex items-center justify-between px-6 py-2 min-h-[64px]">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            {onSidebarToggle && (
              <Button
                variant="ghost" 
                size="icon"
                onClick={onSidebarToggle}
                className="hover:bg-accent hover:text-accent-foreground rounded-xl"
              >
                <PanelLeft className="w-5 h-5 text-primary" />
              </Button>
            )}
            <Link href="/">
              <LogoComponent />
            </Link>
          </div>
          
          {/* Center Navigation (Desktop) */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className="relative text-sm font-medium text-foreground hover:text-primary transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 group"
              >
                <span className="relative z-10">{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <div 
                onClick={() => setIsEditProfileOpen(true)}
                className="flex items-center gap-2 bg-secondary px-3 py-2 rounded-2xl cursor-pointer hover:bg-secondary/70 transition-colors group"
              >
                <UserRound className="w-6 h-6 text-foreground" />
                <div className="bg-primary rounded-lg p-1">
                  <ChevronDown className="w-4 h-4 text-white" />
                </div>
              </div>
            ) : (
              <ShinyButton 
                href="/login"
                className="rounded-full! text-base capitalize! bg-primary hover:bg-blue-700 px-6 h-12 font-medium! shadow-none hidden sm:flex"
              >
                {t("login")}
              </ShinyButton>
            )}
            
            <LanguageSelector />

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden hover:bg-accent rounded-xl ml-1 cursor-pointer"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6! h-6! text-foreground" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Content */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden flex flex-col px-6 border-t border-border/50 overflow-hidden"
            >
              <div className="flex flex-col gap-4 py-6">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between text-base font-medium text-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-accent/50"
                  >
                    {link.name}
                    <ChevronDown className="w-4 h-4 -rotate-90 text-muted-foreground" />
                  </Link>
                ))}
                {!user && (
                  <div className="mt-2 text-center sm:hidden">
                    <ShinyButton 
                      href="/login"
                      className="w-full rounded-xl"
                    >
                      {t("login")}
                    </ShinyButton>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <EditProfileDialog 
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
      />
    </div>
  )
}
