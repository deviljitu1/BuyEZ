import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Gift, Crown, Star, Zap, Trophy, Diamond, Coins, ShoppingBag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Rewards = () => {
  const { toast } = useToast();
  const [userPoints] = useState(2450);
  
  const rewardTiers = [
    {
      name: 'Bronze',
      icon: Coins,
      minPoints: 0,
      maxPoints: 999,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      benefits: ['Free shipping on orders over $50', '5% birthday discount']
    },
    {
      name: 'Silver',
      icon: Star,
      minPoints: 1000,
      maxPoints: 2499,
      color: 'text-slate-600',
      bgColor: 'bg-slate-50',
      benefits: ['Free shipping on all orders', '10% birthday discount', 'Early access to sales']
    },
    {
      name: 'Gold',
      icon: Crown,
      minPoints: 2500,
      maxPoints: 4999,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      benefits: ['Free shipping + returns', '15% birthday discount', 'Priority support', 'Exclusive products']
    },
    {
      name: 'Platinum',
      icon: Diamond,
      minPoints: 5000,
      maxPoints: Infinity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      benefits: ['All Gold benefits', '20% birthday discount', 'Personal stylist', 'VIP events']
    }
  ];

  const availableRewards = [
    {
      id: 1,
      name: '$10 Off Next Purchase',
      points: 500,
      icon: ShoppingBag,
      description: 'Get $10 off your next order of $50 or more'
    },
    {
      id: 2,
      name: 'Free Premium Shipping',
      points: 200,
      icon: Zap,
      description: 'Free expedited shipping on your next order'
    },
    {
      id: 3,
      name: '$25 Off Next Purchase',
      points: 1200,
      icon: Gift,
      description: 'Get $25 off your next order of $100 or more'
    },
    {
      id: 4,
      name: 'Exclusive Product Access',
      points: 800,
      icon: Trophy,
      description: 'Early access to limited edition products'
    }
  ];

  const getCurrentTier = () => {
    return rewardTiers.find(tier => userPoints >= tier.minPoints && userPoints <= tier.maxPoints) || rewardTiers[0];
  };

  const getNextTier = () => {
    const currentTier = getCurrentTier();
    const currentIndex = rewardTiers.findIndex(tier => tier.name === currentTier.name);
    return currentIndex < rewardTiers.length - 1 ? rewardTiers[currentIndex + 1] : null;
  };

  const getProgressToNextTier = () => {
    const nextTier = getNextTier();
    if (!nextTier) return 100;
    
    const currentTier = getCurrentTier();
    const progress = ((userPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100;
    return Math.min(progress, 100);
  };

  const handleRedeemReward = (reward: typeof availableRewards[0]) => {
    if (userPoints >= reward.points) {
      toast({
        title: "Reward Redeemed!",
        description: `You've successfully redeemed ${reward.name}`,
      });
    } else {
      toast({
        title: "Insufficient Points",
        description: `You need ${reward.points - userPoints} more points to redeem this reward`,
        variant: "destructive"
      });
    }
  };

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();
  const progress = getProgressToNextTier();

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-2">Rewards Program</h1>
          <p className="text-muted-foreground text-lg">Earn points with every purchase and unlock amazing benefits</p>
        </div>

        {/* Points Overview */}
        <Card className="mb-8 animate-scale-in">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Coins className="h-6 w-6 text-primary" />
              {userPoints.toLocaleString()} Points
            </CardTitle>
            <CardDescription>Your current reward points balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <currentTier.icon className={`h-5 w-5 ${currentTier.color}`} />
                <span className="font-semibold">{currentTier.name} Member</span>
              </div>
              {nextTier && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-sm">Next: {nextTier.name}</span>
                  <nextTier.icon className="h-4 w-4" />
                </div>
              )}
            </div>
            
            {nextTier && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>{userPoints} points</span>
                  <span>{nextTier.minPoints} points needed</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  {nextTier.minPoints - userPoints} points until {nextTier.name} tier
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reward Tiers */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Membership Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rewardTiers.map((tier, index) => {
              const isCurrentTier = tier.name === currentTier.name;
              const IconComponent = tier.icon;
              
              return (
                <Card 
                  key={tier.name} 
                  className={`relative transition-all duration-300 animate-fade-in ${
                    isCurrentTier ? 'ring-2 ring-primary shadow-lg transform scale-105' : 'hover:shadow-md'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {isCurrentTier && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                      Current Tier
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <div className={`mx-auto w-12 h-12 rounded-full ${tier.bgColor} flex items-center justify-center mb-2`}>
                      <IconComponent className={`h-6 w-6 ${tier.color}`} />
                    </div>
                    <CardTitle className="text-lg">{tier.name}</CardTitle>
                    <CardDescription>
                      {tier.maxPoints === Infinity 
                        ? `${tier.minPoints.toLocaleString()}+ points`
                        : `${tier.minPoints.toLocaleString()} - ${tier.maxPoints.toLocaleString()} points`
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tier.benefits.map((benefit, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <Star className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Available Rewards */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-center">Redeem Rewards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {availableRewards.map((reward, index) => {
              const canRedeem = userPoints >= reward.points;
              const IconComponent = reward.icon;
              
              return (
                <Card 
                  key={reward.id} 
                  className={`transition-all duration-300 animate-slide-up ${
                    canRedeem ? 'hover:shadow-lg cursor-pointer' : 'opacity-60'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{reward.name}</CardTitle>
                    <CardDescription className="text-center">
                      {reward.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-primary">{reward.points}</span>
                      <span className="text-muted-foreground ml-1">points</span>
                    </div>
                    <Button
                      onClick={() => handleRedeemReward(reward)}
                      disabled={!canRedeem}
                      className="w-full"
                      variant={canRedeem ? "default" : "outline"}
                    >
                      {canRedeem ? 'Redeem' : `Need ${reward.points - userPoints} more`}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* How to Earn Points */}
        <Card className="mt-8 animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">How to Earn Points</CardTitle>
            <CardDescription>Multiple ways to boost your rewards balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <ShoppingBag className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Make Purchases</h3>
                <p className="text-sm text-muted-foreground">Earn 1 point for every $1 spent</p>
              </div>
              <div>
                <Star className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Write Reviews</h3>
                <p className="text-sm text-muted-foreground">Get 50 points for each product review</p>
              </div>
              <div>
                <Gift className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Refer Friends</h3>
                <p className="text-sm text-muted-foreground">Earn 200 points for successful referrals</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Rewards;