import { useEffect, useState, useRef } from 'react';
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

  const progressRef = useRef<HTMLDivElement[]>([]);
  const slideInterval = 4000; // ms, adjust if your auto-slide interval is different

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
    <section className="relative w-full h-[340px] xs:h-[400px] sm:h-[480px] md:h-[520px] lg:h-[560px] xl:h-[600px] 2xl:h-[680px] mb-4 sm:mb-10">
      {/* Carousel: background and overlay together */}
      <div ref={sliderRef} className="keen-slider absolute inset-0 w-full h-full z-0">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className="keen-slider__slide w-full h-full bg-cover bg-center bg-no-repeat flex items-center justify-center h-full rounded-xl"
            style={{ backgroundImage: `url(${slide.background})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary-glow/20 rounded-xl" />
            {/* Overlay Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white bg-gradient-to-t from-black/60 to-transparent p-4 md:p-8">
              <div className="max-w-2xl flex flex-col items-center">
                <div className="inline-flex items-center space-x-2 bg-accent/80 backdrop-blur-sm rounded-full px-2 py-1 mb-2 sm:px-4 sm:py-2 sm:mb-4">
                  <Star className="w-4 h-4 text-primary fill-current" />
                  <span className="text-[10px] xs:text-xs sm:text-sm font-medium text-accent-foreground">
                    Trusted by 50K+ customers
                  </span>
                </div>
                <h2 className="text-2xl sm:mb-2 sm:text-[clamp(2rem,6vw,3.5rem)] font-bold tracking-tight shadow-lg leading-tight mb-1 sm:mb-2">
                  {slide.heading}
                </h2>
                <p className="text-xs sm:text-[clamp(0.95rem,2.5vw,1.25rem)] text-white mb-2 sm:mb-6 max-w-md sm:max-w-xl mx-auto leading-relaxed drop-shadow-md break-words whitespace-pre-line px-2 sm:px-0">
                  {slide.subheading}
                </p>
                <div className="mt-6 flex flex-row items-center justify-center gap-2 w-full max-w-xs sm:max-w-none mx-auto">
                  <Button size="sm" className="min-w-[100px] px-2 py-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transform transition-transform hover:scale-105 text-xs sm:text-lg">
                    {slide.button1.text} <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                  <Button size="sm" variant="secondary" className="min-w-[100px] px-2 py-1 bg-white/90 hover:bg-white text-secondary-foreground shadow-lg transform transition-transform hover:scale-105 text-xs sm:text-lg">
                    {slide.button2.text}
                  </Button>
                </div>
              </div>
              {/* Animated Progress Pills */}
              <div className="absolute bottom-[3px] left-0 right-0 flex justify-center">
                <div className="flex gap-2">
                  {slides.map((_, idx) => (
                    <span
                      key={idx}
                      className="relative h-1.5 w-8 rounded-full bg-muted overflow-hidden"
                    >
                      <div
                        ref={el => progressRef.current[idx] = el!}
                        className={`absolute left-0 top-0 h-full rounded-full transition-all duration-0 ${currentSlide === idx ? 'bg-black' : 'bg-transparent'}`}
                        style={currentSlide === idx ? { width: '100%', transition: `width ${slideInterval}ms linear` } : { width: 0, transition: 'none' }}
                      />
                    </span>
                  ))}
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

      {/* Dots Navigation moved below Products stat */}

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full animate-pulse" />
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-primary-glow/10 rounded-full animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-5 w-12 h-12 bg-accent/20 rounded-full animate-pulse delay-500" />
    </section>
  );
};