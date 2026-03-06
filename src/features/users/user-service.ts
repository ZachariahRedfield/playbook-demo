type UserProfile = {
  id: string;
  displayName: string;
};

export function fetchUserProfile(userId: string): UserProfile {
  return {
    id: userId,
    displayName: 'Demo Athlete'
  };
}
