import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Cpu, HardDrive, Monitor, Laptop, ChevronRight } from 'lucide-react';

export interface BentoBlock {
  title: string;
  subtitle: string;
  buttonText: string;
  link: string;
  bgColorLight?: string;
  bgColorDark?: string;
  buttonBgColorLight?: string;
  buttonBgColorDark?: string;
  buttonTextColorLight?: string;
  buttonTextColorDark?: string;
  tagline?: string;
  icon?: string;
}

const defaultBlocks: BentoBlock[] = [
  {
    title: "Upgrade to RTX 4090",
    subtitle: "Experience ultra-high performance gaming and rendering with the ultimate GeForce GPU.",
    tagline: "⚡ FLAGSHIP PERFORMANCE",
    buttonText: "Shop Now",
    link: "/category/gpus",
    bgColor: "#1e293b",
    textColor: "#f8fafc",
    buttonBgColor: "#ef4444",
    buttonTextColor: "#ffffff",
    icon: "zap"
  },
  {
    title: "Processors",
    subtitle: "Intel Core 14th Gen & AMD Ryzen 7000",
    buttonText: "Explore",
    link: "/category/processors",
    bgColor: "#0f172a",
    textColor: "#f8fafc",
    buttonBgColor: "#3b82f6",
    buttonTextColor: "#ffffff",
    icon: "cpu"
  },
  {
    title: "Monitors",
    subtitle: "High Refresh Rate Displays",
    buttonText: "LEARN MORE",
    link: "/category/monitors",
    bgColor: "#1e293b",
    textColor: "#f8fafc",
    buttonBgColor: "transparent",
    buttonTextColor: "#10b981",
    icon: "monitor"
  },
  {
    title: "Storage",
    subtitle: "Gen4 & Gen5 NVMe SSDs",
    buttonText: "EXPLORE",
    link: "/category/storage",
    bgColor: "#0f172a",
    textColor: "#f8fafc",
    buttonBgColor: "transparent",
    buttonTextColor: "#f59e0b",
    icon: "hard-drive"
  },
  {
    title: "Gaming Laptops",
    subtitle: "Portable powerhouses for gaming on the go.",
    buttonText: "Browse Laptops",
    link: "/category/laptops",
    bgColor: "#1e293b",
    textColor: "#f8fafc",
    buttonBgColor: "#a855f7",
    buttonTextColor: "#ffffff",
    icon: "laptop"
  }
];

