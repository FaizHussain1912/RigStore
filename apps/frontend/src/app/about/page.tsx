import React from 'react';
import { Target, ShieldCheck, Heart, Users, Truck } from 'lucide-react';
import { PrismaClient } from '@rigstore/database';

const prisma = new PrismaClient();

export default async function AboutPage() {
  const settingsRow = await prisma.storeSetting.findUnique({
    where: { key: 'TEAM_MEMBERS' }
  });
  
  const teamMembers = settingsRow?.value ? (settingsRow.value as any) : [
    { name: 'Faiz Hussain', initials: 'FH', role: 'Founder', bgColor: '#2563eb' }
  ];

  return (
    <div className="container-dense py-12 md:py-24">
      {/* Hero Section */}
      <section className="text-center mb-24 max-w-4xl mx-auto">
        <span className="text-rig-primary font-bold tracking-wider text-sm uppercase bg-rig-primary/10 px-3 py-1 rounded-full mb-6 inline-block">
          About Us
        </span>
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
          Powering Your Ultimate <span className="text-rig-primary">Setup</span>
        </h1>
        <p className="text-rig-muted text-lg md:text-xl leading-relaxed mb-12">
          We started RigStore with a simple mission: to provide high-performance PC components, pre-built gaming rigs, and top-tier accessories to every gamer and creator in Pakistan — at unbeatable prices, with reliable support.
        </p>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-black text-rig-primary mb-2">10,000+</div>
            <div className="text-sm font-semibold text-rig-muted">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-black text-rig-primary mb-2">48hr</div>
            <div className="text-sm font-semibold text-rig-muted">Avg. Delivery</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-black text-rig-primary mb-2">4.8★</div>
            <div className="text-sm font-semibold text-rig-muted">Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-black text-rig-primary mb-2">100%</div>
            <div className="text-sm font-semibold text-rig-muted">Authentic</div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="grid md:grid-cols-2 gap-16 items-center mb-24">
        <div>
          <span className="text-rig-primary font-bold tracking-wider text-sm uppercase bg-rig-primary/10 px-3 py-1 rounded-full mb-4 inline-block">
            Our Mission
          </span>
          <h2 className="text-3xl md:text-4xl font-black mb-6">
            Built for <span className="text-rig-primary">Pakistan</span>
          </h2>
          <div className="space-y-4 text-rig-muted text-lg leading-relaxed">
            <p>
              Pakistan's online shopping landscape often lacks trust. We built RigStore to change that — offering genuine products, transparent pricing, and hassle-free Cash on Delivery so everyone can shop with confidence.
            </p>
            <p>
              Our team personally tests every product before listing it, ensuring you get exactly what you see — no surprises, no compromises.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-rig-surface border border-rig-border p-6 rounded-xl">
            <Heart className="text-rig-primary mb-4 w-8 h-8" />
            <h3 className="font-bold text-lg mb-2">Customer First</h3>
            <p className="text-sm text-rig-muted">Every decision is made with customer satisfaction in mind.</p>
          </div>
          <div className="bg-rig-surface border border-rig-border p-6 rounded-xl">
            <ShieldCheck className="text-rig-primary mb-4 w-8 h-8" />
            <h3 className="font-bold text-lg mb-2">Quality Assured</h3>
            <p className="text-sm text-rig-muted">Each product is personally tested and verified.</p>
          </div>
          <div className="bg-rig-surface border border-rig-border p-6 rounded-xl">
            <Target className="text-rig-primary mb-4 w-8 h-8" />
            <h3 className="font-bold text-lg mb-2">Fair Pricing</h3>
            <p className="text-sm text-rig-muted">Best prices without compromising on quality.</p>
          </div>
          <div className="bg-rig-surface border border-rig-border p-6 rounded-xl">
            <Users className="text-rig-primary mb-4 w-8 h-8" />
            <h3 className="font-bold text-lg mb-2">Community</h3>
            <p className="text-sm text-rig-muted">Building Pakistan's most trusted shopping community.</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="text-center max-w-4xl mx-auto">
        <h2 className="text-3xl font-black mb-4">Meet the <span className="text-rig-primary">Team</span></h2>
        <p className="text-rig-muted mb-12 text-lg">The dedicated people behind RigStore</p>
        
        <div className="flex flex-wrap justify-center gap-12">
          {teamMembers.map((member: any, idx: number) => (
            <div key={idx} className="text-center">
              <div 
                className="w-24 h-24 rounded-full border-4 border-rig-primary flex items-center justify-center mx-auto mb-4 text-rig-text text-2xl font-black shadow-lg"
                style={{ backgroundColor: member.bgColor || '#2563eb' }}
              >
                {member.initials}
              </div>
              <h3 className="font-bold text-lg">{member.name}</h3>
              <p className="text-sm text-rig-primary font-medium">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
