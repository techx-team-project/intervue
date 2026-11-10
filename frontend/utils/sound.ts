export function playNotificationSound() {
  if (typeof window === 'undefined') return;
  try {
    const isSoundEnabled = localStorage.getItem('connect_notification_sound');
    if (isSoundEnabled === 'false') return;

    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const playTone = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.12, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // Elegant two-tone chime (D5 -> A5)
    playTone(587.33, now, 0.12);
    playTone(880.0, now + 0.09, 0.22);
  } catch {
    // Autoplay restrictions or audio context unavailable, silently ignore
  }
}

export function showDesktopNotification(title = 'InterVue Connect', body = 'You have a new message') {
  if (typeof window === 'undefined') return;
  try {
    const isNotifEnabled = localStorage.getItem('connect_receive_notifications');
    if (isNotifEnabled === 'false') return;

    if ('Notification' in window && Notification.permission === 'granted' && document.hidden) {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
      });
    }
  } catch {
    // Silently ignore notification errors
  }
}