export default function BentoGrid({ blocks = [] }: { blocks?: BentoBlock[] }) {
  // Use default blocks if none provided or not enough provided
  const activeBlocks = blocks && blocks.length === 5 ? blocks : defaultBlocks;

  const getIcon = (iconName?: string) => {
    switch(iconName) {
      case 'zap': return <Zap className="opacity-20" size={120} />;
      case 'cpu': return <Cpu className="opacity-20" size={80} />;
      case 'monitor': return <Monitor className="opacity-20" size={80} />;
      case 'hard-drive': return <HardDrive className="opacity-20" size={80} />;
      case 'laptop': return <Laptop className="opacity-20" size={80} />;
      default: return <Zap className="opacity-20" size={80} />;
    }
  };

  const getBlockStyle = (block: BentoBlock) => {
    return {
      '--bento-bg-light': block.bgColorLight || '#ffffff',
      '--bento-bg-dark': block.bgColorDark || '#111111',
      '--bento-btn-bg-light': block.buttonBgColorLight || '#4f46e5',
      '--bento-btn-bg-dark': block.buttonBgColorDark || '#e11d48',
      '--bento-btn-text-light': block.buttonTextColorLight || '#ffffff',
      '--bento-btn-text-dark': block.buttonTextColorDark || '#ffffff',
    } as React.CSSProperties;
  };

  return (
    <section className="container-dense my-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 auto-rows-[minmax(220px,auto)]">
        
        {/* Block 1: Left Tall (spans 4 cols, 2 rows) */}
        <div 
          className="custom-bento-block md:col-span-4 md:row-span-2 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-rig-text border border-rig-border"
          style={getBlockStyle(activeBlocks[0])}
        >
          <div className="relative z-10">
            {activeBlocks[0].tagline && (
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase mb-6 bg-yellow-400 text-black">
                {activeBlocks[0].tagline}
              </span>
            )}
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1] mb-4">
              {activeBlocks[0].title.includes('with') ? (
                activeBlocks[0].title.split('with').map((t, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && 'with'}
                    {i === 1 ? <span className="text-rig-primary">{t}</span> : t}
                  </React.Fragment>
                ))
              ) : (
                activeBlocks[0].title
              )}
            </h2>
            <p className="text-sm font-medium opacity-80 max-w-[80%] leading-relaxed">
              {activeBlocks[0].subtitle}
            </p>
          </div>
          
          <div className="mt-8 relative z-10">
            <Link 
              href={activeBlocks[0].link} 
              className="custom-bento-btn inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-transform hover:scale-105"
            >
              {activeBlocks[0].buttonText} <ArrowRight size={16} />
            </Link>
          </div>

          <div className="absolute -bottom-10 -right-10 transform group-hover:scale-110 transition-transform duration-500">
            {getIcon(activeBlocks[0].icon || 'zap')}
          </div>
        </div>

        {/* Block 2: Top Middle Wide (spans 5 cols, 1 row) */}
        <div 
          className="custom-bento-block md:col-span-5 md:row-span-1 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-rig-text border border-rig-border"
          style={getBlockStyle(activeBlocks[1])}
        >
          <div className="relative z-10">
            <h3 className="text-2xl font-black tracking-tight mb-2">{activeBlocks[1].title}</h3>
            <p className="text-sm font-medium opacity-80">{activeBlocks[1].subtitle}</p>
          </div>
          <div className="mt-6 relative z-10">
            <Link 
              href={activeBlocks[1].link} 
              className="custom-bento-btn inline-flex items-center gap-1 px-5 py-2.5 rounded-full font-bold text-xs transition-transform hover:scale-105"
            >
              {activeBlocks[1].buttonText} <ChevronRightIcon />
            </Link>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-4 transform group-hover:scale-110 transition-transform duration-500">
            {getIcon(activeBlocks[1].icon || 'smartphone')}
          </div>
        </div>

        {/* Block 3: Top Right Small (spans 3 cols, 1 row) */}
        <div 
          className="custom-bento-block md:col-span-3 md:row-span-1 rounded-3xl p-6 flex flex-col justify-between items-center text-center relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-rig-text border border-rig-border"
          style={getBlockStyle(activeBlocks[2])}
        >
          <div className="relative z-10 w-full">
            <h3 className="text-xl font-black tracking-tight mb-1">{activeBlocks[2].title}</h3>
            <p className="text-xs font-medium opacity-60 mb-4">{activeBlocks[2].subtitle}</p>
          </div>
          <div className="flex-1 flex items-center justify-center relative z-10 transform group-hover:scale-110 transition-transform duration-500">
            {getIcon(activeBlocks[2].icon || 'home')}
          </div>
          <div className="mt-4 relative z-10 w-full">
            <Link 
              href={activeBlocks[2].link} 
              className="custom-bento-btn inline-flex items-center gap-1 font-bold text-[10px] tracking-wider uppercase hover:opacity-80 transition-opacity px-3 py-1.5 rounded-full"
            >
              {activeBlocks[2].buttonText} <ChevronRightIcon />
            </Link>
          </div>
        </div>

        {/* Block 4: Bottom Middle Small (spans 3 cols, 1 row) */}
        <div 
          className="custom-bento-block md:col-span-4 md:row-span-1 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-rig-text border border-rig-border"
          style={getBlockStyle(activeBlocks[3])}
        >
          <div className="relative z-10">
            <h3 className="text-xl font-black tracking-tight mb-1">{activeBlocks[3].title}</h3>
            <p className="text-xs font-medium opacity-60">{activeBlocks[3].subtitle}</p>
          </div>
          <div className="flex-1 flex items-center justify-center relative z-10 mt-4 mb-2 transform group-hover:scale-110 transition-transform duration-500">
            {getIcon(activeBlocks[3].icon || 'monitor')}
          </div>
          <div className="relative z-10">
            <Link 
              href={activeBlocks[3].link} 
              className="custom-bento-btn inline-flex items-center gap-1 font-bold text-[10px] tracking-wider uppercase hover:opacity-80 transition-opacity px-3 py-1.5 rounded-full"
            >
              {activeBlocks[3].buttonText} <ChevronRightIcon />
            </Link>
          </div>
        </div>

        {/* Block 5: Bottom Right Wide (spans 5 cols, 1 row) */}
        <div 
          className="custom-bento-block md:col-span-4 md:row-span-1 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-rig-text border border-rig-border"
          style={getBlockStyle(activeBlocks[4])}
        >
          <div className="relative z-10 w-full max-w-[60%]">
            <h3 className="text-2xl font-black tracking-tight mb-2 leading-tight">{activeBlocks[4].title}</h3>
            <p className="text-sm font-medium opacity-80 text-rig-primary">{activeBlocks[4].subtitle}</p>
          </div>
          <div className="mt-6 relative z-10">
            <Link 
              href={activeBlocks[4].link} 
              className="custom-bento-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs transition-transform hover:scale-105"
            >
              {activeBlocks[4].buttonText} <ArrowRight size={14} />
            </Link>
          </div>
          <div className="absolute right-0 bottom-0 transform translate-x-4 translate-y-4 group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500">
            {getIcon(activeBlocks[4].icon || 'headphones')}
          </div>
        </div>

      </div>
    </section>
  );
}

function ChevronRightIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>;
}
