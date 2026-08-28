const ONBOARDING_PREFIX = 'realvest_onboarded_';

export function hasOnboarded(uid: string): boolean {
  if (!uid) return false;
  try {
    return localStorage.getItem(ONBOARDING_PREFIX + uid) === '1';
  } catch {
    return false;
  }
}

export function markOnboarded(uid: string): void {
  if (!uid) return;
  try {
    localStorage.setItem(ONBOARDING_PREFIX + uid, '1');
  } catch {
    // ignore storage failures
  }
}

export function clearOnboarding(uid?: string): void {
  try {
    if (uid) {
      localStorage.removeItem(ONBOARDING_PREFIX + uid);
    }
    // Clear all user onboarding records
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(ONBOARDING_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch {
    // ignore storage failures
  }
}

