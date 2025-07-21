import { useState, useRef } from 'react';
import { ShoppingCart, Search, Menu, X, User, UserCircle, Star, Box, Heart, Gift, BadgePercent, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { NavLink } from 'react-router-dom';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

export const Header = ({ cartCount, onCartClick }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{ left: number, top: number } | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userButtonRef = useRef<HTMLButtonElement>(null);

  // Helper to detect mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'text-primary font-semibold underline underline-offset-4'
      : 'text-muted-foreground hover:text-primary transition-colors';

  const categories = [
    { name: 'Grocery', icon: 'https://img.icons8.com/color/48/000000/shopping-basket-2.png', link: '/categories?cat=grocery' },
    { name: 'Mobiles', icon: 'https://img.icons8.com/color/48/000000/smartphone-tablet.png', link: '/categories?cat=mobiles' },
    { name: 'Fashion', icon: 'https://cdn-icons-png.flaticon.com/512/892/892458.png', link: '/categories?cat=fashion', dropdown: ['Men', 'Women', 'Kids', 'Footwear', 'Accessories'] },
    { name: 'Electronics', icon: 'https://img.icons8.com/color/48/000000/laptop.png', link: '/categories?cat=electronics', dropdown: ['Mobiles', 'Laptops', 'Cameras', 'Audio', 'Wearables'] },
    { name: 'Home & Furniture', icon: 'https://img.icons8.com/color/48/000000/sofa.png', link: '/categories?cat=home', dropdown: ['Kitchen', 'Furniture', 'Decor', 'Tools'] },
    { name: 'Appliances', icon: 'https://img.icons8.com/color/48/000000/washing-machine.png', link: '/categories?cat=appliances' },
    { name: 'Flight Bookings', icon: 'https://img.icons8.com/color/48/000000/airplane-take-off.png', link: '/categories?cat=flights' },
    { name: 'Beauty, Toys & More', icon: 'https://img.icons8.com/color/48/000000/teddy-bear.png', link: '/categories?cat=beauty', dropdown: ['Beauty', 'Toys', 'Sports', 'Books'] },
    { name: 'Two Wheelers', icon: 'https://img.icons8.com/color/48/000000/motorcycle.png', link: '/categories?cat=two-wheelers', dropdown: ['Bikes', 'Scooters', 'Accessories'] },
  ];

  return (
    <>
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
            <NavLink to="/" className={navLinkClass} end>
            Home
            </NavLink>
            <NavLink to="/products" className={navLinkClass}>
            Products
            </NavLink>
            <NavLink to="/categories" className={navLinkClass}>
            Categories
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
            About
            </NavLink>
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

          {/* User Dropdown (hover on desktop, click on mobile) */}
          <div
            className="relative"
            onMouseEnter={() => { if (!isMobile) setUserDropdownOpen(true); }}
            onMouseLeave={() => { if (!isMobile) setUserDropdownOpen(false); }}
          >
            <Button
              ref={userButtonRef}
              variant="ghost"
              size="icon"
              aria-label="Login"
              onClick={() => { if (isMobile) setUserDropdownOpen((open) => !open); }}
              className={userDropdownOpen ? 'bg-primary/10' : ''}
            >
              <User className="w-5 h-5" />
            </Button>
            {userDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-xl border z-[9999] animate-fade-in"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <span className="font-medium text-base">New customer?</span>
                  <a href="#" className="text-primary font-semibold hover:underline">Sign Up</a>
                </div>
                <div className="py-2">
                  <NavLink to="/profile" className={({isActive}) => `flex items-center px-4 py-2 text-foreground hover:bg-muted transition-colors ${isActive ? 'font-semibold text-primary' : ''}`}>
                    <UserCircle className="w-5 h-5 mr-3" /> My Profile
                  </NavLink>
                  <a href="#" className="flex items-center px-4 py-2 text-foreground hover:bg-muted transition-colors">
                    <Box className="w-5 h-5 mr-3" /> Orders
                  </a>
                  <a href="#" className="flex items-center px-4 py-2 text-foreground hover:bg-muted transition-colors">
                    <Heart className="w-5 h-5 mr-3" /> Wishlist
                  </a>
                  <a href="#" className="flex items-center px-4 py-2 text-foreground hover:bg-muted transition-colors">
                    <BadgePercent className="w-5 h-5 mr-3" /> Rewards
                  </a>
                  <a href="#" className="flex items-center px-4 py-2 text-foreground hover:bg-muted transition-colors">
                    <Gift className="w-5 h-5 mr-3" /> Gift Cards
                  </a>
                </div>
              </div>
            )}
          </div>

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
              <NavLink to="/" className={navLinkClass} end>
              Home
              </NavLink>
              <NavLink to="/products" className={navLinkClass}>
              Products
              </NavLink>
              <NavLink to="/categories" className={navLinkClass}>
              Categories
              </NavLink>
              <NavLink to="/about" className={navLinkClass}>
              About
              </NavLink>
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
      {/* Category Bar */}
      <nav className="w-full bg-white shadow-sm border-b">
        <div className="container mx-auto flex flex-row items-center justify-between px-2 sm:px-4 py-2 sm:py-3 gap-4 sm:gap-8 scrollbar-hide relative overflow-x-auto" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', overflowX: 'auto' }}>
          {categories.map((cat, idx) => (
            <div
              key={cat.name}
              className="relative flex flex-col items-center min-w-[80px] cursor-pointer group"
              onMouseEnter={e => {
                if (cat.dropdown) {
                  setOpenDropdown(cat.name);
                  // Save trigger position for fixed dropdown
                  const rect = e.currentTarget.getBoundingClientRect();
                  setDropdownPos({ left: rect.left + rect.width / 2, top: rect.bottom });
                }
              }}
              onMouseLeave={() => cat.dropdown && setOpenDropdown(null)}
              onClick={() => { if (!cat.dropdown) window.location.href = cat.link; }}
            >
              <img src={cat.icon} alt={cat.name} className="w-10 h-10 mb-1 z-10" />
              <span className="text-xs font-semibold flex items-center z-10">
                {cat.name}
                {cat.dropdown && (
                  <span
                    className={`ml-1 transition-transform duration-200 ${openDropdown === cat.name ? 'rotate-180' : ''}`}
                  >
                    ▼
                  </span>
                )}
              </span>
              {/* Dropdown */}
              {cat.dropdown && openDropdown === cat.name && (
                <div
                  className="fixed bg-white shadow-lg rounded-lg border py-2 min-w-[140px] z-[9999] animate-fade-in"
                  style={{
                    left: dropdownPos?.left || 0,
                    top: dropdownPos?.top || 0,
                    transform: 'translateX(-50%)',
                    minWidth: 160
                  }}
                >
                  {cat.dropdown.map(sub => (
                    <a
                      key={sub}
                      href={cat.link + '&sub=' + encodeURIComponent(sub)}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary whitespace-nowrap"
                    >
                      {sub}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <style>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </nav>
    </>
  );
};