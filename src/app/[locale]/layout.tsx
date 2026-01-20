import type { Metadata } from "next";
import { Roboto, Poppins, Roboto_Flex } from "next/font/google";
import "../globals.css";
import { CoreProviders, Providers } from "../providers";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { AnimatedBackground } from "@/components/AnimatedBackground";

const roboto = Roboto({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  variable: "--font-roboto-flex",
});

const poppins = Poppins({
  weight: ["400", "500", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Whale Tanks",
  description: "Join the elite.",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body
        className={`${roboto.variable} ${robotoFlex.variable} ${poppins.variable} font-sans antialiased`}
      >
        <div className="fixed inset-0 pointer-events-none z-0">
          <AnimatedBackground />
        </div>
        <NextIntlClientProvider messages={messages}>
          <CoreProviders>
            <Providers data={{ token: null, user: null }}>
              <div className="relative z-10 w-full">
                {children}
              </div>
            </Providers>
          </CoreProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
