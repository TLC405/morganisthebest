// 300 Celebrity-inspired mock profiles for realistic app demo
import { User, UserRole, VerificationLevel, AgeRange, Area } from './mockData';

const areas: Area[] = ['Downtown OKC', 'Midtown', 'Bricktown', 'Norman', 'Edmond', 'Moore', 'Yukon', 'Bethany'];
const religions = ['Christian', 'Catholic', 'Spiritual', 'None', 'Jewish', 'Buddhist', 'Muslim', 'Other'];
const lookingForOptions: ('relationship' | 'friendship' | 'both')[] = ['relationship', 'friendship', 'both'];

const interestPool = [
  'Hiking', 'Coffee', 'Live Music', 'Art', 'Travel', 'Cooking', 'Fitness', 'Reading',
  'Photography', 'Dancing', 'Wine', 'Gaming', 'Movies', 'Yoga', 'Running', 'Dogs',
  'Cats', 'Brunch', 'Concerts', 'Theater', 'Sports', 'Basketball', 'Football', 'Golf',
  'Tennis', 'Swimming', 'Cycling', 'Painting', 'Writing', 'Podcasts', 'Investing',
  'Fashion', 'Skincare', 'Meditation', 'Volunteering', 'Karaoke', 'Board Games',
  'Trivia', 'Astrology', 'True Crime', 'Comedy', 'Documentaries', 'Sushi', 'Tacos',
  'BBQ', 'Craft Beer', 'Cocktails', 'Nature', 'Camping', 'Road Trips', 'Museums'
];

const bios = [
  "Living life one adventure at a time. Looking for someone to share the journey.",
  "Coffee enthusiast by day, concert-goer by night. Let's explore OKC together!",
  "Fitness lover who believes in balance - tacos are a food group, right?",
  "Creative soul seeking genuine connections. Art galleries and good conversations.",
  "Dog parent, brunch fanatic, and amateur chef. Your future sous chef?",
  "Thunder fan since day one! Looking for my MVP partner in crime.",
  "Book lover with a passion for deep talks and cozy coffee shops.",
  "Weekend warrior who loves hiking, live music, and spontaneous adventures.",
  "Yoga instructor by profession, foodie by passion. Namaste and tacos!",
  "Tech professional with a love for nature. Best of both worlds.",
  "Artist at heart, always looking for inspiration and good company.",
  "Sports enthusiast ready to cheer on the Thunder with you!",
  "Music lover, travel addict, and eternal optimist. Let's make memories!",
  "Entrepreneur by day, home chef by night. Looking for my taste-tester.",
  "Outdoor adventurer seeking a partner for hikes and stargazing.",
  "Fashion-forward and fun-loving. Let's hit up the best spots in OKC!",
  "Podcast junkie and amateur comedian. Will make you laugh!",
  "Wine connoisseur seeking someone to share sunsets and conversations.",
  "Fitness enthusiast with a sweet tooth. Gym then donuts, always.",
  "Creative professional who loves art walks and craft cocktails.",
];

const photoUrls = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400',
  'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400',
  'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400',
  'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400',
  'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400',
  'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=400',
  'https://images.unsplash.com/photo-1546967191-fdfb13ed6b1e?w=400',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400',
  'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400',
];

