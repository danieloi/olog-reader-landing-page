"use client";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Features", href: "#features" },
    { name: "How it works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
  ];

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 w-full transition-all duration-300 z-50 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
      role="banner"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-2">
            <a
              href="#"
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1"
            >
              <img
                src="/icon.png"
                alt="Olog Reader - Convert PDFs to audiobooks"
                className="h-8 w-auto"
              />
              <span className="sr-only">Go to homepage</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center space-x-8"
            role="navigation"
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-slate-600 hover:text-slate-900 transition-colors font-medium px-3 py-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {item.name}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            <Button
              className="btn-primary touch-target"
              aria-label="Start your free trial"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden touch-target p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            onClick={handleMenuToggle}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden pb-6 border-t border-slate-200/50 mt-4"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <nav className="flex flex-col space-y-2 pt-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-slate-600 hover:text-slate-900 transition-colors font-medium px-3 py-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  onClick={handleNavClick}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex flex-col space-y-2 pt-4">
                <Button
                  variant="ghost"
                  className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 w-full touch-target justify-start"
                  onClick={handleNavClick}
                  aria-label="Sign in to your account"
                >
                  Sign In
                </Button>
                <Button
                  className="btn-primary w-full touch-target"
                  onClick={handleNavClick}
                  aria-label="Start your free trial"
                >
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
