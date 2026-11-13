const GOOGLE_MEET_HOST = 'meet.google.com';

export function isGoogleMeetLink(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return (
      url.protocol === 'https:' &&
      url.hostname === GOOGLE_MEET_HOST &&
      url.port === '' &&
      url.username === '' &&
      url.password === '' &&
      url.pathname.length > 1
    );
  } catch {
    return false;
  }
}
