"use client"

import { Link } from "@/i18n/routing"
import { ChevronDown, LogOut, Menu, X } from "lucide-react"
import LogoComponent from "./shared/LogoComponent"
import ShinyButton from "./shared/ShinyButton"
import LanguageSelector from "./shared/LanguageSelector"
import { useTranslations } from "next-intl"
import { useState, useEffect } from "react"
import { useAuthStore } from "@/features/auth/stores/authStore"
import EditProfileDialog from "@/features/auth/components/EditProfileDialog"
import { Button } from "./ui/button"
import { AnimatePresence, motion } from "motion/react"
import { removeCookie } from "@/utils/cookies"
import { TOKEN_KEY } from "@/utils/constants"
import { useRouter } from "next/navigation"

interface NavbarProps {
  onSidebarToggle?: () => void
}

export default function Navbar({ onSidebarToggle }: NavbarProps) {
  const t = useTranslations('Navigation');
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, clearAuth } = useAuthStore()

  const handleLogout = () => {
    clearAuth()
    removeCookie(TOKEN_KEY)
    setIsMobileMenuOpen(false)
    router.push('/')
  };
  

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
    { name: t("projects"), href: "/projects" },
  ]

  return (
    <div 
      className={`sticky z-50 flex justify-center px-4 transition-transform duration-300 w-full ${
        isVisible ? 'top-6 translate-y-0' : 'top-6 -translate-y-32'
      }`}
    >
      <nav className="flex flex-col bg-background rounded-2xl shadow-sm overflow-hidden w-full max-w-6xl border-t-2 border-primary">
        <div className="flex items-center justify-between px-6 py-2 min-h-[64px]">
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
                className="relative text-sm font-medium text-foreground hover:text-primary transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 group"
              >
                <span className="relative z-10">{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div 
                  onClick={() => setIsEditProfileOpen(true)}
                  className="flex items-center bg-secondary p-1 rounded-full cursor-pointer hover:bg-secondary/70 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition-transform border-2 border-white/20">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="rounded-full hover:bg-destructive/10 text-destructive hover:text-destructive transition-all cursor-pointer hidden md:flex"
                  title={t("logout")}
                >
                  <LogOut className="w-5 h-5" />
                </Button>
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
                {user ? (
                  <button 
                    onClick={handleLogout}
                    className="flex items-center justify-between text-base font-medium text-destructive hover:bg-destructive/10 transition-colors p-2 rounded-lg mt-2 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                       <LogOut className="w-4 h-4" />
                       {t("logout")}
                    </div>
                  </button>
                ) : (
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
