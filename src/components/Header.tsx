import { useState } from 'react';
import { ShoppingCart, Search, Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

export const Header = ({ cartCount, onCartClick }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">SE</span>
          </div>
          <span className="text-xl font-bold tracking-tight">ShopEZ</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
            Home
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
            Products
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
            Categories
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
            About
          </a>
        </nav>

        {/* Search Bar - Desktop */}
        <div className="hidden lg:flex items-center space-x-2 flex-1 max-w-sm mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search products..."
              className="pl-10 bg-muted/50 border-0 focus:bg-background transition-colors"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Mobile Search */}
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Search className="w-5 h-5" />
          </Button>

          {/* User */}
          <Button variant="ghost" size="icon">
            <User className="w-5 h-5" />
          </Button>

          {/* Cart */}
          <Button variant="ghost" size="icon" onClick={onCartClick} className="relative">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <Badge 
                variant="secondary" 
                className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center bg-primary text-primary-foreground text-xs"
              >
                {cartCount}
              </Badge>
            )}
          </Button>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            <a href="#" className="block text-foreground hover:text-primary transition-colors font-medium">
              Home
            </a>
            <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
              Products
            </a>
            <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
              Categories
            </a>
            <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
              About
            </a>
            {/* Mobile Search */}
            <div className="pt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  className="pl-10 bg-muted/50 border-0"
                />
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};