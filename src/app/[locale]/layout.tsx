import type { Metadata } from "next";
import { Poppins, Cairo } from "next/font/google";
import "../globals.css";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import { TooltipProvider } from "@/components/ui/tooltip"

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ar' ? "رابح - منصة دردشة ذكاء اصطناعي" : "Rabeh AI - Chatbot Platform",
    description: locale === 'ar' ? "إنشاء وإدارة برامج الدردشة المخصصة الخاصة بك" : "Create and manage your customized chatbots",
  };
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  // Choose the font dynamically based on the active locale
  const fontClass = locale === 'ar' ? cairo.variable : poppins.variable;
  const fontFamily = locale === 'ar' ? 'font-cairo' : 'font-poppins';

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${fontClass} ${fontFamily} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f4f7fe] dark:bg-[#0a0a0a]">
        <NextIntlClientProvider messages={messages}>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
