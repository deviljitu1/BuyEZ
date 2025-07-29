import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, User, Briefcase, Utensils, CreditCard, Landmark, Wallet, CheckCircle, Plane, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

const steps = ["Flight Review", "Traveller Details", "Add-ons", "Payment"];

export default function FlightCheckout() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { flight } = location.state || {}; // Get flight data from navigation state

  // If no flight data, redirect back
  if (!flight) {
    // In a real app, you might want to show an error or redirect to the search page
    return (
        <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong.</h1>
            <p className="text-muted-foreground mb-6">No flight details were found. Please start a new search.</p>
            <Button onClick={() => navigate('/flight-booking')}>Back to Flight Search</Button>
        </div>
    );
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return <FlightReview flight={flight} />;
      case 1: return <TravellerDetails />;
      case 2: return <Addons />;
      case 3: return <Payment />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Stepper */}
        <div className="mb-8">
          <ol className="flex items-center w-full">
            {steps.map((step, index) => (
              <li key={step} className={`flex w-full items-center ${index < steps.length - 1 ? "after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:inline-block" : ""}`}>
                <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${index <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-gray-100'}`}>
                  {index < currentStep ? <CheckCircle className="w-5 h-5" /> : <span className="font-medium">{index + 1}</span>}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {currentStep === 0 && <Plane />}
                  {currentStep === 1 && <User />}
                  {currentStep === 2 && <Briefcase />}
                  {currentStep === 3 && <CreditCard />}
                  {steps[currentStep]}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderStepContent()}
              </CardContent>
            </Card>
          </div>

          {/* Fare Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader><CardTitle>Fare Summary</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between"><span>Base Fare</span> <span>₹{flight.price.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Taxes & Fees</span> <span>₹1,200</span></div>
                <div className="flex justify-between"><span>Add-ons</span> <span>₹0</span></div>
                <Separator />
                <div className="flex justify-between font-bold text-lg"><span>Total Amount</span> <span>₹{(flight.price + 1200).toLocaleString()}</span></div>
                
                <div className="flex gap-2 mt-6">
                  {currentStep > 0 && <Button variant="outline" onClick={prevStep} className="w-full">Back</Button>}
                  <Button onClick={nextStep} className="w-full">
                    {currentStep === steps.length - 1 ? 'Confirm & Pay' : 'Continue'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step Components
const FlightReview = ({ flight }: { flight: any }) => (
  <div>
    <h3 className="font-semibold text-lg mb-2">{flight.from.split(' ')[0]} to {flight.to.split(' ')[0]}</h3>
    <div className="flex items-center gap-4 p-4 border rounded-lg">
        <div className="font-bold text-lg">{flight.logo} {flight.airline}</div>
        <div className="text-center">
            <p className="font-semibold text-lg">{flight.departureTime}</p>
            <p className="text-sm text-muted-foreground">{flight.from}</p>
        </div>
        <div className="text-center text-muted-foreground text-sm">{flight.duration}</div>
        <div className="text-center">
            <p className="font-semibold text-lg">{flight.arrivalTime}</p>
            <p className="text-sm text-muted-foreground">{flight.to}</p>
        </div>
    </div>
    <div className="mt-4 text-sm text-muted-foreground">
        <p><strong>Baggage:</strong> 15kg Check-in, 7kg Cabin</p>
        <p><strong>Cancellation:</strong> Fees apply. Check policy before booking.</p>
    </div>
  </div>
);

const TravellerDetails = () => (
  <div className="space-y-6">
    <h3 className="font-semibold text-lg border-b pb-2">Adult 1</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2"><Label htmlFor="firstName">First Name</Label><Input id="firstName" placeholder="John" /></div>
      <div className="space-y-2"><Label htmlFor="lastName">Last Name</Label><Input id="lastName" placeholder="Doe" /></div>
    </div>
    <div className="space-y-2">
        <Label>Gender</Label>
        <RadioGroup defaultValue="male" className="flex gap-4">
            <div className="flex items-center space-x-2"><RadioGroupItem value="male" id="male" /><Label htmlFor="male">Male</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="female" id="female" /><Label htmlFor="female">Female</Label></div>
        </RadioGroup>
    </div>
    <Separator />
    <h3 className="font-semibold text-lg border-b pb-2">Contact Information</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="john.doe@example.com" /></div>
        <div className="space-y-2"><Label htmlFor="phone">Phone Number</Label><Input id="phone" type="tel" placeholder="+91 98765 43210" /></div>
    </div>
  </div>
);

const Addons = () => (
  <div className="space-y-6">
    <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Utensils className="h-5 w-5"/> Meals</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-md">
                <div><p>Veg Meal</p><p className="text-sm text-primary font-semibold">₹350</p></div>
                <Checkbox id="veg-meal" />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md">
                <div><p>Non-Veg Meal</p><p className="text-sm text-primary font-semibold">₹450</p></div>
                <Checkbox id="non-veg-meal" />
            </div>
        </CardContent>
    </Card>
    <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5"/> Extra Baggage</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-md">
                <div><p>+5 kg</p><p className="text-sm text-primary font-semibold">₹1,500</p></div>
                <Checkbox id="bag-5kg" />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md">
                <div><p>+10 kg</p><p className="text-sm text-primary font-semibold">₹2,800</p></div>
                <Checkbox id="bag-10kg" />
            </div>
        </CardContent>
    </Card>
  </div>
);

const Payment = () => (
  <RadioGroup defaultValue="card">
    <div className="space-y-4">
        <Label className="flex items-center gap-3 p-4 border rounded-lg has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
            <RadioGroupItem value="card" id="card" />
            <CreditCard className="h-6 w-6"/>
            <span className="font-semibold">Credit/Debit Card</span>
        </Label>
        <Label className="flex items-center gap-3 p-4 border rounded-lg has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
            <Wallet className="h-6 w-6"/>
            <span className="font-semibold">UPI</span>
        </Label>
        <Label className="flex items-center gap-3 p-4 border rounded-lg has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
            <Landmark className="h-6 w-6"/>
            <span className="font-semibold">Net Banking</span>
        </Label>
    </div>
  </RadioGroup>
);
