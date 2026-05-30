import { create } from 'zustand';

// ─── Pomodoro modes ───────────────────────────────────────────────────────────
export const TIMER_MODES = {
  FOCUS:       { label: 'Focus',       seconds: 25 * 60, color: '#6C63FF' },
  SHORT_BREAK: { label: 'Short Break', seconds:  5 * 60, color: '#4CAF82' },
  LONG_BREAK:  { label: 'Long Break',  seconds: 15 * 60, color: '#FF6584' },
};

const useTimerStore = create((set, get) => ({
  // ─── State ──────────────────────────────────────────────────────────────────
  mode:            'FOCUS',        // 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK'
  secondsLeft:     TIMER_MODES.FOCUS.seconds,
  isRunning:       false,
  sessionCount:    0,              // completed Pomodoros this session
  selectedSubject: null,           // { id, name }

  // ─── Actions ────────────────────────────────────────────────────────────────

  setMode: (mode) => {
    const { isRunning } = get();
    if (isRunning) return;        // don't switch while running
    set({
      mode,
      secondsLeft: TIMER_MODES[mode].seconds,
      isRunning: false,
    });
  },

  setSubject: (subject) => set({ selectedSubject: subject }),

  tick: () => {
    const { secondsLeft } = get();
    if (secondsLeft > 0) {
      set({ secondsLeft: secondsLeft - 1 });
    } else {
      // Timer finished
      set((state) => ({
        isRunning:    false,
        sessionCount: state.mode === 'FOCUS' ? state.sessionCount + 1 : state.sessionCount,
      }));
    }
  },

  start:  () => set({ isRunning: true }),
  pause:  () => set({ isRunning: false }),

  reset: () => {
    const { mode } = get();
    set({
      secondsLeft: TIMER_MODES[mode].seconds,
      isRunning:   false,
    });
  },

  // Called after a Pomodoro completes and session is saved
  completeFocus: () => {
    set((state) => ({
      sessionCount: state.sessionCount + 1,
      isRunning:    false,
      secondsLeft:  TIMER_MODES['FOCUS'].seconds,
    }));
  },

  resetAll: () => set({
    mode:            'FOCUS',
    secondsLeft:     TIMER_MODES.FOCUS.seconds,
    isRunning:       false,
    sessionCount:    0,
    selectedSubject: null,
  }),
}));

export default useTimerStore;
