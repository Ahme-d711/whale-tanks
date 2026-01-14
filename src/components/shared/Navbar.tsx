"use client"

import { Link, usePathname, useRouter } from "@/i18n/routing"
import { Globe, Menu, Check } from "lucide-react"
import LogoComponent from "./LogoComponent"
import ShinyButton from "./ShinyButton"
import { useLocale, useTranslations } from "next-intl"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
]

export default function Navbar() {
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  const navLinks = [
    { name: t("about"), href: "/about" },
    { name: t("pricing"), href: "/pricing" },
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
              key={link.href} 
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
            {t("login")}
          </ShinyButton>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="p-2 text-foreground hover:text-primary transition-colors rounded-xl hover:bg-gray-100/50"
                aria-label="Select Language"
              >
                <Globe className="w-6 h-6" />
                <span className="sr-only">Select Language</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </div>
                  {locale === lang.code && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <button className="p-2 text-foreground hover:text-primary transition-colors rounded-lg bg-secondary-foreground hover:bg-gray-100/50">
            <Menu className="w-6 h-6" />
            <span className="sr-only">Open Menu</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
