// Web Audio API Emergency Alarm Synthesizer
// Generates realistic multi-frequency siren waveforms (Wail, Yelp, Hi-Lo)

class AlarmAudioService {
  private audioCtx: AudioContext | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private sweepInterval: number | null = null;
  private isPlaying: boolean = false;

  private initAudio() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public startSiren(type: 'wail' | 'yelp' | 'hilo' = 'wail') {
    if (this.isPlaying) return;

    try {
      this.initAudio();
      if (!this.audioCtx) return;

      this.isPlaying = true;

      this.osc1 = this.audioCtx.createOscillator();
      this.osc2 = this.audioCtx.createOscillator();
      this.gainNode = this.audioCtx.createGain();

      this.osc1.type = 'sawtooth';
      this.osc2.type = 'sine';

      this.gainNode.gain.setValueAtTime(0.25, this.audioCtx.currentTime);

      this.osc1.connect(this.gainNode);
      this.osc2.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);

      let rising = true;
      let freq = 750;

      if (type === 'wail') {
        this.sweepInterval = window.setInterval(() => {
          if (!this.audioCtx || !this.osc1 || !this.osc2) return;
          if (rising) {
            freq += 35;
            if (freq >= 1200) rising = false;
          } else {
            freq -= 35;
            if (freq <= 750) rising = true;
          }
          this.osc1.frequency.linearRampToValueAtTime(freq, this.audioCtx.currentTime + 0.05);
          this.osc2.frequency.linearRampToValueAtTime(freq * 1.5, this.audioCtx.currentTime + 0.05);
        }, 50);
      } else if (type === 'yelp') {
        this.sweepInterval = window.setInterval(() => {
          if (!this.audioCtx || !this.osc1 || !this.osc2) return;
          freq = rising ? 1300 : 750;
          rising = !rising;
          this.osc1.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
          this.osc2.frequency.setValueAtTime(freq * 1.3, this.audioCtx.currentTime);
        }, 180);
      } else {
        // Hi-Lo
        let hilo = false;
        this.sweepInterval = window.setInterval(() => {
          if (!this.audioCtx || !this.osc1 || !this.osc2) return;
          freq = hilo ? 900 : 650;
          hilo = !hilo;
          this.osc1.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
          this.osc2.frequency.setValueAtTime(freq * 1.2, this.audioCtx.currentTime);
        }, 450);
      }

      this.osc1.start();
      this.osc2.start();
    } catch (e) {
      console.warn('AudioContext auto-play restriction or error:', e);
    }
  }

  public stopSiren() {
    if (!this.isPlaying) return;

    if (this.sweepInterval) {
      clearInterval(this.sweepInterval);
      this.sweepInterval = null;
    }

    try {
      if (this.osc1) {
        this.osc1.stop();
        this.osc1.disconnect();
        this.osc1 = null;
      }
      if (this.osc2) {
        this.osc2.stop();
        this.osc2.disconnect();
        this.osc2 = null;
      }
      if (this.gainNode) {
        this.gainNode.disconnect();
        this.gainNode = null;
      }
    } catch (e) {
      console.warn('Error stopping siren audio:', e);
    }

    this.isPlaying = false;
  }

  public playBeep(freq = 880, durationMs = 150) {
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + durationMs / 1000);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + durationMs / 1000);
    } catch (e) {
      console.warn('Audio beep error:', e);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const alarmAudioService = new AlarmAudioService();