// Celebrity-inspired names (first names only for privacy simulation)
const celebrityNames = [
  // Gen Z / Young (18-25) - 80 profiles
  'Zendaya', 'Timothée', 'Florence', 'Tom H.', 'Sydney', 'Jenna', 'Chase', 'Madelyn',
  'Noah', 'Olivia R.', 'Finn', 'Millie', 'Caleb', 'Sadie', 'Shawn', 'Camila',
  'Harry S.', 'Billie', 'Lil Nas', 'Doja', 'Megan T.', 'Jack H.', 'Anya', 'Jacob E.',
  'Emma C.', 'Damson', 'Keke', 'Amandla', 'Storm', 'Regé', 'Simone', 'Cailee',
  'Jharrel', 'Dominique', 'Kelvin', 'LaKeith', 'Jessie', 'Yara', 'Marcus', 'Zazie',
  'Algee', 'Chloe B.', 'Halle B.', 'Quinta', 'Tyler J.', 'Marsai', 'Lyric', 'Chosen',
  'Asante', 'Lexi', 'Priah', 'Shahadi', 'JD', 'Evan M.', 'Jaeden', 'Sophia A.',
  'Isabela', 'Xochitl', 'Jaz', 'Kyla', 'Chandler', 'Wyatt', 'Mckenna', 'Joshua B.',
  'Rafael', 'Fivel', 'Malina', 'Charlie B.', 'Walker', 'Ariela', 'Gavin', 'Brianne',
  'Mason G.', 'Peyton', 'Riele', 'Jaylen', 'Cree', 'Navia', 'Issac', 'Dara',
  
  // Prime Age (26-35) - 100 profiles
  'Chris E.', 'Margot', 'Michael B.', 'Lupita', 'Oscar I.', 'Dakota', 'Sebastian',
  'Elizabeth O.', 'Paul M.', 'Brie', 'Anthony M.', 'Scarlett', 'Chadwick', 'Letitia',
  'Daniel K.', 'Tessa', 'Simu', 'Awkwafina', 'Jonathan M.', 'Hailee', 'Thomasin',
  'Kaitlyn', 'Lucas H.', 'Lily C.', 'Richard M.', 'Gemma', 'Kit', 'Emilia',
  'Pedro', 'Bella R.', 'Andrew G.', 'Emma S.', 'Dev', 'Mindy', 'Rami', 'Lucy L.',
  'Eddie R.', 'Katherine W.', 'John B.', 'Alicia V.', 'Idris', 'Thandiwe', 'Chiwetel',
  'Gugu', 'David O.', 'Ruth N.', 'John D.', 'Nathalie', 'Nikolaj', 'Lena H.',
  'Maisie', 'Sophie T.', 'Alfie', 'Isaac H.', 'Rosamund', 'Ben B.', 'Felicity',
  'Martin F.', 'Michelle W.', 'Tom Hid.', 'Zawe', 'Himesh', 'Lily J.', 'Josh ON.',
  'Vanessa K.', 'Lin-Man.', 'Leslie O.', 'Daveed', 'Renée E.', 'Anthony R.', 'Phillipa',
  'Jasmine C.', 'Okieriete', 'Christopher J.', 'Condola', 'Colman D.', 'Lakeith',
  'Teyonah', 'Brian T.', 'Kiersey', 'RJ Cyler', 'Dacre', 'Natalia D.', 'Joe K.',
  'Charlie H.', 'Maya H.', 'Calum', 'Priscilla', 'Ross L.', 'Samara', 'Joseph Q.',
  'Stefania', 'George M.', 'Auli\'i', 'Chance', 'SZA', 'Giveon', 'Kehlani',
  'Daniel C.', 'Jessie R.', 'Yungblud', 'Clairo',
  
  // Established (36-45) - 60 profiles
  'Ryan R.', 'Blake', 'Bradley C.', 'Lady Gaga', 'Adam D.', 'Scarlett J.', 'Matt D.',
  'Anne H.', 'Christian B.', 'Amy A.', 'Jake G.', 'Natalie P.', 'Ryan G.', 'Eva M.',
  'Mark R.', 'Zoe S.', 'Chris P.', 'Anna F.', 'Dave B.', 'Aubrey P.', 'Chris H.',
  'Elsa P.', 'Jason M.', 'Lisa B.', 'Josh B.', 'Diane K.', 'Seth R.', 'Rose B.',
  'James F.', 'Mila K.', 'Ashton', 'Jessica A.', 'Justin T.', 'Jessica B.', 'Common',
  'Kerry W.', 'Terrence H.', 'Taraji', 'Chadwick', 'Viola', 'Sterling B.', 'Susan K.',
  'Winston', 'Keri R.', 'Omari', 'Meagan G.', 'Laz A.', 'Sanaa', 'Morris C.', 'Gabrielle',
  'Dwayne', 'Lauren L.', 'Ice Cube', 'Nia', 'Jamie F.', 'Halle', 'Usher', 'Ciara',
  'Ludacris', 'Fantasia',
  
  // Mature (46-55) - 40 profiles
  'George C.', 'Julia R.', 'Brad P.', 'Jennifer A.', 'Leonardo', 'Cameron D.', 'Keanu',
  'Sandra B.', 'Will S.', 'Jada', 'Denzel', 'Angela B.', 'Samuel L.', 'Holly B.',
  'Laurence F.', 'Regina K.', 'Don C.', 'Loretta D.', 'Forest W.', 'Alfre W.',
  'Jeffrey W.', 'CCH', 'Danny G.', 'Rosie P.', 'Michael K.', 'S. Epatha', 'Wendell P.',
  'Phylicia', 'Joe M.', 'LisaRaye', 'Boris K.', 'Nicole B.', 'Rockmond', 'Malinda W.',
  'Richard R.', 'Vivica', 'Malik Y.', 'Tisha C.', 'Lamman', 'Kim F.',
  
  // Silver (56-65) - 20 profiles  
  'Morgan F.', 'Meryl', 'Robert D.', 'Helen M.', 'Anthony H.', 'Judi D.', 'Michael C.',
  'Glenn C.', 'Liam N.', 'Diane L.', 'Harrison', 'Sigourney', 'Tom H.', 'Emma T.',
  'Patrick S.', 'Viola D.', 'James E.', 'Octavia', 'Louis G.', 'Cicely'
];

