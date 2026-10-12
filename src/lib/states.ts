// The five brain states, in the app's order and with the app's exact wording
// (color_amplifly utils/storage.ts BRAIN_STATES). Change the app first, then this.
export type StateId = 'buzzing' | 'sharp' | 'flat' | 'foggy' | 'scattered';

export interface BrainState {
  id: StateId;
  label: string;
  description: string;
  bestFor: string[];
  protectFrom: string[];
}

export const STATES: BrainState[] = [
  { id: 'buzzing', label: 'Buzzing', description: 'Lots of energy, ideas firing, hard to sit still',
    bestFor: ['Creative work', 'Brainstorming', 'Recording ideas', 'Movement'], protectFrom: ['Long meetings', 'Detail work that needs precision'] },
  { id: 'sharp', label: 'Sharp', description: 'Clear, focused, the world feels organized',
    bestFor: ['Deep work', 'Hard problems', 'Writing', 'Big decisions'], protectFrom: ['Notifications', 'Context switches', 'Errands'] },
  { id: 'flat', label: 'Flat', description: 'Low energy, neutral, nothing pulling you',
    bestFor: ['Admin', 'Errands', 'Tidying', 'Low-stakes tasks', 'Walks'], protectFrom: ['Big decisions', 'Anything dopamine-dependent'] },
  { id: 'foggy', label: 'Foggy', description: 'Hard to think, words slow, body feels heavy',
    bestFor: ['Rest', 'One tiny win', 'Hydration + food', 'Comfort routines'], protectFrom: ['Forcing productivity', 'Self-judgment'] },
  { id: 'scattered', label: 'Scattered', description: 'Overwhelmed, too many tabs open in your head',
    bestFor: ['Grounding', 'One anchor task', 'Brain dump', 'Movement'], protectFrom: ['Adding more inputs', 'Long todo lists'] },
];

export const stateById = (id: string): BrainState => STATES.find(s => s.id === id) ?? STATES[0];

// Website-only line drawings for the states (the app itself shows emoji).
const rays = () => {
  let s = '<circle cx="24" cy="24" r="3.5" fill="currentColor" stroke="none"/><g class="g-rays">';
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4, c = Math.cos(a), n = Math.sin(a), r = i % 2 ? 15 : 19;
    s += `<line x1="${(24 + c * 10).toFixed(1)}" y1="${(24 + n * 10).toFixed(1)}" x2="${(24 + c * r).toFixed(1)}" y2="${(24 + n * r).toFixed(1)}"/>`;
  }
  return s + '</g>';
};
const dots = () => [[9, 12], [36, 9], [24, 22], [13, 33], [39, 30], [28, 39], [20, 8]]
  .map(([x, y], i) => `<circle class="g-dot" style="animation-delay:-${(i * 0.37).toFixed(2)}s" cx="${x}" cy="${y}" r="2.6" fill="currentColor" stroke="none"/>`).join('');

const BODY: Record<StateId, string> = {
  sharp: '<circle class="g-ring" cx="24" cy="24" r="19" opacity=".35"/><circle cx="24" cy="24" r="11"/><circle cx="24" cy="24" r="3.5" fill="currentColor" stroke="none"/>',
  buzzing: rays(),
  flat: '<line x1="6" y1="24" x2="42" y2="24" opacity=".45"/><circle class="g-slide" cx="10" cy="24" r="4" fill="currentColor" stroke="none"/>',
  foggy: '<g class="g-fog" fill="currentColor" stroke="none"><circle cx="17" cy="21" r="9" opacity=".45"/><circle cx="29" cy="27" r="10" opacity=".35"/><circle cx="26" cy="17" r="6" opacity=".5"/></g>',
  scattered: dots(),
};

export const glyph = (id: StateId, size = 48) =>
  `<svg class="glyph glyph--${id}" width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">${BODY[id]}</svg>`;
