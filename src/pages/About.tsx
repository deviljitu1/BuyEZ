import { Info, ShoppingCart, Star, Layers } from 'lucide-react';

const About = () => (
  <div className="min-h-screen bg-gradient-to-br from-primary/10 to-background flex flex-col items-center justify-start py-12 px-4">
    {/* Hero Section */}
    <div className="bg-white/80 dark:bg-background/80 rounded-2xl shadow-xl p-8 max-w-2xl w-full text-center mb-10 border border-primary/20">
      <div className="flex flex-col items-center gap-4">
        <div className="bg-primary/90 rounded-full p-4 mb-2 shadow-lg">
          <Info size={40} color="#fff" />
        </div>
        <h1 className="text-4xl font-extrabold text-primary mb-2 tracking-tight">About ShopEZ</h1>
        <p className="mb-2 text-lg text-muted-foreground max-w-xl">
          ShopEZ is a modern, demo e-commerce platform built with React, Vite, and Tailwind CSS. Browse products, add them to your cart, and enjoy a seamless shopping experience.
        </p>
      </div>
    </div>

    {/* Features Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl w-full mb-10">
      <div className="flex flex-col items-center bg-card/80 rounded-xl p-6 shadow-md border border-border">
        <ShoppingCart size={32} className="text-primary mb-2" />
        <h2 className="text-xl font-semibold mb-1">Seamless Shopping</h2>
        <p className="text-muted-foreground text-center">Add products to your cart, manage quantities, and checkout with a simple, simulated process.</p>
      </div>
      <div className="flex flex-col items-center bg-card/80 rounded-xl p-6 shadow-md border border-border">
        <Layers size={32} className="text-primary mb-2" />
        <h2 className="text-xl font-semibold mb-1">Browse by Category</h2>
        <p className="text-muted-foreground text-center">Explore a curated selection of electronics by product or category for easy discovery.</p>
      </div>
      <div className="flex flex-col items-center bg-card/80 rounded-xl p-6 shadow-md border border-border">
        <Star size={32} className="text-primary mb-2" />
        <h2 className="text-xl font-semibold mb-1">Modern UI/UX</h2>
        <p className="text-muted-foreground text-center">Enjoy a beautiful, responsive interface built with the latest frontend technologies.</p>
      </div>
      <div className="flex flex-col items-center bg-card/80 rounded-xl p-6 shadow-md border border-border">
        <Info size={32} className="text-primary mb-2" />
        <h2 className="text-xl font-semibold mb-1">Demo Project</h2>
        <p className="text-muted-foreground text-center">This project is for demonstration purposes only. No real purchases are made.</p>
      </div>
    </div>

    {/* Footer Note */}
    <div className="text-center text-muted-foreground text-sm max-w-xl">
      &copy; {new Date().getFullYear()} ShopEZ. Built for learning and demo purposes.
    </div>
  </div>
);

export default About; 