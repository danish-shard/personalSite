import { useRef, useState, useCallback } from 'react';

export function useSoundscape() {
  const ctxRef       = useRef<AudioContext | null>(null);
  const droneGainRef = useRef<GainNode | null>(null);
  const mutedRef     = useRef(false);
  const [muted, setMuted] = useState(false);

  const getCtx = useCallback((): AudioContext => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  // Start a continuous ambient drone (call once on first user interaction)
  const startAmbient = useCallback(() => {
    const ctx = getCtx();
    if (droneGainRef.current) return; // already running

    const master = ctx.createGain();
    master.gain.value = mutedRef.current ? 0 : 0.038;
    droneGainRef.current = master;
    master.connect(ctx.destination);

    // Sub-bass tone
    const sub = ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.value = 48;
    const subG = ctx.createGain();
    subG.gain.value = 0.65;
    sub.connect(subG);
    subG.connect(master);
    sub.start();

    // Mid hum (triangle for warmth)
    const mid = ctx.createOscillator();
    mid.type = 'triangle';
    mid.frequency.value = 96;
    const midG = ctx.createGain();
    midG.gain.value = 0.28;
    mid.connect(midG);
    midG.connect(master);
    mid.start();

    // Subtle high shimmer
    const hi = ctx.createOscillator();
    hi.type = 'sine';
    hi.frequency.value = 528;
    const hiG = ctx.createGain();
    hiG.gain.value = 0.05;
    hi.connect(hiG);
    hiG.connect(master);
    hi.start();
  }, [getCtx]);

  // "Transmission received" — three descending beeps
  const playTransmission = useCallback(() => {
    if (mutedRef.current) return;
    const ctx = getCtx();
    const now = ctx.currentTime;
    [0, 0.19, 0.38].forEach((offset, i) => {
      const osc  = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 880 - i * 110;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, now + offset);
      gain.gain.linearRampToValueAtTime(0.09, now + offset + 0.04);
      gain.gain.linearRampToValueAtTime(0, now + offset + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.22);
    });
  }, [getCtx]);

  // Asteroid flyby whoosh — bandpass filtered noise sweep
  const playWhoosh = useCallback(() => {
    if (mutedRef.current) return;
    const ctx = getCtx();
    const now = ctx.currentTime;
    const dur = 0.55;
    const bufSize = Math.floor(ctx.sampleRate * dur);
    const buffer  = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data    = buffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

    const src    = ctx.createBufferSource();
    src.buffer   = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type  = 'bandpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.linearRampToValueAtTime(280, now + dur);
    filter.Q.value = 1.4;
    const gain   = ctx.createGain();
    gain.gain.setValueAtTime(0.07, now);
    gain.gain.linearRampToValueAtTime(0, now + dur);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start(now);
  }, [getCtx]);

  const toggleMute = useCallback(() => {
    mutedRef.current = !mutedRef.current;
    setMuted(mutedRef.current);
    if (droneGainRef.current && ctxRef.current) {
      droneGainRef.current.gain.setTargetAtTime(
        mutedRef.current ? 0 : 0.038,
        ctxRef.current.currentTime,
        0.05,
      );
    }
  }, []);

  return { muted, toggleMute, startAmbient, playTransmission, playWhoosh };
}
