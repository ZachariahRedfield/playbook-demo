import type { WorkoutPlan } from './workout-types';

const featured: WorkoutPlan = {
  id: 'wkt-1',
  name: 'Starter Strength',
  durationMinutes: 25
};

export function getFeaturedWorkoutPlan(): WorkoutPlan {
  return featured;
}
