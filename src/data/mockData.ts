// Mock data for frontend-only MVP
import { celebrityProfiles } from './mockCelebrityProfiles';
import { realOkcEvents } from './realOkcEvents';

export type UserRole = 'single' | 'team' | 'admin' | 'coder';

// Verification levels
export type VerificationLevel = 'none' | 'photo' | 'event' | 'trusted';

// Age ranges for mystery profiles
export type AgeRange = '21-25' | '25-30' | '30-35' | '35-40' | '40-45' | '45-50' | '50+';

// Areas in OKC metro
export type Area = 'Downtown OKC' | 'Midtown' | 'Bricktown' | 'Norman' | 'Edmond' | 'Moore' | 'Yukon' | 'Bethany';

export interface User {
  id: string;
  name: string;
  age: number;
  ageRange: AgeRange;
  area: Area;
  bio: string;
  interests: string[];
  interestTags: string[]; // Top 3-5 for mystery mode
  photoUrl: string;
  eventsAttended: string[];
  role: UserRole;
  // Anti-catfish
  verificationLevel: VerificationLevel;
  lastVerifiedAt?: string;
  // Anti-ghosting
  responseRate: number; // 0-100 percentage
  showUpRate: number; // RSVP vs actual check-in rate
  totalConnections: number;
  // Optional demographics
  religion?: string;
  lookingFor?: 'relationship' | 'friendship' | 'both';
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
  // Smart compatibility
  attendeeAgeRanges?: AgeRange[];
  popularInterests?: string[];
  compatibleCount?: number;
}

export interface RSVP {
  eventId: string;
  doorCode: string;
  checkedIn: boolean;
  checkedInAt?: string;
}

// Current logged-in user (mock)
export const currentUser: User = {
  id: 'user-1',
  name: 'You',
  age: 28,
  ageRange: '25-30',
  area: 'Midtown',
  bio: 'Looking for genuine connections!',
  interests: ['hiking', 'coffee', 'live music'],
  interestTags: ['Hiking', 'Coffee', 'Live Music'],
  photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  eventsAttended: ['event-1', 'event-3'],
  role: 'single',
  verificationLevel: 'event',
  lastVerifiedAt: '2024-12-10',
  responseRate: 92,
  showUpRate: 100,
  totalConnections: 12,
  religion: 'Christian',
  lookingFor: 'relationship',
};

// Mock singles profiles
export const mockProfiles: User[] = [
  {
    id: 'user-2',
    name: 'Alex',
    age: 32,
    ageRange: '30-35',
    area: 'Bricktown',
    bio: 'Adventure seeker who loves trying new restaurants and weekend road trips.',
    interests: ['travel', 'food', 'photography'],
    interestTags: ['Travel', 'Food', 'Photography'],
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    eventsAttended: ['event-1', 'event-2'],
    role: 'single',
    verificationLevel: 'trusted',
    responseRate: 95,
    showUpRate: 100,
    totalConnections: 28,
    lookingFor: 'relationship',
  },
  {
    id: 'user-3',
    name: 'Jordan',
    age: 29,
    ageRange: '25-30',
    area: 'Norman',
    bio: 'Creative soul with a passion for art galleries and cozy coffee shops.',
    interests: ['art', 'coffee', 'reading'],
    interestTags: ['Art', 'Coffee', 'Reading'],
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    eventsAttended: ['event-2'],
    role: 'single',
    verificationLevel: 'photo',
    responseRate: 78,
    showUpRate: 85,
    totalConnections: 15,
    religion: 'Spiritual',
    lookingFor: 'both',
  },
  {
    id: 'user-4',
    name: 'Taylor',
    age: 31,
    ageRange: '30-35',
    area: 'Edmond',
    bio: 'Fitness enthusiast who believes in balance - gym in the morning, tacos at night!',
    interests: ['fitness', 'cooking', 'dogs'],
    interestTags: ['Fitness', 'Cooking', 'Dogs'],
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    eventsAttended: ['event-1', 'event-3'],
    role: 'single',
    verificationLevel: 'event',
    responseRate: 88,
    showUpRate: 95,
    totalConnections: 22,
    lookingFor: 'relationship',
  },
  {
    id: 'user-5',
    name: 'Morgan',
    age: 27,
    ageRange: '25-30',
    area: 'Downtown OKC',
    bio: 'Music lover and concert-goer. Always up for karaoke!',
    interests: ['music', 'karaoke', 'dancing'],
    interestTags: ['Music', 'Karaoke', 'Dancing'],
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    eventsAttended: ['event-3'],
    role: 'single',
    verificationLevel: 'event',
    responseRate: 91,
    showUpRate: 92,
    totalConnections: 18,
    religion: 'None',
    lookingFor: 'both',
  },
  {
    id: 'user-6',
    name: 'Casey',
    age: 34,
    ageRange: '30-35',
    area: 'Moore',
    bio: 'Bookworm with a love for board games and craft beer.',
    interests: ['books', 'games', 'beer'],
    interestTags: ['Books', 'Games', 'Beer'],
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    eventsAttended: ['event-2', 'event-3'],
    role: 'single',
    verificationLevel: 'trusted',
    responseRate: 97,
    showUpRate: 100,
    totalConnections: 35,
    religion: 'Christian',
    lookingFor: 'relationship',
  },
];

// Use real OKC events
export const mockEvents: Event[] = realOkcEvents;

// Combine original profiles with celebrity profiles for 300+ total
export const allProfiles: User[] = [...mockProfiles, ...celebrityProfiles];

// Mock RSVPs for current user
export const userRSVPs: RSVP[] = [
  { eventId: 'event-1', doorCode: 'LOVE2024', checkedIn: true, checkedInAt: '2024-12-20T19:15:00' },
  { eventId: 'event-3', doorCode: 'SPARK789', checkedIn: true, checkedInAt: '2024-12-28T17:05:00' },
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

// Helper to get verification badge info
export const getVerificationBadge = (level: VerificationLevel) => {
  switch (level) {
    case 'trusted':
      return { icon: '⭐', label: 'Community Trusted', color: 'text-yellow-500' };
    case 'event':
      return { icon: '✅', label: 'Event Verified', color: 'text-green-500' };
    case 'photo':
      return { icon: '🔵', label: 'Photo Verified', color: 'text-blue-500' };
    default:
      return null;
  }
};

// Calculate compatibility score for events
export const getEventCompatibility = (event: Event): number => {
  let score = 0;
  
  // Age range match
  if (event.attendeeAgeRanges?.includes(currentUser.ageRange)) {
    score += 30;
  }
  
  // Interest overlap
  const interestOverlap = event.popularInterests?.filter(i => 
    currentUser.interests.includes(i.toLowerCase()) || currentUser.interestTags.includes(i)
  ).length || 0;
  score += interestOverlap * 20;
  
  return Math.min(score, 100);
};

// Get compatible singles count for an event
export const getCompatibleSinglesCount = (eventId: string): number => {
  return mockProfiles.filter(profile => 
    profile.eventsAttended.includes(eventId) || 
    profile.interestTags.some(tag => currentUser.interestTags.includes(tag))
  ).length;
};
