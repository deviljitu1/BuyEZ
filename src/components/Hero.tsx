import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import heroBackground from '@/assets/hero-background.png';
import onlineShopping from '@/assets/hero-background1.png';
import shopping from '@/assets/hero-background3.png';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';

const slides = [
  {
    background: heroBackground,
    heading: 'Shop Premium Tech Made Simple',
    subheading: 'Discover the latest in technology with our curated collection of premium devices. Fast shipping, easy returns, and unbeatable prices.',
    button1: { text: 'Shop Now', link: '/products' },
    button2: { text: 'View Categories', link: '/categories' },
  },
  {
    background: onlineShopping,
    heading: 'Online Shopping Made Fun',
    subheading: 'Enjoy a seamless online shopping experience with exclusive deals and fast delivery.',
    button1: { text: 'Start Shopping', link: '/products' },
    button2: { text: 'See Offers', link: '/products' },
  },
  {
    background: shopping,
    heading: 'Everything You Need, Delivered',
    subheading: 'From gadgets to groceries, get everything delivered to your doorstep with ease.',
    button1: { text: 'Browse Categories', link: '/categories' },
    button2: { text: 'Learn More', link: '/about' },
  },
];

export const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 1 },
    renderMode: 'performance',
    drag: true,
    created: (s) => {
      s.moveToIdx(0, true);
    },
    slideChanged: (s) => {
      setCurrentSlide(s.track.details.rel);
    },
    breakpoints: {
      '(min-width: 768px)': { slides: { perView: 1 } },
    },
  });

  // Autoplay effect
  useEffect(() => {
    if (!instanceRef.current) return;
    let timeout: NodeJS.Timeout;
    let mouseOver = false;
    const slider = instanceRef.current;
    function next() {
      if (mouseOver) return;
      slider.next();
      timeout = setTimeout(next, 3500);
    }
    slider.container.addEventListener('mouseover', () => { mouseOver = true; clearTimeout(timeout); });
    slider.container.addEventListener('mouseout', () => { mouseOver = false; timeout = setTimeout(next, 3500); });
    timeout = setTimeout(next, 3500);
    return () => {
      clearTimeout(timeout);
      slider.container.removeEventListener('mouseover', () => { mouseOver = true; });
      slider.container.removeEventListener('mouseout', () => { mouseOver = false; });
    };
  }, [instanceRef]);

  // Arrow navigation handlers
  const goToPrev = () => instanceRef.current?.prev();
  const goToNext = () => instanceRef.current?.next();

  return (
    <section className="relative h-[100vh] flex items-center justify-center overflow-hidden m-0 p-0">
      {/* Carousel: background and overlay together */}
      <div ref={sliderRef} className="keen-slider absolute inset-0 w-full h-full z-0">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className="keen-slider__slide w-full h-full bg-cover bg-center bg-no-repeat flex items-center justify-center h-full"
            style={{ backgroundImage: `url(${slide.background})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary-glow/20" />
            {/* Overlay Content */}
            <div className="relative z-10 container mx-auto px-1 sm:px-4 text-center flex flex-col items-center justify-center h-full">
              <div className="max-w-4xl mx-auto animate-fade-in w-full">
                {/* Badge */}
                <div className="inline-flex items-center space-x-2 bg-accent/80 backdrop-blur-sm rounded-full px-2 py-1 mb-3 sm:px-4 sm:py-2 sm:mb-6">
                  <Star className="w-4 h-4 text-primary fill-current" />
                  <span className="text-[10px] xs:text-xs sm:text-sm font-medium text-accent-foreground">
                    Trusted by 50K+ customers
                  </span>
                </div>
                <h1 className="text-xl xs:text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-3 sm:mb-6 text-white drop-shadow-lg leading-tight">
                  {slide.heading}
                </h1>
                <p className="text-sm xs:text-base sm:text-xl text-white mb-5 sm:mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                  {slide.subheading}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <a href={slide.button1.link}>
                    <Button 
                      size="lg" 
                      className="bg-primary hover:bg-primary-glow text-primary-foreground px-4 sm:px-8 py-2 sm:py-4 text-sm sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      {slide.button1.text}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </a>
                  <a href={slide.button2.link}>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="px-4 sm:px-8 py-2 sm:py-4 text-sm sm:text-lg font-semibold bg-background/80 backdrop-blur-sm border-2 hover:bg-background transition-all duration-300"
                    >
                      {slide.button2.text}
                    </Button>
                  </a>
                </div>
                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 sm:gap-8 max-w-md mx-auto mt-4 sm:mt-8 pt-4 sm:pt-8 border-t border-border/50">
                  <div className="text-center">
                    <div className="text-base sm:text-2xl font-bold text-white drop-shadow">50K+</div>
                    <div className="text-[10px] sm:text-sm text-white/80">Happy Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-base sm:text-2xl font-bold text-white drop-shadow">1000+</div>
                    <div className="text-[10px] sm:text-sm text-white/80">Products</div>
                  </div>
                  <div className="text-center">
                    <div className="text-base sm:text-2xl font-bold text-white drop-shadow">4.9★</div>
                    <div className="text-[10px] sm:text-sm text-white/80">Rating</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Left Arrow */}
            <button
              className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-3 sm:p-3 z-20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/70"
              style={{ backdropFilter: 'blur(2px)' }}
              onClick={goToPrev}
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8" />
            </button>
            {/* Right Arrow */}
            <button
              className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-3 sm:p-3 z-20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/70"
              style={{ backdropFilter: 'blur(2px)' }}
              onClick={goToNext}
              aria-label="Next slide"
            >
              <ChevronRight className="w-7 h-7 sm:w-8 sm:h-8" />
            </button>
          </div>
        ))}
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center mt-4 sm:mt-6 gap-3 absolute left-1/2 -translate-x-1/2 bottom-6 sm:bottom-12 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`w-4 h-4 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${currentSlide === idx ? 'bg-primary' : 'bg-white/60'}`}
            onClick={() => instanceRef.current?.moveToIdx(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            style={{ outline: 'none', border: 'none' }}
          />
        ))}
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full animate-pulse" />
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-primary-glow/10 rounded-full animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-5 w-12 h-12 bg-accent/20 rounded-full animate-pulse delay-500" />
    </section>
  );
};