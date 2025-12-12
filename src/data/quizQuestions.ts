import { QuizQuestionData } from '@/components/quiz/QuizQuestion';

export const quizQuestions: QuizQuestionData[] = [
  {
    key: 'weekend_vibe',
    title: 'What\'s your ideal weekend?',
    subtitle: 'Pick the vibe that calls to you most',
    type: 'single',
    options: [
      { value: 'adventure', label: 'Adventure', emoji: '🏔️', description: 'Hiking, exploring, trying new things' },
      { value: 'social', label: 'Social', emoji: '🎉', description: 'Brunch with friends, parties, events' },
      { value: 'cozy', label: 'Cozy', emoji: '🛋️', description: 'Netflix, books, quality time at home' },
      { value: 'cultural', label: 'Cultural', emoji: '🎭', description: 'Museums, concerts, art galleries' },
    ],
  },
  {
    key: 'communication_style',
    title: 'How do you like to stay in touch?',
    subtitle: 'From occasional check-ins to constant contact',
    type: 'slider',
    sliderLabels: {
      min: '📱 Text when needed',
      max: '💬 Always connected',
    },
  },
  {
    key: 'date_night',
    title: 'Perfect date night?',
    subtitle: 'What makes your heart sing?',
    type: 'single',
    options: [
      { value: 'fancy', label: 'Fancy Dinner', emoji: '🍷', description: 'Dress up, candlelight, great food' },
      { value: 'activity', label: 'Fun Activity', emoji: '🎳', description: 'Bowling, mini golf, escape room' },
      { value: 'homemade', label: 'Home Cooked', emoji: '👨‍🍳', description: 'Cook together, wine, and conversation' },
      { value: 'spontaneous', label: 'Spontaneous', emoji: '✨', description: 'Let the night take us wherever' },
    ],
  },
  {
    key: 'love_language',
    title: 'How do you show love?',
    subtitle: 'Everyone has their own way of expressing affection',
    type: 'single',
    options: [
      { value: 'words', label: 'Words', emoji: '💬', description: 'Compliments, texts, verbal affirmation' },
      { value: 'touch', label: 'Touch', emoji: '🤗', description: 'Hugs, holding hands, physical closeness' },
      { value: 'gifts', label: 'Gifts', emoji: '🎁', description: 'Thoughtful presents, surprises' },
      { value: 'acts', label: 'Acts of Service', emoji: '🛠️', description: 'Helping out, doing things for them' },
    ],
  },
  {
    key: 'life_pace',
    title: 'What\'s your life pace?',
    subtitle: 'How fast do you like to move through life?',
    type: 'slider',
    sliderLabels: {
      min: '🐢 Slow & steady',
      max: '🚀 Fast & ambitious',
    },
  },
  {
    key: 'social_energy',
    title: 'Social battery type?',
    subtitle: 'How do you recharge?',
    type: 'single',
    options: [
      { value: 'introvert', label: 'Introvert', emoji: '🌙', description: 'Recharge alone or with few close ones' },
      { value: 'ambivert', label: 'Ambivert', emoji: '🌤️', description: 'Balance of alone time and social' },
      { value: 'extrovert', label: 'Extrovert', emoji: '☀️', description: 'Energized by being around others' },
      { value: 'social_butterfly', label: 'Social Butterfly', emoji: '🦋', description: 'Love meeting new people!' },
    ],
  },
  {
    key: 'future_vision',
    title: 'What\'s in your future?',
    subtitle: 'Select all that you\'re excited about',
    type: 'multi',
    options: [
      { value: 'travel', label: 'Travel the world', emoji: '✈️' },
      { value: 'career', label: 'Career growth', emoji: '📈' },
      { value: 'family', label: 'Start a family', emoji: '👨‍👩‍👧' },
      { value: 'adventure', label: 'Seek adventure', emoji: '🎯' },
      { value: 'stability', label: 'Build stability', emoji: '🏡' },
      { value: 'creative', label: 'Creative pursuits', emoji: '🎨' },
    ],
  },
  {
    key: 'deal_breakers',
    title: 'Any deal breakers?',
    subtitle: 'Select anything that\'s a hard no for you',
    type: 'multi',
    options: [
      { value: 'smoking', label: 'Smoking', emoji: '🚬' },
      { value: 'no_pets', label: 'Doesn\'t like pets', emoji: '🐕' },
      { value: 'no_travel', label: 'Never wants to travel', emoji: '🏠' },
      { value: 'workaholic', label: 'Workaholic', emoji: '💼' },
      { value: 'no_kids', label: 'Doesn\'t want kids', emoji: '👶' },
      { value: 'jealous', label: 'Overly jealous', emoji: '😤' },
    ],
  },
];
