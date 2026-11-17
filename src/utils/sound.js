const SOUND_KEY = 'kvarteri-sound';

let audioCtx = null;

export function isSoundEnabled(){
    try {
        return localStorage.getItem(SOUND_KEY) !== 'off';
    } catch {
        return true;
    }
}

export function setSoundEnabled(enabled){
    try {
        localStorage.setItem(SOUND_KEY, enabled ? 'on' : 'off');
    } catch { /* ignorera */ }
}

// Spelar ett kort "pling" (två toner) genererat med Web Audio, så ingen ljudfil behövs.
// Webbläsaren kräver att användaren interagerat med sidan innan ljud får spelas.
export function playPing(){
    if (!isSoundEnabled()) return;
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        audioCtx = audioCtx ?? new Ctx();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const start = audioCtx.currentTime;
        [[880, 0], [1318.5, 0.12]].forEach(([freq, offset]) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.0001, start + offset);
            gain.gain.exponentialRampToValueAtTime(0.25, start + offset + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, start + offset + 0.35);
            osc.connect(gain).connect(audioCtx.destination);
            osc.start(start + offset);
            osc.stop(start + offset + 0.4);
        });
    } catch { /* ljud är bara ett extra – ignorera fel */ }
}
