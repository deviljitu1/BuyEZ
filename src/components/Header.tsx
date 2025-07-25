import { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Search, Menu, X, User, UserCircle, Star, Box, Heart, Gift, BadgePercent, ChevronRight, Camera, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { NavLink, useNavigate } from 'react-router-dom';
import { mockProducts } from '@/data/mockProducts';
import React from 'react';
import { createPortal } from 'react-dom';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

export const Header = ({ cartCount, onCartClick }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{ left: number, top: number } | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const userButtonRef = useRef<HTMLButtonElement>(null);
  const [language, setLanguage] = useState('en');
  const languages = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'hi', label: 'Hindi', short: 'HI' },
    { code: 'or', label: 'Odia', short: 'OD' },
    { code: 'mr', label: 'Marathi', short: 'MR' },
    { code: 'ta', label: 'Tamil', short: 'TA' },
  ];
  const [searchValue, setSearchValue] = useState('');
  const [qrResult, setQrResult] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<{name: string, category: string}[]>([]);
  const mostSearched = ['iPhone 14 Pro', 'MacBook Pro', 'AirPods Pro', 'Apple Watch', 'iPad Pro', 'iMac'];
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint is 640px
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('recent-searches');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  }, []);

  // Add to recent searches
  const addRecentSearch = (term: string) => {
    if (!term.trim()) return;
    try {
      const newSearches = [
        term,
        ...recentSearches.filter(s => s.toLowerCase() !== term.toLowerCase())
      ].slice(0, 5); // Keep only last 5 searches
      setRecentSearches(newSearches);
      localStorage.setItem('recent-searches', JSON.stringify(newSearches));
    } catch (error) {
      console.error('Error saving recent searches:', error);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) return;
    addRecentSearch(searchValue);
    setShowSearchDropdown(false);
    navigate(`/search?q=${encodeURIComponent(searchValue)}`);
    setSearchValue(''); // Clear search after submission
  };

  const handleSearchFocus = () => {
    setShowSearchDropdown(true);
  };

  const handleSearchBlur = (e: React.FocusEvent) => {
    // Only hide if clicking outside the search area
    const target = e.relatedTarget as HTMLElement;
    if (!target?.closest('.search-dropdown')) {
      setTimeout(() => {
        setShowSearchDropdown(false);
      }, 200);
    }
  };

  const handleSearchItemClick = (term: string) => {
    setSearchValue(term);
    addRecentSearch(term);
    navigate(`/search?q=${encodeURIComponent(term)}`);
    setSearchValue(''); // Clear search after clicking item
    setShowSearchDropdown(false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent-searches');
  };

  // Voice search handler
  const handleVoiceSearch = () => {
    setQrResult('');
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice search is not supported in this browser.');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      setSearchValue(event.results[0][0].transcript);
    };
    recognition.onerror = (event: any) => {
      alert('Voice search error: ' + event.error);
    };
    recognition.start();
  };
  // Camera/QR handler
  const handleCameraClick = () => {
    setQrResult('');
    fileInputRef.current?.click();
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // For demo, just show filename or mock QR result
      setQrResult('QR scanned! (' + e.target.files[0].name + ')');
    }
  };

  // Live suggestions as user types
  useEffect(() => {
    if (searchValue.trim()) {
      const val = searchValue.trim().toLowerCase();
      const filtered = mockProducts
        .filter(p =>
          p.name.toLowerCase().includes(val) ||
          (p.category && p.category.toLowerCase().includes(val))
        )
        .slice(0, 6)
        .map(p => ({ name: p.name, category: p.category || '' }));
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchValue]);

  // Helper to highlight match
  function highlightMatch(text: string, query: string) {
    if (!query) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span className="bg-primary/20 text-primary font-semibold">{text.slice(idx, idx + query.length)}</span>
        {text.slice(idx + query.length)}
      </>
    );
  }

  // Helper to detect mobile
  // const isMobile = typeof window !== 'undefined' && window.innerWidth < 768; // This line is now redundant

  // Mutually exclusive openers
  const openMenu = () => {
    setIsMenuOpen(true);
    setUserDropdownOpen(false);
    setMobileSearchOpen(false);
  };
  const openUserDropdown = () => {
    setUserDropdownOpen(true);
    setIsMenuOpen(false);
    setMobileSearchOpen(false);
  };
  const openMobileSearch = () => {
    setMobileSearchOpen(true);
    setIsMenuOpen(false);
    setUserDropdownOpen(false);
  };
  const closeAll = () => {
    setIsMenuOpen(false);
    setUserDropdownOpen(false);
    setMobileSearchOpen(false);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'text-primary font-semibold underline underline-offset-4'
      : 'text-muted-foreground hover:text-primary transition-colors';

  const categories = [
    { name: 'Grocery', icon: 'https://img.icons8.com/color/48/000000/shopping-basket-2.png', link: '/grocery' },
    { name: 'Mobiles', icon: 'https://img.icons8.com/color/48/000000/smartphone-tablet.png', link: '/mobiles' },
    { 
      name: 'Fashion', 
      icon: 'https://cdn-icons-png.flaticon.com/512/892/892458.png', 
      link: '/fashion', 
      dropdown: [
        { name: 'Men', link: '/fashion#men' },
        { name: 'Women', link: '/fashion#women' },
        { name: 'Kids', link: '/fashion#kids' },
        { name: 'Footwear', link: '/fashion#footwear' },
        { name: 'Accessories', link: '/fashion#accessories' }
      ]
    },
    { name: 'Electronics', icon: 'https://img.icons8.com/color/48/000000/laptop.png', link: '/categories?cat=electronics', dropdown: ['Mobiles', 'Laptops', 'Cameras', 'Audio', 'Wearables'] },
    { name: 'Home & Furniture', icon: 'https://img.icons8.com/color/48/000000/sofa.png', link: '/categories?cat=home', dropdown: ['Kitchen', 'Furniture', 'Decor', 'Tools'] },
    { name: 'Appliances', icon: 'https://img.icons8.com/color/48/000000/washing-machine.png', link: '/categories?cat=appliances' },
    { name: 'Flight Bookings', icon: 'https://img.icons8.com/color/48/000000/airplane-take-off.png', link: '/categories?cat=flights' },
    { name: 'Beauty, Toys & More', icon: 'https://img.icons8.com/color/48/000000/teddy-bear.png', link: '/categories?cat=beauty', dropdown: ['Beauty', 'Toys', 'Sports', 'Books'] },
    { name: 'Two Wheelers', icon: 'https://img.icons8.com/color/48/000000/motorcycle.png', link: '/categories?cat=two-wheelers', dropdown: ['Bikes', 'Scooters', 'Accessories'] },
  ];

  // Add class to dropdown for blur handler
  const searchDropdownClass = "search-dropdown bg-white shadow-lg p-4 animate-fade-in text-left border-t border-border";

  return (
    <>
    <header className="sticky top-0 z-[999999] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b w-full">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2" style={{ position: 'relative', zIndex: 999999 }}>
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">SE</span>
          </div>
          <span className="text-xl font-bold tracking-tight">ShopEZ</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8" style={{ position: 'relative', zIndex: 999999 }}>
            <NavLink to="/" className={navLinkClass} end>
            Home
            </NavLink>
            <NavLink to="/products" className={navLinkClass}>
            Products
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
            About
            </NavLink>
            <NavLink to="/rewards" className={navLinkClass}>
            Rewards
            </NavLink>
        </nav>

        {/* Search Bar - Desktop Only */}
        <div className="hidden md:block relative w-full max-w-md">
          <form onSubmit={handleSearchSubmit} className="flex items-center relative">
            <Search className="w-5 h-5 text-muted-foreground absolute left-3" />
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              ref={searchInputRef}
            />
          </form>
          {/* Desktop Search Dropdown using Portal */}
          {showSearchDropdown && !isMobile && typeof window !== 'undefined' && createPortal(
            <div 
              className={searchDropdownClass + " rounded-xl max-h-[80vh] overflow-y-auto border"}
              style={{
                zIndex: 999999,
                position: 'fixed',
                left: searchInputRef.current?.getBoundingClientRect().left,
                top: searchInputRef.current?.getBoundingClientRect().bottom,
                width: searchInputRef.current?.getBoundingClientRect().width
              }}
            >
              {/* Live Suggestions */}
              {searchValue.trim() && suggestions.length > 0 && (
                <div className="mb-3">
                  <div className="text-sm font-semibold text-foreground mb-2">Product Suggestions</div>
                  <div className="flex flex-col gap-1">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        className="flex items-center px-4 py-3 rounded-lg hover:bg-muted transition-colors text-left"
                        type="button"
                        onMouseDown={() => handleSearchItemClick(s.name)}
                      >
                        <span className="font-medium text-sm">{highlightMatch(s.name, searchValue)}</span>
                        {s.category && (
                          <span className="text-xs text-muted-foreground ml-2">in {highlightMatch(s.category, searchValue)}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* Recent Searches */}
              {!searchValue.trim() && recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold text-foreground">Recent Searches</div>
                    <button
                      className="text-xs text-primary hover:text-primary/80 hover:underline bg-transparent"
                      type="button"
                      onMouseDown={clearRecentSearches}
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {recentSearches.map((s, i) => (
                      <button
                        key={i}
                        className="px-4 py-2 rounded-full bg-muted text-sm hover:bg-muted/80 transition-colors"
                        type="button"
                        onMouseDown={() => handleSearchItemClick(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {/* Most Searched */}
              {!searchValue.trim() && (
                <div>
                  <div className="text-sm font-semibold text-foreground mb-2">Popular Searches</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {mostSearched.map((s, i) => (
                      <button
                        key={i}
                        className="px-4 py-2 rounded-full bg-muted text-sm hover:bg-muted/80 transition-colors"
                        type="button"
                        onMouseDown={() => handleSearchItemClick(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>,
            document.body
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2" style={{ position: 'relative', zIndex: 999999 }}>
          {/* Language Select: only show on sm and up */}
          <div className="relative hidden sm:block" style={{ position: 'relative', zIndex: 999999 }}>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="rounded-md border border-muted bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-w-[80px]"
              aria-label="Select Language"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
          </div>
          {/* Mobile Search: REMOVE search icon, add modern search bar below header */}

          {/* User Dropdown (hover on desktop, click on mobile) */}
          <div
            className="relative"
            onMouseEnter={() => { if (!isMobile) openUserDropdown(); }}
            onMouseLeave={() => { if (!isMobile) setUserDropdownOpen(false); }}
            style={{ position: 'relative', zIndex: 999999 }}
          >
            <Button
              ref={userButtonRef}
              variant="ghost"
              size="icon"
              aria-label="Login"
              onClick={() => { if (isMobile) userDropdownOpen ? setUserDropdownOpen(false) : openUserDropdown(); }}
              className={userDropdownOpen ? 'bg-primary/10' : ''}
            >
              <User className="w-5 h-5" />
            </Button>
            {userDropdownOpen && createPortal(
              <div
                className="fixed bg-white shadow-xl rounded-xl border animate-fade-in"
                style={{
                  minWidth: 220,
                  zIndex: 999999,
                  right: '1rem',
                  top: '4rem',
                  width: '16rem'
                }}
              >
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <span className="font-medium text-base">New customer?</span>
                  <NavLink to="/signup" className="text-primary font-semibold hover:underline">Sign Up</NavLink>
                </div>
                <div className="py-2">
                  <NavLink to="/profile" className={({isActive}) => `flex items-center px-4 py-2 text-foreground hover:bg-muted transition-colors ${isActive ? 'font-semibold text-primary' : ''}`}>
                    <UserCircle className="w-5 h-5 mr-3" /> My Profile
                  </NavLink>
                  <NavLink to="/orders" className={({isActive}) => `flex items-center px-4 py-2 text-foreground hover:bg-muted transition-colors ${isActive ? 'font-semibold text-primary' : ''}`}>
                    <Box className="w-5 h-5 mr-3" /> Orders
                  </NavLink>
                  <NavLink to="/rewards" className={({isActive}) => `flex items-center px-4 py-2 text-foreground hover:bg-muted transition-colors ${isActive ? 'font-semibold text-primary' : ''}`}>
                    <Gift className="w-5 h-5 mr-3" /> Rewards
                  </NavLink>
                  <NavLink to="/wishlist" className={({isActive}) => `flex items-center px-4 py-2 text-foreground hover:bg-muted transition-colors ${isActive ? 'font-semibold text-primary' : ''}`}>
                    <Heart className="w-5 h-5 mr-3" /> Wishlist
                  </NavLink>
                  <div className="border-t pt-1 mt-1">
                    <NavLink to="/login" className="flex items-center px-4 py-2 text-foreground hover:bg-muted transition-colors font-medium">
                      <User className="w-5 h-5 mr-3" /> Sign In
                    </NavLink>
                  </div>
                </div>
              </div>,
              document.body
            )}
          </div>

          {/* Cart */}
          <div style={{ position: 'relative' }}>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onCartClick} 
              className="relative"
            >
              <ShoppingCart className="w-5 h-5" />
            </Button>
            {cartCount > 0 && createPortal(
              <div 
                className="fixed"
                style={{
                  zIndex: 999999,
                  right: '3.5rem',
                  top: '0.5rem'
                }}
              >
                <Badge 
                  variant="secondary" 
                  className="w-5 h-5 p-0 flex items-center justify-center bg-primary text-primary-foreground text-xs"
                >
                  {cartCount}
                </Badge>
              </div>,
              document.body
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div style={{ position: 'relative', zIndex: 999999 }}>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => isMenuOpen ? closeAll() : openMenu()}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar (below header) */}
      <div className="block md:hidden w-full px-4 py-2 bg-background border-t">
        <form onSubmit={handleSearchSubmit} className="flex items-center relative">
          <Search className="w-5 h-5 text-muted-foreground mr-2" />
          <input
            type="text"
            placeholder="Search for products, brands and more..."
            className="flex-1 bg-transparent border-0 outline-none text-base placeholder:text-muted-foreground"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            ref={mobileSearchInputRef}
          />
          <button className="ml-2 p-1 rounded-full hover:bg-primary/10 transition" aria-label="Camera or QR" type="button" onClick={handleCameraClick}>
            <Camera className="w-5 h-5 text-muted-foreground" />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />
          </button>
          <button className="ml-1 p-1 rounded-full hover:bg-primary/10 transition" aria-label="Voice Search" type="button" onClick={handleVoiceSearch}>
            <Mic className="w-5 h-5 text-muted-foreground" />
          </button>
        </form>
        {/* Mobile Search Dropdown Portal */}
        {showSearchDropdown && isMobile && typeof window !== 'undefined' && createPortal(
          <div 
            className={searchDropdownClass + " w-full"}
            style={{
              zIndex: 999999,
              position: 'fixed',
              top: mobileSearchInputRef.current?.getBoundingClientRect().bottom,
              left: 0,
              maxHeight: `calc(100vh - ${mobileSearchInputRef.current?.getBoundingClientRect().bottom}px)`,
              overflowY: 'auto'
            }}
          >
            {/* Live Suggestions */}
            {searchValue.trim() && suggestions.length > 0 && (
              <div className="mb-3">
                <div className="text-sm font-semibold text-foreground mb-2">Product Suggestions</div>
                <div className="flex flex-col gap-1">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      className="flex items-center px-4 py-3 rounded-lg hover:bg-muted transition-colors text-left"
                      type="button"
                      onMouseDown={() => handleSearchItemClick(s.name)}
                    >
                      <span className="font-medium text-sm">{highlightMatch(s.name, searchValue)}</span>
                      {s.category && (
                        <span className="text-xs text-muted-foreground ml-2">in {highlightMatch(s.category, searchValue)}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Recent Searches */}
            {!searchValue.trim() && recentSearches.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-foreground">Recent Searches</div>
                  <button
                    className="text-xs text-primary hover:text-primary/80 hover:underline bg-transparent"
                    type="button"
                    onMouseDown={clearRecentSearches}
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {recentSearches.map((s, i) => (
                    <button
                      key={i}
                      className="px-4 py-2 rounded-full bg-muted text-sm hover:bg-muted/80 transition-colors"
                      type="button"
                      onMouseDown={() => handleSearchItemClick(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Most Searched */}
            {!searchValue.trim() && (
              <div>
                <div className="text-sm font-semibold text-foreground mb-2">Popular Searches</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {mostSearched.map((s, i) => (
                    <button
                      key={i}
                      className="px-4 py-2 rounded-full bg-muted text-sm hover:bg-muted/80 transition-colors"
                      type="button"
                      onMouseDown={() => handleSearchItemClick(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>,
          document.body
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <nav className="container mx-auto px-4 py-4">
            <ul className="flex flex-col gap-2">
              <li>
                <NavLink to="/" className={navLinkClass} end onClick={closeAll}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/products" className={navLinkClass} onClick={closeAll}>
                  Products
                </NavLink>
              </li>
              <li>
                <NavLink to="/categories" className={navLinkClass} onClick={closeAll}>
                  Categories
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className={navLinkClass} onClick={closeAll}>
                  About
                </NavLink>
              </li>
            </ul>
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
      <nav className="w-full bg-white shadow-sm border-b" style={{ position: 'relative', zIndex: 999990 }}>
        <div className="flex flex-row items-center justify-between px-2 sm:px-4 py-2 sm:py-3 gap-4 sm:gap-8 scrollbar-hide relative overflow-x-auto w-full" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', overflowX: 'auto', minWidth: 0 }}>
          {categories.map((cat, idx) => (
            <div
              key={cat.name}
              className="relative flex flex-col items-center min-w-[80px] cursor-pointer group"
              onMouseEnter={e => {
                if (cat.dropdown) {
                  setOpenDropdown(cat.name);
                  const rect = e.currentTarget.getBoundingClientRect();
                  setDropdownPos({ left: rect.left + rect.width / 2, top: rect.bottom });
                }
              }}
              onMouseLeave={() => cat.dropdown && setOpenDropdown(null)}
              onClick={() => { if (!cat.dropdown) navigate(cat.link); }}
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
                  className="fixed bg-background shadow-xl rounded-lg border py-2 min-w-[140px] animate-fade-in z-[100001]"
                  style={{
                    left: dropdownPos?.left || 0,
                    top: dropdownPos?.top || 0,
                    transform: 'translateX(-50%)',
                    minWidth: 160,
                  }}
                >
                  {cat.dropdown.map(sub => (
                    <a
                      key={typeof sub === 'string' ? sub : sub.name}
                      href={typeof sub === 'string' ? cat.link + '&sub=' + encodeURIComponent(sub) : sub.link}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary whitespace-nowrap"
                    >
                      {typeof sub === 'string' ? sub : sub.name}
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