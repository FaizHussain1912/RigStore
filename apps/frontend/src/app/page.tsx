import React from 'react';
import { Zap, ChevronRight, Monitor, Cpu, HardDrive, ShieldAlert, Laptop, MonitorSmartphone, Headphones, Mouse, Keyboard } from 'lucide-react';
import Link from 'next/link';
import { PrismaClient } from '@rigstore/database';
import HeroSlider from '../components/HeroSlider';
import BentoGrid from '../components/BentoGrid';

const prisma = new PrismaClient();

export const revalidate = 15;

export default async function Page() {
  const settings = await prisma.storeSetting.findMany();
  const settingsMap: Record<string, any> = {};
  settings.forEach((s: any) => { settingsMap[s.key] = s.value; });

  let homeBanners: any[] = [];
  const homeBannerSetting = settingsMap['HOME_BANNER'];
  
  if (Array.isArray(homeBannerSetting)) {
    homeBanners = homeBannerSetting;
  } else if (homeBannerSetting && typeof homeBannerSetting === 'object') {
    homeBanners = [homeBannerSetting];
  }

  let bentoBlocks = settingsMap['BENTO_GRID'];
  if (!Array.isArray(bentoBlocks)) bentoBlocks = [];

  return (
    <div className="w-full flex flex-col gap-12 pb-12">
      
      {/* Hero Section - Auto-Sliding Banners */}
      <HeroSlider banners={homeBanners} />

      {/* Bento Grid */}
      <BentoGrid blocks={bentoBlocks.length === 5 ? bentoBlocks : undefined} />

      {/* Featured Categories Dense Grid */}
      <section className="container-dense">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-rig-text tracking-tight flex items-center gap-2">
            Browse Hardware
          </h2>
          <Link href="/category/all" className="text-sm font-medium text-rig-primary hover:underline flex items-center">
            View All Parts <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { name: 'Processors', icon: Cpu, specs: 'Intel 14th Gen, AMD AM5', link: '/category/processors' },
            { name: 'Graphic Cards', icon: Zap, specs: 'RTX 40-Series, RX 7000', link: '/category/gpus' },
            { name: 'Laptops', icon: Laptop, specs: 'Gaming and Creator Laptops', link: '/category/laptops' },
            { name: 'Monitors', icon: MonitorSmartphone, specs: 'High Refresh Rate Displays', link: '/category/monitors' },
            { name: 'Headphones', icon: Headphones, specs: 'Gaming Headsets & Audio', link: '/category/headphones' },
            { name: 'Mice & Keyboards', icon: Mouse, specs: 'Esports Peripherals', link: '/category/mice' },
          ].map((cat, i) => (
            <Link href={cat.link} key={i} className="glass-panel p-5 flex flex-col items-center text-center gap-3 hover:border-rig-primary/50 transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-rig-background border border-rig-border rounded-full flex items-center justify-center text-rig-muted group-hover:text-rig-primary transition-colors">
                <cat.icon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-rig-text text-sm">{cat.name}</h3>
                <p className="text-[10px] text-rig-muted mt-1 uppercase tracking-widest">{cat.specs}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PC Builder Call to Action */}
      <section className="container-dense mt-8">
        <div className="w-full bg-rig-surface border border-rig-border p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 rounded-xl">
          <div className="flex flex-col items-start gap-3 max-w-xl">
            <h2 className="text-3xl font-bold text-rig-text tracking-tight">The Ultimate PC Builder Engine</h2>
            <p className="text-rig-muted leading-relaxed text-sm">
              Don't worry about compatibility. Our constraint-satisfaction engine guarantees your selected CPU, Motherboard, and RAM will work flawlessly together, while automatically calculating power draw to recommend the perfect PSU.
            </p>
          </div>
          <Link href="/builder" className="bg-rig-primary text-white hover:bg-rig-primary/90 font-bold py-3 px-8 transition-all shrink-0 text-sm shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] dark:shadow-[0_0_20px_rgba(225,29,72,0.3)] dark:hover:shadow-[0_0_30px_rgba(225,29,72,0.5)] rounded-lg inline-flex items-center justify-center">
            Start Building Now
          </Link>
        </div>
      </section>

    </div>
  );
}
