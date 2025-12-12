// Mock data for frontend-only MVP

export type UserRole = 'single' | 'team' | 'admin' | 'coder';

export interface User {
  id: string;
  name: string;
  age: number;
  bio: string;
  interests: string[];
  photoUrl: string;
  eventsAttended: string[];
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: 'mixer' | 'speed-dating' | 'activity' | 'social';
  attendeeCount: number;
  maxCapacity: number;
  imageUrl: string;
}

export interface RSVP {
  eventId: string;
  doorCode: string;
  checkedIn: boolean;
}

// Current logged-in user (mock)
export const currentUser: User = {
  id: 'user-1',
  name: 'You',
  age: 28,
  bio: 'Looking for genuine connections!',
  interests: ['hiking', 'coffee', 'live music'],
  photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  eventsAttended: ['event-1', 'event-3'],
};

// Mock singles profiles
export const mockProfiles: User[] = [
  {
    id: 'user-2',
    name: 'Alex',
    age: 32,
    bio: 'Adventure seeker who loves trying new restaurants and weekend road trips.',
    interests: ['travel', 'food', 'photography'],
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    eventsAttended: ['event-1', 'event-2'],
  },
  {
    id: 'user-3',
    name: 'Jordan',
    age: 29,
    bio: 'Creative soul with a passion for art galleries and cozy coffee shops.',
    interests: ['art', 'coffee', 'reading'],
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    eventsAttended: ['event-2'],
  },
  {
    id: 'user-4',
    name: 'Taylor',
    age: 31,
    bio: 'Fitness enthusiast who believes in balance - gym in the morning, tacos at night!',
    interests: ['fitness', 'cooking', 'dogs'],
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    eventsAttended: ['event-1', 'event-3'],
  },
  {
    id: 'user-5',
    name: 'Morgan',
    age: 27,
    bio: 'Music lover and concert-goer. Always up for karaoke!',
    interests: ['music', 'karaoke', 'dancing'],
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    eventsAttended: ['event-3'],
  },
  {
    id: 'user-6',
    name: 'Casey',
    age: 34,
    bio: 'Bookworm with a love for board games and craft beer.',
    interests: ['books', 'games', 'beer'],
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    eventsAttended: ['event-2', 'event-3'],
  },
];

// Mock events
export const mockEvents: Event[] = [
  {
    id: 'event-1',
    title: 'Friday Night Mixer',
    date: '2024-12-20',
    time: '7:00 PM',
    location: 'The Social Lounge, OKC',
    description: 'Casual drinks and conversation in a relaxed atmosphere. Perfect for first-timers!',
    category: 'mixer',
    attendeeCount: 24,
    maxCapacity: 40,
    imageUrl: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600',
  },
  {
    id: 'event-2',
    title: 'Speed Dating Spectacular',
    date: '2024-12-22',
    time: '6:30 PM',
    location: 'Ember Restaurant, Bricktown',
    description: 'Quick connections, lasting impressions. 8-minute rounds with complimentary appetizers.',
    category: 'speed-dating',
    attendeeCount: 18,
    maxCapacity: 30,
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600',
  },
  {
    id: 'event-3',
    title: 'Bowling & Bonding',
    date: '2024-12-28',
    time: '5:00 PM',
    location: 'Heritage Lanes, Norman',
    description: 'Strike up a conversation while bowling! Teams mixed for maximum mingling.',
    category: 'activity',
    attendeeCount: 32,
    maxCapacity: 48,
    imageUrl: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=600',
  },
  {
    id: 'event-4',
    title: 'New Years Eve Gala',
    date: '2024-12-31',
    time: '8:00 PM',
    location: 'The Grand Ballroom, Downtown OKC',
    description: 'Ring in the new year with fellow singles! Formal attire, champagne toast at midnight.',
    category: 'social',
    attendeeCount: 85,
    maxCapacity: 150,
    imageUrl: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=600',
  },
];

// Mock RSVPs for current user
export const userRSVPs: RSVP[] = [
  { eventId: 'event-1', doorCode: 'LOVE2024', checkedIn: true },
  { eventId: 'event-3', doorCode: 'SPARK789', checkedIn: true },
  { eventId: 'event-4', doorCode: 'NYE2025', checkedIn: false },
];

// Helper to check if current user can see a profile (same event attended)
export const canRevealProfile = (profileId: string): boolean => {
  const profile = mockProfiles.find(p => p.id === profileId);
  if (!profile) return false;
  
  return profile.eventsAttended.some(eventId => 
    currentUser.eventsAttended.includes(eventId)
  );
};

// Generate a random door code
export const generateDoorCode = (): string => {
  const words = ['LOVE', 'SPARK', 'HEART', 'MEET', 'VIBE', 'GLOW'];
  const word = words[Math.floor(Math.random() * words.length)];
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `${word}${num}`;
};
