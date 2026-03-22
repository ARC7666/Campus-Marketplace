/**
 * Indian states and sample cities for location selector.
 * Can be expanded with full city lists per state.
 */

export const STATES = [
  'NIT Durgapur Hostels',
  'West Bengal',
  'Other',
];

export const CITIES_BY_STATE = {
  'NIT Durgapur Hostels': [
    'Hall 1',
    'Hall 2',
    'Hall 3',
    'Hall 4',
    'Hall 5',
    'Hall 7',
    'Hall 9',
    'Hall 11',
    'Mother Teresa Hall',
    'Sister Nivedita Hall',
    'Pre-Sengupta Hall',
    'Sengupta Hall',
  ],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri'],
  Other: ['Other'],
};

export const getCitiesForState = (state) =>
  (state && CITIES_BY_STATE[state]) || [];