function getAgeRange(age: number): AgeRange {
  if (age <= 25) return '21-25';
  if (age <= 30) return '25-30';
  if (age <= 35) return '30-35';
  if (age <= 40) return '35-40';
  if (age <= 45) return '40-45';
  if (age <= 50) return '45-50';
  return '50+';
}

function getRandomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function getTrustLevel(responseRate: number, showUpRate: number): string {
  const avg = (responseRate + showUpRate) / 2;
  if (avg >= 95) return 'champion';
  if (avg >= 85) return 'trusted';
  if (avg >= 70) return 'verified';
  return 'rising_star';
}

// Generate 300 celebrity profiles
export const celebrityProfiles: User[] = celebrityNames.map((name, index) => {
  // Distribute ages according to plan
  let age: number;
  if (index < 80) {
    age = 18 + Math.floor(Math.random() * 8); // 18-25
  } else if (index < 180) {
    age = 26 + Math.floor(Math.random() * 10); // 26-35
  } else if (index < 240) {
    age = 36 + Math.floor(Math.random() * 10); // 36-45
  } else if (index < 280) {
    age = 46 + Math.floor(Math.random() * 10); // 46-55
  } else {
    age = 56 + Math.floor(Math.random() * 10); // 56-65
  }
  
  const interests = getRandomItems(interestPool, 4 + Math.floor(Math.random() * 4));
  const responseRate = 70 + Math.floor(Math.random() * 30);
  const showUpRate = 75 + Math.floor(Math.random() * 25);
  const verificationLevels: VerificationLevel[] = ['photo', 'event', 'trusted'];
  
  return {
    id: `celeb-${index + 1}`,
    name,
    age,
    ageRange: getAgeRange(age),
    area: areas[Math.floor(Math.random() * areas.length)],
    bio: bios[index % bios.length],
    interests: interests.map(i => i.toLowerCase()),
    interestTags: interests.slice(0, 4),
    photoUrl: photoUrls[index % photoUrls.length],
    eventsAttended: [`event-${(index % 10) + 1}`],
    role: 'single' as UserRole,
    verificationLevel: verificationLevels[Math.floor(Math.random() * verificationLevels.length)],
    responseRate,
    showUpRate,
    totalConnections: 5 + Math.floor(Math.random() * 50),
    religion: religions[Math.floor(Math.random() * religions.length)],
    lookingFor: lookingForOptions[Math.floor(Math.random() * lookingForOptions.length)],
  };
});

// Trust level helpers
export const getTrustBadge = (trustIndex: number) => {
  if (trustIndex >= 90) return { icon: '👑', label: 'Community Champion', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
  if (trustIndex >= 70) return { icon: '💎', label: 'Trusted Member', color: 'text-blue-400', bg: 'bg-blue-500/20' };
  if (trustIndex >= 50) return { icon: '✓', label: 'Verified', color: 'text-green-400', bg: 'bg-green-500/20' };
  return { icon: '🌟', label: 'Rising Star', color: 'text-purple-400', bg: 'bg-purple-500/20' };
};

export default celebrityProfiles;
