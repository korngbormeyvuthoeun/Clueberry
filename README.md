# Clueberry — Internet Detective

A cozy pixel-art detective RPG about listening carefully, comparing evidence, and helping your neighbors. Phase 1 takes place in a sunlit Digital Defense Bureau headquarters and includes one complete investigation: **The Suspicious Message**.

## Run locally

Use Node.js 22.13+ and npm:

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:4173/`. Keep the same address when returning: `localhost` and `127.0.0.1` have separate browser saves. No API key, account, database, or backend is required.

```sh
npm test          # Investigation and persistence tests
npm run typecheck
npm run build    # Validates TypeScript and produces dist/
npm run preview  # Serves the production build; stop dev first
```

## Play

| Control | Action |
| --- | --- |
| WASD / arrow keys | Move in four directions |
| E / Space | Interact with a nearby character or object |
| J | Open the field notebook |
| Escape | Close a panel or pause |
| Space / Enter during typewriter text | Reveal the current line |
| Mouse / Tab / Enter | Navigate menus and dialogue choices |

Start a new story, meet Mira, and approach the computer on the left side of the desk. Accept Jun’s case. Inspect the message and its button, interview Jun and Ada, and find the original notice on the left reference shelf. Use the case board or notebook to prepare a supported report. The game has no time pressure.

The report checks the evidence and reasoning together. Unsupported conclusions offer feedback and keep the case open. The insufficient-evidence option lets you continue investigating. A supported report awards XP, reputation, and a keepsake once; you may keep exploring afterward.

## Saves

Progress is saved after discoveries and case changes, every 15 seconds while exploring, when pausing, and when leaving the page where the browser permits it. Pause also provides manual Save, Export backup, and Import backup. Importing and starting a new game require confirmation before replacing progress.

Saves contain the schema version, position and facing, tutorial progress, case state, collected/inspected evidence, inventory, XP, reputation, report, and elapsed play time. Only compact state is stored, never image data or Phaser objects. The previous valid save is retained as a recovery backup. A damaged primary save falls back to that backup; unsupported versions and malformed imports are rejected. Storage errors are visible and do not report false success.

Browser storage is local to an origin and profile, can be disabled, and may be erased by browser cleanup/private browsing. Export a JSON backup to keep a portable copy. Settings are saved separately.

## Architecture

- **Phaser 3.90.0**: scene, camera, sprite frames, Arcade Physics, collision tilemap boundary, furniture bodies, proximity interactions, and ambient animation.
- **TypeScript**: typed content, pure investigation logic, validation, and persistence.
- **Vite**: local development and static production build.
- **HTML/CSS**: keyboard-accessible paper-style dialogue, notebook, evidence inspection, report, and settings. UI input locks world movement.
- **Web Audio**: locally synthesized, optional discovery/UI notes. Full music is deferred.

```text
src/
  content/       Case definitions, evidence, headquarters layout
  domain/        Serializable state, report logic, save validation
  game/          Phaser headquarters and optional audio
  ui/            Reusable panel, dialogue, focus, and icon helpers
  main.ts        Application flow and UI/world coordination
  style.css      Responsive visual design
public/assets/   Original generated room and transparent sprite atlases
scripts/         Non-destructive sprite-bound measurement
tests/           Investigation, save, and collision-spawn tests
docs/            Art provenance, implementation notes, verification
```

### Art pipeline

The headquarters uses an original pre-rendered room illustration with separately authored collision footprints and interaction points. Characters are separate transparent directional/animation sprites. A foreground crop provides desk occlusion; it shares the original room texture. A Phaser tilemap supplies a room boundary; furniture uses precise rectangle bodies. This is not yet a complete reusable Tiled environment tileset/editor pipeline. That expansion belongs to the town/world phase.

Generated source PNGs are preserved unchanged. `public/assets/frames.json` describes measured transparent bounds for 32 frames. To regenerate frame metadata, install Pillow in your Python environment and run `python scripts/atlas.py`; the script never changes the images. See `docs/art-direction.md` and `docs/asset-prompts.json` for provenance and prompts.

### Development rules

Keep new story data separate from rendering. Use stable evidence identifiers and extend save validation/migrations when changing the schema. Do not persist engine objects. Run the offline tests and production build after logic changes; then play through affected interactions in the browser. Development builds expose a read-only `window.__clueberry.snapshot()` diagnostic and a canvas position attribute; neither is included in production.

## Scope and next phases

Phase 1 includes the title screen, opening, furnished headquarters, directional movement and walk animation, collision/camera, nine interaction points, three NPC conversations, five clues, notebook/inventory, report and resolution, and local save/load with backup import/export.

Phase 2 has **not** started. Draggable evidence cards, typed clue connections, and deeper deduction mechanics are planned next. Town travel and additional cases are later phases. The pet basket is scenery; a companion, decoration placement, relationship progression, seasons, ranks/achievements, and multiple endings are not implemented yet. Menus adapt to smaller screens, but gameplay currently requires a keyboard and is desktop-first.

All case organizations, people, addresses, currency, and messages are fictional. The `.invalid` addresses are displayed as evidence and never visited. No real messages, accounts, payment data, or browsing history are accessed.
