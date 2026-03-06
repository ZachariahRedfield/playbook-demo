import type { Workout } from './workout-types';

const featured: Workout = {
  id: 'wkt-1',
  name: 'Starter Strength',
  durationMinutes: 25
};

export function getFeaturedWorkout(): Workout {
  return featured;
}
