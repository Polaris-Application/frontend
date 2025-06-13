# Colour Configurator – Implementation Plan

This plan translates the technical specification into concrete, ordered tasks.  
Follow the sections sequentially; each delivers a self-contained slice of functionality that unblocks the next.

---

## 0. Project Setup


1. Ensure `react-router` (or your router) and a global state solution (e.g. React context or Redux) are already in place.

---

## 1. Types & Validation Layer

1. Create `src/types/colourConfig.ts`
   • Define `Band`, `Config`.
2. Create `src/utils/colourConfig.ts`  
   • `validateConfig(cfg: Config): string[]` – returns array of error messages (empty = valid).  
   • `splitBand(band: Band): [Band, Band]` – used by **Add Band**.  
   • Helper: `generateDefaultConfig(): Config`.

---

## 2. Local-Storage Persistence

1. Create `src/utils/persistence.ts`
   • `const STORAGE_KEY = 'polaris.colourConfig';`  
   • `loadConfig(): Config` – fallback to defaults.  
   • `saveConfig(cfg: Config): void`.
2. Write unit tests for both functions (Vitest / Jest).

---

## 3. ColourConfigurator Root Component

File: `src/components/ColourConfigurator/index.tsx`

1. Props interface  
   ```ts
   interface Props {
     mode: 'strength' | 'quality';
     bands: Band[];
     onApply(cfg: Config): void;
     onClose?(): void;          // needed for modal
   }
   ```
2. Local state  
   • `draftConfig`, initialised from props.  
   • `errors: string[]`.
3. `handleChange` utilities to mutate `draftConfig` immutably.
4. `handleApply`
   • Validate → if ok, call `onApply(draftConfig)`.
5. Render logic  
   • Decide wrapper: collapsible panel vs. dialog (see §6).  
   • Inside, render `ModeSelector`, `BandsTable`, action bar.

---

## 4. Subcomponents

1. `ModeSelector.tsx`  
   • Radio-pill UI; updates `draftConfig.mode`.
2. `BandsTable/`  
   • `BandRow.tsx` – From, To, ColourSwatch, Label, Delete.  
   • Numeric inputs auto-adjust adjacent ranges to keep continuity.  
   • Delete is disabled if `bands.length === 2`.
3. `AddBandButton.tsx`  
   • Finds selected row → `splitBand` → inserts two new rows.
4. `ResetButton.tsx`  
   • Restores defaults via `generateDefaultConfig`.
5. `ApplyButton.tsx`  
   • Primary styling; disabled when `errors.length > 0`.

---

## 5. Responsive Containers & Animations

1. Desktop ≥ 641 px  
   • Place configurator inside `MapHeader` collapse panel.  
   • Use `height` CSS transition for smooth expand/collapse.
2. Mobile ≤ 640 px  
   • Use `<Dialog>` component (existing or `@headlessui/react`).  
   • Pin button row to bottom with `position: sticky`.
3. Gear icon toggles & passes `onClose` to configurator.

---

## 6. Dashboard Integration

1. In `DashboardCard` (or equivalent)  
   ```ts
   const [colourConfig, setColourConfig] = useState(loadConfig());
   ```
2. Gear button handler opens configurator with props `{ ...colourConfig }`.
3. `handleApply` callback  
   • `saveConfig(cfg); setColourConfig(cfg); closePanel();`
4. Pass `colourConfig` down to `<Map>`.

---

## 7. Map Component Updates

1. Accept prop `colourConfig: Config`.
2. Derive gradient once per change  
   ```ts
   const gradient = Object.fromEntries(
     colourConfig.bands.map((b, i, arr) => [i / (arr.length - 1), b.colour])
   );
   ```
3. Heat-map mode uses gradient lookup; point-map mode uses `band.colour` per marker.

---

## 8. Unit & Integration Tests

1. Validation edge cases (overlaps, gaps, wrong bounds).  
2. Persistence round-trip.  
3. Component renders (desktop & mobile), user flows:  
   • Add band → Apply → Map updates.  
   • Invalid input disables **Apply**.

---

## 9. Future-Proofing Hooks

1. Keep `validateConfig` extensible for logarithmic scales.  
2. Expose import/export helpers in `utils/persistence.ts`.

---

## 10. Done-Checklist

☐ All unit tests pass  
☐ ESLint / Prettier clean  
☐ Storybook stories for each component  
☐ Mobile & desktop UX verified  
☐ Default config equals spec §8  
☐ File `docs/ColorMappingSpec.md` removed 