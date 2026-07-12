import './globals.css';
import type { Metadata } from 'next';
import { CartProvider } from './CartContext';
import { AuthProvider } from './AuthContext';
import { WishlistProvider } from './WishlistContext';
import { ToastProvider } from './ToastContext';
import Navbar from '../components/Navbar';
import CartSidebar from '../components/CartSidebar';
import WishlistSidebar from '../components/WishlistSidebar';
import TrackingProvider from './TrackingProvider';
import Footer from '../components/Footer';
import Chatbot from '@/components/Chatbot';
import { ThemeProvider } from '../components/ThemeProvider';
import { PrismaClient } from '@rigstore/database';
import { CurrencyProvider } from './CurrencyContext';
import NextTopLoader from 'nextjs-toploader';

const prisma = new PrismaClient();

export const revalidate = 15;

export const metadata: Metadata = {
  title: 'RigStore',
  description: 'High-performance online computer hardware store',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await prisma.storeSetting.findMany({
    where: { 
      key: { in: ['PROMO_BANNER', 'HOMEPAGE_SIDEBAR', 'GENERAL_SETTINGS', 'FOOTER_SETTINGS', 'AI_CHATBOT_SETTINGS'] }
    }
  });
  const settingsMap = settings.reduce((acc: Record<string, any>, s: any) => { acc[s.key] = s.value; return acc; }, {} as Record<string, any>);
  
  const promoBanner = settingsMap['PROMO_BANNER'] || { visible: false, text: '', bgColor: '#f97316' };
  const customNavbarLinks = Array.isArray(settingsMap['HOMEPAGE_SIDEBAR']) ? settingsMap['HOMEPAGE_SIDEBAR'] : [];
  const generalSettings = settingsMap['GENERAL_SETTINGS'] || {};
  const storeCurrency = generalSettings.currency || 'PKR';
  const footerSettings = settingsMap['FOOTER_SETTINGS'] || {};
  const aiSettings = settingsMap['AI_CHATBOT_SETTINGS'] || {};

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NextTopLoader color="#FF0000" showSpinner={false} height={3} />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <CurrencyProvider initialCurrency={storeCurrency}>
            <ToastProvider>
              <AuthProvider>
                <WishlistProvider>
                  <CartProvider>
                    <TrackingProvider>
                      {(promoBanner.visible === true || promoBanner.visible === 'true') && promoBanner.text && (
                        <div 
                          className="w-full text-center py-2 text-sm font-bold px-4 text-white custom-promo-banner"
                          style={{
                            '--promo-bg-light': promoBanner.bgColorLight || '#4f46e5',
                            '--promo-bg-dark': promoBanner.bgColorDark || '#e11d48'
                          } as React.CSSProperties}
                        >
                          {promoBanner.text}
                        </div>
                      )}
                      <Navbar customLinks={customNavbarLinks} generalSettings={generalSettings} />
                      <CartSidebar />
                      <WishlistSidebar />
                      {children}
                      <Footer settings={footerSettings} />
                      <Chatbot settings={aiSettings} />
                    </TrackingProvider>
                  </CartProvider>
                </WishlistProvider>
              </AuthProvider>
            </ToastProvider>
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
