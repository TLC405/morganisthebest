import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  DollarSign, 
  Target,
  Brain,
  Sparkles,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Globe,
  Eye,
  RefreshCw
} from 'lucide-react';

// Mock competitor data
const competitors = [
  { 
    name: 'Pre-Dating OKC', 
    events: 12, 
    avgAttendance: 25, 
    priceRange: '$30-45',
    trend: 'up',
    marketShare: 35,
    rating: 4.2
  },
  { 
    name: 'Eventbrite Singles', 
    events: 8, 
    avgAttendance: 40, 
    priceRange: '$15-35',
    trend: 'stable',
    marketShare: 25,
    rating: 3.8
  },
  { 
    name: 'Meetup Singles OKC', 
    events: 20, 
    avgAttendance: 18, 
    priceRange: 'Free-$20',
    trend: 'down',
    marketShare: 20,
    rating: 3.5
  },
  { 
    name: 'Speed OKC Dating', 
    events: 4, 
    avgAttendance: 30, 
    priceRange: '$35-55',
    trend: 'up',
    marketShare: 15,
    rating: 4.5
  },
];

const eventTypeData = [
  { type: 'Speed Dating', popularity: 85, growth: 12 },
  { type: 'Mixers', popularity: 72, growth: 8 },
  { type: 'Activity-Based', popularity: 68, growth: 22 },
  { type: 'Wine/Dining', popularity: 55, growth: 5 },
  { type: 'Sports/Active', popularity: 48, growth: 18 },
];

const weeklyOptimal = [
  { day: 'Monday', score: 25, reason: 'Low turnout' },
  { day: 'Tuesday', score: 35, reason: 'Moderate interest' },
  { day: 'Wednesday', score: 45, reason: 'Wine Wednesday potential' },
  { day: 'Thursday', score: 72, reason: 'Pre-weekend energy' },
  { day: 'Friday', score: 88, reason: 'Peak dating night' },
  { day: 'Saturday', score: 95, reason: 'Highest demand' },
  { day: 'Sunday', score: 60, reason: 'Brunch events work' },
];

