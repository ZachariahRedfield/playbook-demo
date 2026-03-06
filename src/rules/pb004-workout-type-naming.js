import { readFile, writeFile } from '../lib/files.js';

const TYPES_PATH = 'src/features/workouts/workout-types.ts';
const SERVICE_PATH = 'src/features/workouts/workout-service.ts';

export const PB004_WORKOUT_TYPE_NAMING = {
  id: 'PB004',
  title: 'Structural inconsistency in workout type naming',
  severity: 'medium',
  check: () => readFile(TYPES_PATH).includes('export type WorkoutPlan'),
  explain:
    'Workout services use WorkoutPlan as the canonical exported domain type. Consistent type naming keeps feature contracts predictable.',
  fix: () => {
    const types = readFile(TYPES_PATH).replace('export type Workout = {', 'export type WorkoutPlan = {');
    const service = readFile(SERVICE_PATH).replaceAll('Workout', 'WorkoutPlan');
    writeFile(TYPES_PATH, types);
    writeFile(SERVICE_PATH, service);
  }
};
