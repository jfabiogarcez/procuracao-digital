import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Scale } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Sobre", path: "/sobre" },
    { label: "Areas de Atuacao", path: "/areas-atuacao" },
    { label: "Contato", path: "/contato" },
  ];

  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
              <Scale className="h-10 w-10 text-amber-400" />
              <div>
                <h1 className="text-2xl font-bold">JFG Advocacia</h1>
                <p className="text-xs text-blue-200">Dr. Jose Fabio Garcez - OAB/SP 504.270</p>
              </div>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <a className="px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  {item.label}
                </a>
              </Link>
            ))}
            <Link href="/procuracao">
              <a>
                <Button className="ml-4 bg-amber-500 hover:bg-amber-600 text-blue-900 font-semibold">
                  Procuracao Digital
                </Button>
              </a>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-blue-700 transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            {menuItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <a
                  className="block px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              </Link>
            ))}
            <Link href="/procuracao">
              <a onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-blue-900 font-semibold">
                  Procuracao Digital
                </Button>
              </a>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}

