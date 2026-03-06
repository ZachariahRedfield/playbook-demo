import { getFeaturedWorkout } from '../features/workouts/workout-service';
import { fetchUserProfile } from '../features/users/user-service';

export function bootDemo(userId: string): string {
  const user = fetchUserProfile(userId);
  const workout = getFeaturedWorkout();

  return `Welcome ${user.displayName}. Next workout: ${workout.name}`;
}
