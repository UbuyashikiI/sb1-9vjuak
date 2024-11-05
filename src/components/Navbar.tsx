import React, { useState, useEffect } from 'react';
import { Menu, X, Book } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#1a202c]/95 backdrop-blur-md shadow-lg shadow-black/10' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2 text-blue-500 font-bold text-xl">
              <Book size={24} className="text-blue-500" />
              <span className="bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">
                よむ
              </span>
            </a>
            <div className="hidden md:flex items-center gap-1">
              <NavLink href="https://harmony-scan.fr/">Accueil</NavLink>
              <NavLink href="https://harmony-scan.fr/manga/">Projet</NavLink>
            </div>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#2d3748] transition-colors focus:outline-none"
              aria-label="Menu principal"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'
      }`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#1a202c]/95 backdrop-blur-md border-t border-gray-800">
          <MobileNavLink href="https://harmony-scan.fr/">Accueil</MobileNavLink>
          <MobileNavLink href="https://harmony-scan.fr/manga/">Projet</MobileNavLink>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-[#2d3748] rounded-lg transition-colors relative group"
    >
      {children}
      <span className="absolute bottom-1.5 left-4 right-4 h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
    </a>
  );
}

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="block px-3 py-2 rounded-lg text-base font-medium text-gray-300 hover:text-white hover:bg-[#2d3748] transition-colors"
    >
      {children}
    </a>
  );
}