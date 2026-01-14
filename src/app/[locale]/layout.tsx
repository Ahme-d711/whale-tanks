import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "../globals.css";
import { CoreProviders, Providers } from "../providers";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

const roboto = Roboto({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
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
        className={`${roboto.variable} font-sans antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <CoreProviders>
            <Providers data={{ token: null, user: null }}>
              {children}
            </Providers>
          </CoreProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
