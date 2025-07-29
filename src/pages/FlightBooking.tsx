import { useState } from 'react';
import { Plane, ArrowRightLeft, Calendar, User, Minus, Plus, Search, MapPin, Ticket, ShieldCheck, LifeBuoy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data for popular destinations
const popularDestinations = [
  {
    city: 'Goa',
    country: 'India',
    image: 'https://images.unsplash.com/photo-1590372793661-39233658393a?w=400&h=500&fit=crop',
    price: 4599,
  },
  {
    city: 'Dubai',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=400&h=500&fit=crop',
    price: 11999,
  },
  {
    city: 'Bangkok',
    country: 'Thailand',
    image: 'https://images.unsplash.com/photo-1571892629221-ef39382e49a8?w=400&h=500&fit=crop',
    price: 9899,
  },
  {
    city: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1502602898455-34b3e9a1a84d?w=400&h=500&fit=crop',
    price: 45500,
  },
];

// Mock data for flight results
const mockFlights = [
    { id: '1', airline: 'IndiGo', logo: '✈️', from: 'BOM', to: 'DEL', departureTime: '08:30', arrivalTime: '10:45', duration: '2h 15m', stops: 'Non-stop', price: 5899 },
    { id: '2', airline: 'Vistara', logo: '✈️', from: 'BOM', to: 'DEL', departureTime: '10:00', arrivalTime: '12:10', duration: '2h 10m', stops: 'Non-stop', price: 6250 },
    { id: '3', airline: 'Air India', logo: '✈️', from: 'BOM', to: 'DEL', departureTime: '11:45', arrivalTime: '14:00', duration: '2h 15m', stops: 'Non-stop', price: 6100 },
];

export default function FlightBookings() {
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way');
  const [from, setFrom] = useState('Mumbai (BOM)');
  const [to, setTo] = useState('Delhi (DEL)');
  const [departureDate, setDepartureDate] = useState<Date | undefined>(new Date());
  const [returnDate, setReturnDate] = useState<Date | undefined>();
  const [passengers, setPassengers] = useState({ adults: 1, children: 0 });
  const [cabinClass, setCabinClass] = useState('economy');
  const [searchedFlights, setSearchedFlights] = useState<typeof mockFlights>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleSearch = () => {
    setIsSearching(true);
    setSearchedFlights([]);
    // Simulate API call
    setTimeout(() => {
        setSearchedFlights(mockFlights);
        setIsSearching(false);
    }, 1500);
  };
  
  const totalPassengers = passengers.adults + passengers.children;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[500px] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1530521954074-e64f6810b32d?fit=crop&w=1920&h=1080&q=80')" }}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Book Domestic & International Flights</h1>
          <p className="text-lg text-white/90 mb-8">Unbeatable prices and a seamless booking experience.</p>
          
          {/* Flight Search Card */}
          <Card className="w-full max-w-4xl shadow-2xl">
            <CardContent className="p-4 md:p-6">
              {/* Trip Type Tabs */}
              <div className="flex border-b mb-4">
                <Button variant={tripType === 'one-way' ? 'default' : 'ghost'} onClick={() => setTripType('one-way')} className="rounded-none">One Way</Button>
                <Button variant={tripType === 'round-trip' ? 'default' : 'ghost'} onClick={() => setTripType('round-trip')} className="rounded-none">Round Trip</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                {/* From & To */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-2">
                  <div className="relative">
                    <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="From" value={from} onChange={(e) => setFrom(e.target.value)} className="pl-10"/>
                  </div>
                  <Button variant="outline" size="icon" onClick={handleSwap} className="mx-auto">
                    <ArrowRightLeft className="h-4 w-4" />
                  </Button>
                  <div className="relative">
                     <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="To" value={to} onChange={(e) => setTo(e.target.value)} className="pl-10"/>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="text" value={departureDate?.toLocaleDateString()} onFocus={(e) => e.target.type = 'date'} onBlur={(e) => e.target.type = 'text'} className="pl-10" />
                  </div>
                  <div className="relative">
                     <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="text" placeholder="Return" disabled={tripType === 'one-way'} onFocus={(e) => e.target.type = 'date'} onBlur={(e) => e.target.type = 'text'} className="pl-10"/>
                  </div>
                </div>
                
                {/* Passengers & Class */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <User className="mr-2 h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium">{totalPassengers} Passenger{totalPassengers > 1 ? 's' : ''}</p>
                        <p className="text-xs text-muted-foreground capitalize">{cabinClass}</p>
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                          <span className="font-medium">Adults</span>
                          <div className="flex items-center gap-2">
                              <Button size="icon" variant="outline" onClick={() => setPassengers(p => ({...p, adults: Math.max(1, p.adults - 1)}))}><Minus className="h-4 w-4"/></Button>
                              <span>{passengers.adults}</span>
                              <Button size="icon" variant="outline" onClick={() => setPassengers(p => ({...p, adults: p.adults + 1}))}><Plus className="h-4 w-4"/></Button>
                          </div>
                      </div>
                      <div className="flex items-center justify-between">
                          <span className="font-medium">Children</span>
                          <div className="flex items-center gap-2">
                              <Button size="icon" variant="outline" onClick={() => setPassengers(p => ({...p, children: Math.max(0, p.children - 1)}))}><Minus className="h-4 w-4"/></Button>
                              <span>{passengers.children}</span>
                              <Button size="icon" variant="outline" onClick={() => setPassengers(p => ({...p, children: p.children + 1}))}><Plus className="h-4 w-4"/></Button>
                          </div>
                      </div>
                      <Select value={cabinClass} onValueChange={setCabinClass}>
                        <SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="economy">Economy</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="first">First</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Search Button */}
                <Button onClick={handleSearch} disabled={isSearching} className="w-full h-full md:col-span-1">
                  <Search className="h-4 w-4 mr-2" /> {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Flight Results Section */}
        {isSearching && <div className="text-center font-medium">Finding the best flights for you...</div>}
        {searchedFlights.length > 0 && (
            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-center">Available Flights from {from.split(' ')[0]} to {to.split(' ')[0]}</h2>
                <div className="space-y-4">
                    {searchedFlights.map(flight => (
                        <Card key={flight.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4 grid grid-cols-2 md:grid-cols-6 items-center gap-4">
                                <div className="font-bold text-lg md:col-span-1">{flight.logo} {flight.airline}</div>
                                <div className="text-center md:col-span-1">
                                    <p className="font-semibold text-lg">{flight.departureTime}</p>
                                    <p className="text-sm text-muted-foreground">{flight.from}</p>
                                </div>
                                <div className="text-center text-muted-foreground text-sm md:col-span-1">{flight.duration}</div>
                                <div className="text-center md:col-span-1">
                                    <p className="font-semibold text-lg">{flight.arrivalTime}</p>
                                    <p className="text-sm text-muted-foreground">{flight.to}</p>
                                </div>
                                <div className="text-center font-semibold text-xl text-primary md:col-span-1">₹{flight.price.toLocaleString()}</div>
                                <Button className="w-full md:col-span-1">Book Now</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )}

        {/* Popular Destinations Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">Explore Popular Destinations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularDestinations.map((dest) => (
              <Card key={dest.city} className="overflow-hidden group cursor-pointer">
                <div className="relative">
                  <img src={dest.image} alt={dest.city} className="w-full h-full object-cover aspect-[3/4] group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="font-semibold text-lg">{dest.city}</h3>
                    <p className="text-sm">{dest.country}</p>
                  </div>
                   <Badge className="absolute top-2 right-2">from ₹{dest.price.toLocaleString()}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Why Book With Us Section */}
        <Card className="mt-12">
            <CardHeader><CardTitle className="text-center">Why Book With Us?</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center">
                    <Ticket className="h-10 w-10 mb-2 text-primary"/>
                    <h3 className="font-semibold mb-1">Best Price Guarantee</h3>
                    <p className="text-muted-foreground text-sm">We offer competitive prices on millions of flights.</p>
                </div>
                 <div className="flex flex-col items-center">
                    <ShieldCheck className="h-10 w-10 mb-2 text-primary"/>
                    <h3 className="font-semibold mb-1">Secure & Trusted</h3>
                    <p className="text-muted-foreground text-sm">Your bookings are protected with secure payments.</p>
                </div>
                 <div className="flex flex-col items-center">
                    <LifeBuoy className="h-10 w-10 mb-2 text-primary"/>
                    <h3 className="font-semibold mb-1">24/7 Support</h3>
                    <p className="text-muted-foreground text-sm">Get assistance anytime, anywhere with our support team.</p>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}