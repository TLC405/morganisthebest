import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

export const personalityQuotes = [
  { category: 'Flirty', quote: "My love language is tacos and quality time 🌮", emoji: '😏' },
  { category: 'Flirty', quote: "Looking for my partner in crime and brunch", emoji: '💕' },
  { category: 'Adventurous', quote: "Looking for someone who'll get lost with me", emoji: '🗺️' },
  { category: 'Adventurous', quote: "Let's create stories we'll tell forever", emoji: '✨' },
  { category: 'Cozy', quote: "Netflix, blankets, and someone to share them with", emoji: '🛋️' },
  { category: 'Cozy', quote: "Home is wherever I'm with you", emoji: '🏡' },
  { category: 'Foodie', quote: "The way to my heart is through brunch", emoji: '🍳' },
  { category: 'Foodie', quote: "Searching for my forever plus-one to food festivals", emoji: '🍕' },
  { category: 'Witty', quote: "Fluent in sarcasm and movie references", emoji: '🎬' },
  { category: 'Witty', quote: "I'm 6'0\" if you count my personality", emoji: '😎' },
  { category: 'Honest', quote: "Here because my mom said I need to get out more", emoji: '👋' },
  { category: 'Honest', quote: "Just here to see if the vibes match the bio", emoji: '🤷' },
  { category: 'Romantic', quote: "Still believes in love at first sight", emoji: '💖' },
  { category: 'Romantic', quote: "Looking for my last first date", emoji: '🌹' },
  { category: 'Active', quote: "Will run 5K with you, then eat like we ran a marathon", emoji: '🏃' },
  { category: 'Active', quote: "Seeking adventure buddy for spontaneous road trips", emoji: '🚗' },
];

interface PersonalityQuoteSelectorProps {
  selectedQuote: string | null;
  onSelect: (quote: string) => void;
}

export const PersonalityQuoteSelector = ({ selectedQuote, onSelect }: PersonalityQuoteSelectorProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const categories = [...new Set(personalityQuotes.map(q => q.category))];
  const filteredQuotes = selectedCategory 
    ? personalityQuotes.filter(q => q.category === selectedCategory)
    : personalityQuotes;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Personality Quote
        </CardTitle>
        <CardDescription>
          Pick a quote that represents your vibe - it'll show on your profile!
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge 
            variant={selectedCategory === null ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Badge>
          {categories.map(cat => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>

        {/* Quotes Grid */}
        <div className="grid gap-2">
          {filteredQuotes.map((q, index) => (
            <button
              key={index}
              onClick={() => onSelect(q.quote)}
              className={`text-left p-3 rounded-lg border transition-all ${
                selectedQuote === q.quote
                  ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                  : 'border-border hover:border-primary/50 hover:bg-muted'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-xl">{q.emoji}</span>
                <div>
                  <p className="text-sm font-medium text-foreground">"{q.quote}"</p>
                  <p className="text-xs text-muted-foreground mt-1">{q.category}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {selectedQuote && (
          <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm text-muted-foreground">Your quote:</p>
            <p className="text-foreground font-medium">"{selectedQuote}"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
