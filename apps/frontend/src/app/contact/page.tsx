"use client";

import React from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container-dense py-12 md:py-24">
      <div className="text-center mb-16">
        <span className="text-rig-primary font-bold tracking-wider text-sm uppercase bg-rig-primary/10 px-3 py-1 rounded-full mb-4 inline-block">Contact Us</span>
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
          We're Here to <span className="text-rig-primary">Help</span>
        </h1>
        <p className="text-rig-muted max-w-2xl mx-auto text-lg">
          Got a question or need support? Our team is ready to assist you via WhatsApp, phone, or email.
        </p>
      </div>

      <div className="grid md:grid-cols-[1fr_1.5fr] gap-12 max-w-6xl mx-auto">
        {/* Contact Info */}
        <div className="space-y-4">
          <div className="bg-rig-surface border border-rig-border rounded-xl p-6 flex gap-4 items-start">
            <div className="w-12 h-12 rounded-xl bg-rig-primary/10 flex items-center justify-center text-rig-primary shrink-0">
              <Phone size={24} />
            </div>
            <div>
              <div className="font-bold text-rig-text mb-1">Phone / WhatsApp</div>
              <div className="text-sm text-rig-muted">0326-2147419</div>
              <div className="text-sm text-rig-muted">Mon–Sat: 9 AM – 9 PM</div>
            </div>
          </div>

          <div className="bg-rig-surface border border-rig-border rounded-xl p-6 flex gap-4 items-start">
            <div className="w-12 h-12 rounded-xl bg-rig-primary/10 flex items-center justify-center text-rig-primary shrink-0">
              <Mail size={24} />
            </div>
            <div>
              <div className="font-bold text-rig-text mb-1">Email</div>
              <div className="text-sm text-rig-muted">support@rigstore.com</div>
              <div className="text-sm text-rig-muted">Reply within 24 hours</div>
            </div>
          </div>

          <div className="bg-rig-surface border border-rig-border rounded-xl p-6 flex gap-4 items-start">
            <div className="w-12 h-12 rounded-xl bg-rig-primary/10 flex items-center justify-center text-rig-primary shrink-0">
              <MapPin size={24} />
            </div>
            <div>
              <div className="font-bold text-rig-text mb-1">Address</div>
              <div className="text-sm text-rig-muted">H-151 Moinabad, Model Colony Phase 3 Malir</div>
              <div className="text-sm text-rig-muted">Karachi, 75100, Pakistan</div>
            </div>
          </div>

          <div className="bg-rig-surface border border-rig-border rounded-xl p-6 flex gap-4 items-start">
            <div className="w-12 h-12 rounded-xl bg-rig-primary/10 flex items-center justify-center text-rig-primary shrink-0">
              <Clock size={24} />
            </div>
            <div>
              <div className="font-bold text-rig-text mb-1">Business Hours</div>
              <div className="text-sm text-rig-muted">Monday – Saturday</div>
              <div className="text-sm text-rig-muted">9:00 AM – 9:00 PM PKT</div>
            </div>
          </div>

          <a 
            href="https://wa.me/923262147419" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-[#25d366] hover:bg-[#20bd5a] text-rig-text p-4 rounded-full font-bold transition-colors w-full mt-6"
          >
            <MessageCircle size={20} />
            Chat on WhatsApp
          </a>
        </div>

        {/* Contact Form */}
        <div className="bg-rig-surface border border-rig-border rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-rig-muted">Your Name</label>
                <input 
                  type="text" 
                  placeholder="Muhammad Ali" 
                  className="w-full bg-rig-surface border border-rig-border rounded-lg px-4 py-3 text-rig-text focus:outline-none focus:border-rig-primary"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-rig-muted">Phone / WhatsApp</label>
                <input 
                  type="text" 
                  placeholder="0326-2147419" 
                  className="w-full bg-rig-surface border border-rig-border rounded-lg px-4 py-3 text-rig-text focus:outline-none focus:border-rig-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-rig-muted">Email Address</label>
              <input 
                type="email" 
                placeholder="you@email.com" 
                className="w-full bg-rig-surface border border-rig-border rounded-lg px-4 py-3 text-rig-text focus:outline-none focus:border-rig-primary"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-rig-muted">Subject</label>
              <select className="w-full bg-rig-surface border border-rig-border rounded-lg px-4 py-3 text-rig-text focus:outline-none focus:border-rig-primary">
                <option value="General Inquiry">General Inquiry</option>
                <option value="Order Issue">Order Issue</option>
                <option value="Return Request">Return Request</option>
                <option value="Product Question">Product Question</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-rig-muted">Message</label>
              <textarea 
                rows={5} 
                placeholder="Tell us how we can help you..." 
                className="w-full bg-rig-surface border border-rig-border rounded-lg px-4 py-3 text-rig-text focus:outline-none focus:border-rig-primary resize-y"
                required
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-rig-primary hover:bg-rig-primary/90 text-white font-bold py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Send size={18} />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
