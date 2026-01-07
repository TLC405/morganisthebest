// Database-aligned types for the application
import type { Tables } from '@/integrations/supabase/types';

// Profile from database
export type Profile = Tables<'profiles'>;

// Event from database
export type Event = Tables<'events'>;

// Venue from database
export type Venue = Tables<'venues'>;

// Event Attendance from database
export type EventAttendance = Tables<'event_attendance'>;

// Wave from database
export type Wave = Tables<'waves'>;

// Conversation from database
export type Conversation = Tables<'conversations'>;

// Message from database
export type Message = Tables<'messages'>;

// Feedback from database
export type Feedback = Tables<'feedback'>;

// Verification levels
export type VerificationLevel = 'pending' | 'photo' | 'event' | 'trusted';

// Trust levels
export type TrustLevel = 'rising_star' | 'verified' | 'trusted' | 'champion';

// Age range helper
export type AgeRange = '21-25' | '25-30' | '30-35' | '35-40' | '40-45' | '45-50' | '50+';

// Helper to get age range from age
export const getAgeRange = (age: number | null): AgeRange => {
  if (!age) return '25-30';
  if (age <= 25) return '21-25';
  if (age <= 30) return '25-30';
  if (age <= 35) return '30-35';
  if (age <= 40) return '35-40';
  if (age <= 45) return '40-45';
  if (age <= 50) return '45-50';
  return '50+';
};

// Event with venue join
export interface EventWithVenue extends Event {
  venues?: Venue | null;
}

// Attendance with event join
export interface AttendanceWithEvent extends EventAttendance {
  events?: Event | null;
}

// Helper to get verification badge info
export const getVerificationBadge = (level: string | null) => {
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

// Trust badge helpers
export const getTrustBadge = (trustIndex: number | null) => {
  const index = trustIndex ?? 50;
  if (index >= 90) return { icon: '👑', label: 'Community Champion', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
  if (index >= 70) return { icon: '💎', label: 'Trusted Member', color: 'text-blue-400', bg: 'bg-blue-500/20' };
  if (index >= 50) return { icon: '✓', label: 'Verified', color: 'text-green-400', bg: 'bg-green-500/20' };
  return { icon: '🌟', label: 'Rising Star', color: 'text-purple-400', bg: 'bg-purple-500/20' };
};

// Generate a random door code
export const generateDoorCode = (): string => {
  const words = ['LOVE', 'SPARK', 'HEART', 'MEET', 'VIBE', 'GLOW'];
  const word = words[Math.floor(Math.random() * words.length)];
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `${word}${num}`;
};
