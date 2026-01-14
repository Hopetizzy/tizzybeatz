
import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Midnight Echoes',
    type: 'beat',
    price: 29.99,
    isFree: false,
    audioPreviewUrl: '',
    thumbnailUrl: 'https://picsum.photos/seed/beat1/400/400',
    description: 'Dark trap beat with atmospheric pads and heavy 808s.',
    tags: ['Trap', 'Dark', 'Hard'],
    bpm: 140,
    key: 'Cm',
    fileUrl: ''
  },
  {
    id: '2',
    title: 'Vintage Soul Samples Vol. 1',
    type: 'sample-pack',
    price: 15.00,
    isFree: false,
    audioPreviewUrl: '',
    thumbnailUrl: 'https://picsum.photos/seed/pack1/400/400',
    description: 'Authentic soul loops recorded from vintage analog hardware.',
    tags: ['Soul', 'Vintage', 'Loops'],
    fileUrl: ''
  },
  {
    id: '3',
    title: 'Future Bass MIDI Essentials',
    type: 'midi-pack',
    price: 0,
    isFree: true,
    audioPreviewUrl: '',
    thumbnailUrl: 'https://picsum.photos/seed/midi1/400/400',
    description: 'Essential MIDI chord progressions for modern electronic music.',
    tags: ['MIDI', 'Chords', 'Electronic'],
    fileUrl: ''
  },
  {
    id: '4',
    title: 'Neon Skyline',
    type: 'beat',
    price: 34.99,
    isFree: false,
    audioPreviewUrl: '',
    thumbnailUrl: 'https://picsum.photos/seed/beat2/400/400',
    description: 'Synthwave inspired beat with retro vibes.',
    tags: ['Synthwave', 'Retro', 'Pop'],
    bpm: 110,
    key: 'Am',
    fileUrl: ''
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'All Products' },
  { id: 'beat', label: 'Beats' },
  { id: 'sample-pack', label: 'Sample Packs' },
  { id: 'midi-pack', label: 'MIDI Packs' },
  { id: 'song', label: 'Songs' }
];