const MarketIntel = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('2 hours ago');

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsAnalyzing(false);
    setLastUpdated('Just now');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Brain className="h-8 w-8 text-secondary" />
              Market Intelligence
            </h1>
            <p className="text-muted-foreground mt-1">
              AI-powered competitor analysis and market insights
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              Updated {lastUpdated}
            </span>
            <Button 
              onClick={runAnalysis} 
              disabled={isAnalyzing}
              className="gap-2"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Run AI Analysis
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card variant="elevated">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Your Market Share</p>
                  <p className="text-3xl font-bold text-foreground">5%</p>
                  <p className="text-xs text-secondary flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" /> Growing
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <PieChart className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Competitors</p>
                  <p className="text-3xl font-bold text-foreground">8</p>
                  <p className="text-xs text-muted-foreground mt-1">In OKC Metro</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Event Price</p>
                  <p className="text-3xl font-bold text-foreground">$32</p>
                  <p className="text-xs text-muted-foreground mt-1">Market average</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Events</p>
                  <p className="text-3xl font-bold text-foreground">44</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Activity className="h-3 w-3" /> Active market
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="competitors" className="space-y-6">
          <TabsList>
            <TabsTrigger value="competitors">Competitors</TabsTrigger>
            <TabsTrigger value="trends">Event Trends</TabsTrigger>
            <TabsTrigger value="timing">Optimal Timing</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          </TabsList>

          {/* Competitors Tab */}
          <TabsContent value="competitors" className="space-y-4">
            <div className="grid gap-4">
              {competitors.map((competitor) => (
                <Card key={competitor.name} variant="elevated">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                          <Globe className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{competitor.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {competitor.events} events/month • {competitor.avgAttendance} avg attendance
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Price Range</p>
                          <p className="font-medium text-foreground">{competitor.priceRange}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Market Share</p>
                          <p className="font-medium text-foreground">{competitor.marketShare}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Rating</p>
                          <p className="font-medium text-foreground">⭐ {competitor.rating}</p>
                        </div>
                        <Badge 
                          variant={competitor.trend === 'up' ? 'default' : competitor.trend === 'down' ? 'destructive' : 'secondary'}
                          className="gap-1"
                        >
                          {competitor.trend === 'up' && <TrendingUp className="h-3 w-3" />}
                          {competitor.trend === 'down' && <TrendingDown className="h-3 w-3" />}
                          {competitor.trend.charAt(0).toUpperCase() + competitor.trend.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Market Share</span>
                        <span className="text-foreground">{competitor.marketShare}%</span>
                      </div>
                      <Progress value={competitor.marketShare} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Event Trends Tab */}
          <TabsContent value="trends" className="space-y-4">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-secondary" />
                  Event Type Popularity
                </CardTitle>
                <CardDescription>Based on attendance and engagement data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {eventTypeData.map((item) => (
                  <div key={item.type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{item.type}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${item.growth > 10 ? 'text-green-400' : 'text-muted-foreground'}`}>
                          {item.growth > 0 ? '+' : ''}{item.growth}% growth
                        </span>
                        <span className="text-foreground font-bold">{item.popularity}%</span>
                      </div>
                    </div>
                    <Progress value={item.popularity} className="h-3" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  Trending This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
                    Activity-Based Events +22%
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
                    Sports/Active +18%
                  </Badge>
                  <Badge className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30">
                    Speed Dating +12%
                  </Badge>
                  <Badge className="bg-orange-500/20 text-orange-400 hover:bg-orange-500/30">
                    Themed Mixers +10%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Optimal Timing Tab */}
          <TabsContent value="timing" className="space-y-4">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Best Days to Host Events
                </CardTitle>
                <CardDescription>AI-analyzed based on historical attendance patterns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {weeklyOptimal.map((day) => (
                  <div key={day.day} className="flex items-center gap-4">
                    <div className="w-24 font-medium text-foreground">{day.day}</div>
                    <div className="flex-1">
                      <Progress 
                        value={day.score} 
                        className={`h-6 ${day.score >= 80 ? '[&>div]:bg-green-500' : day.score >= 60 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-400'}`}
                      />
                    </div>
                    <div className="w-12 text-right font-bold text-foreground">{day.score}%</div>
                    <div className="w-40 text-sm text-muted-foreground hidden md:block">{day.reason}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="text-lg">Best Time Slots</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <span className="font-medium text-foreground">Friday 7-9 PM</span>
                    <Badge className="bg-green-500 text-white">Peak</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <span className="font-medium text-foreground">Saturday 6-8 PM</span>
                    <Badge className="bg-green-500 text-white">Peak</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <span className="font-medium text-foreground">Sunday 11 AM-1 PM</span>
                    <Badge className="bg-yellow-500 text-black">Brunch</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="text-lg">Avoid These Dates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <span className="font-medium text-foreground">Super Bowl Weekend</span>
                    <Badge variant="destructive">Low</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <span className="font-medium text-foreground">Major Thunder Games</span>
                    <Badge variant="destructive">Low</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <span className="font-medium text-foreground">Monday Nights</span>
                    <Badge className="bg-yellow-500 text-black">Weak</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="ai-insights" className="space-y-4">
            <Card variant="elevated" className="border-secondary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-secondary" />
                  AI Strategic Recommendations
                </CardTitle>
                <CardDescription>Personalized insights based on market analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                  <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-secondary" />
                    Opportunity Alert
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Activity-based events are seeing 22% growth but only 15% of market supply. 
                    Consider adding more bowling, TopGolf, and hiking events to capture this demand.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    Price Positioning
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Your events are priced 10% below market average. Consider a modest increase 
                    for premium experiences while keeping entry-level options accessible.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-purple-400" />
                    Demographic Gap
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    40+ age group is underserved in the market. Only 2 competitors offer 
                    age-specific events. Consider launching "Wine & Wisdom" series for mature singles.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                    <Eye className="h-4 w-4 text-orange-400" />
                    Differentiation
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Your Trust Index and zero-ghosting features are unique in the market. 
                    Amplify this in marketing - 78% of singles cite safety as a top concern.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MarketIntel;
