import { createContext, useContext, useRef, useState, useCallback, type ReactNode } from 'react';

interface SoundContextValue {
  muted: boolean;
  toggleMute: () => void;
  startAmbient: () => void;
  playTransmission: () => void;
  playWhoosh: () => void;
}

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const ctxRef       = useRef<AudioContext | null>(null);
  const droneGainRef = useRef<GainNode | null>(null);
  const mutedRef     = useRef(false);
  const [muted, setMuted] = useState(false);

  const getCtx = useCallback((): AudioContext => {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    // Only resume if not muted — avoids auto-resuming on mute
    if (ctxRef.current.state === 'suspended' && !mutedRef.current) ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  // Musical space ambient: A-minor chord drone with binaural beating + reverb
  const startAmbient = useCallback(() => {
    const ctx = getCtx();
    if (droneGainRef.current) return;

    const master = ctx.createGain();
    // Fade in smoothly instead of snapping to gain
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(mutedRef.current ? 0 : 0.022, ctx.currentTime + 2.5);
    droneGainRef.current = master;
    master.connect(ctx.destination);

    // ── Delay-based reverb chain ─────────────────────────────────────────────
    const delay1 = ctx.createDelay(1.0); delay1.delayTime.value = 0.22;
    const delay2 = ctx.createDelay(1.0); delay2.delayTime.value = 0.34;
    const fbGain1 = ctx.createGain();    fbGain1.gain.value = 0.26;
    const fbGain2 = ctx.createGain();    fbGain2.gain.value = 0.20;
    const reverbOut = ctx.createGain();  reverbOut.gain.value = 0.38;
    // Feedback: delay1 → fbGain1 → delay2 → fbGain2 → delay1 (ping-pong)
    delay1.connect(fbGain1); fbGain1.connect(delay2);
    delay2.connect(fbGain2); fbGain2.connect(delay1);
    // Reverb output → master
    delay1.connect(reverbOut); reverbOut.connect(master);

    const addOsc = (freq: number, type: OscillatorType, gain: number) => {
      const osc  = ctx.createOscillator();
      const g    = ctx.createGain();
      osc.type             = type;
      osc.frequency.value  = freq;
      g.gain.value         = gain;
      osc.connect(g);
      g.connect(master);
      g.connect(delay1); // send to reverb
      osc.start();
    };

    // A2 (110Hz) — deep sine drone. Laptops can reproduce this cleanly.
    addOsc(110, 'sine', 0.50);
    // A2 slightly detuned (113Hz) — creates a slow 3 Hz beat (sounds like "breathing" space)
    addOsc(113, 'sine', 0.35);
    // E3 perfect fifth (165Hz) — harmonic warmth
    addOsc(165, 'sine', 0.18);
    // A3 octave (220Hz) — gentle shimmer
    addOsc(220, 'triangle', 0.09);
    // E4 higher shimmer (329Hz) — sparkle, barely perceptible
    addOsc(329, 'sine', 0.035);

    // ── Very slow tremolo LFO (0.042 Hz = one cycle every ~24s) ─────────────
    const lfo     = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type            = 'sine';
    lfo.frequency.value = 0.042;
    lfoGain.gain.value  = 0.006; // tiny modulation depth on master
    lfo.connect(lfoGain);
    lfoGain.connect(master.gain);
    lfo.start();
  }, [getCtx]);

  // Musical ascending chime (C-E-G major arpeggio) — clear, gentle
  const playTransmission = useCallback(() => {
    if (mutedRef.current) return;
    const ctx = getCtx();
    const now = ctx.currentTime;

    [[261.6, 0], [329.6, 0.22], [392, 0.44]].forEach(([freq, offset]) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      const rev  = ctx.createDelay(0.5); rev.delayTime.value = 0.18;
      const revG = ctx.createGain();     revG.gain.value = 0.28;

      osc.type             = 'sine';
      osc.frequency.value  = freq;
      gain.gain.setValueAtTime(0, now + offset);
      gain.gain.linearRampToValueAtTime(0.10, now + offset + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.connect(rev); rev.connect(revG); revG.connect(ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + 0.8);
    });
  }, [getCtx]);

  // Softer whoosh — lower frequency sweep sounds more "space" than mechanical
  const playWhoosh = useCallback(() => {
    if (mutedRef.current) return;
    const ctx = getCtx();
    const now = ctx.currentTime;
    const dur = 0.70;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1);

    const src    = ctx.createBufferSource(); src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type  = 'bandpass';
    filter.frequency.setValueAtTime(900, now);
    filter.frequency.exponentialRampToValueAtTime(180, now + dur);
    filter.Q.value = 1.2;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.055, now);
    gain.gain.linearRampToValueAtTime(0, now + dur);

    src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    src.start(now);
  }, [getCtx]);

  const toggleMute = useCallback(() => {
    mutedRef.current = !mutedRef.current;
    setMuted(mutedRef.current);
    if (ctxRef.current) {
      // suspend() freezes the entire AudioContext — stops LFO, delay loops, everything.
      // This is the only reliable way to silence Web Audio (gain manipulation doesn't
      // stop AudioParam modulation from the LFO or feedback loops in the delay chain).
      if (mutedRef.current) {
        ctxRef.current.suspend();
      } else {
        ctxRef.current.resume();
      }
    }
  }, []);

  return (
    <SoundContext.Provider value={{ muted, toggleMute, startAmbient, playTransmission, playWhoosh }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound(): SoundContextValue {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error('useSound must be used within <SoundProvider>');
  return ctx;
}
