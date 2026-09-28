/**
 * Web Audio API Cyber Synthesizer
 * Zero external audio files; generates futuristic subtle sound FX on-the-fly.
 */
(function() {
  let audioCtx = null;
  let isMuted = localStorage.getItem('portfolio-audio-muted') === 'true';

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  window.cyberSound = {
    click: function() {
      if (isMuted) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } catch (e) {}
    },

    chime: function() {
      if (isMuted) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } catch (e) {}
    },

    toggleMute: function() {
      isMuted = !isMuted;
      localStorage.setItem('portfolio-audio-muted', isMuted ? 'true' : 'false');
      return isMuted;
    },

    isMuted: function() {
      return isMuted;
    }
  };

  // Wire sound toggle button in UI
  document.addEventListener('DOMContentLoaded', () => {
    const soundBtn = document.getElementById('sound-toggle-btn');
    if (soundBtn) {
      if (isMuted) {
        soundBtn.classList.add('muted');
        soundBtn.innerHTML = "<i class='bx bx-volume-mute'></i>";
      }

      soundBtn.addEventListener('click', () => {
        const muted = window.cyberSound.toggleMute();
        soundBtn.classList.toggle('muted', muted);
        soundBtn.innerHTML = muted ? "<i class='bx bx-volume-mute'></i>" : "<i class='bx bx-volume-full'></i>";
        if (!muted) {
          window.cyberSound.chime();
        }
      });
    }

    // Attach subtle click sound to buttons and tabs
    document.querySelectorAll('.btn, .filter-btn, .nav-link, .terminal-hint-chip').forEach(el => {
      el.addEventListener('click', () => {
        window.cyberSound.click();
      });
    });
  });
})();
