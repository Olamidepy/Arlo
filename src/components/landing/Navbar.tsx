'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="sticky top-0 z-50 w-full bg-[#FCFCFC]/80 backdrop-blur-md border-b border-[#ECECEC]"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-bold tracking-tight text-[#09090B]">
            Arlo
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#product" className="text-sm font-medium text-[#6B7280] hover:text-[#09090B] transition-colors">
            Product
          </a>
          <a href="#agents" className="text-sm font-medium text-[#6B7280] hover:text-[#09090B] transition-colors">
            Agents
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-[#6B7280] hover:text-[#09090B] transition-colors">
            How It Works
          </a>
          <a href="#developers" className="text-sm font-medium text-[#6B7280] hover:text-[#09090B] transition-colors">
            Developers
          </a>
          <a href="#pricing" className="text-sm font-medium text-[#6B7280] hover:text-[#09090B] transition-colors">
            Pricing
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hidden sm:inline-block text-sm font-medium text-[#6B7280] hover:text-[#09090B] transition-colors"
          >
            GitHub
          </a>
          <Link 
            href="/dashboard"
            className="btn-arlo btn-arlo-primary !h-10 !px-5 text-sm"
          >
            Launch Startup
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
// chore: add aria-label annotation to mobile nav trigger

