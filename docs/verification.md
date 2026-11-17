# Phase 1 verification

Checked on 2026-11-17 in the supplied Windows workspace.

## Automated checks

- 14 offline tests passed: briefing gates, duplicate collection, report evidence/logic, insufficient-evidence behavior, one-time rewards, save round trips, prior backups, corrupt-save recovery, invalid imports, blocked/quota-limited storage, unrelated-storage preservation, safe spawn recovery, and settings fallback.
- TypeScript checking passed.
- Production build passed. Phaser's engine chunk produces Vite's non-blocking size warning (about 340 kB compressed).

## Browser checks completed

Used the Codex in-app browser with a separate `localhost` test save from the `127.0.0.1` user preview.

- New-game introduction, typewriter reveal, dialogue continuation, and instant-text settings.
- Four-direction movement, camera tracking, directional sprites, desk collision, the corridor between chairs and desk, and crossing the room to Ada.
- Proximity prompts and E/Space interaction.
- Accepted the first case and inspected the original message and fictional button destination without navigating away.
- Reloaded mid-case and continued with two clues and the correct objective retained.
- Followed Jun's branching interview, recorded the statement, found the archived notice, and recorded Ada's independent verification.
- Approached the physical case board and opened the report.
- Submitted insufficient evidence, a genuine-message conclusion, an impersonation conclusion with missing evidence, and a correct conclusion with unsupported urgency-only reasoning. Each retained the active case and supplied appropriate feedback.
- Submitted the corroborated report successfully, then reloaded and continued. Verified all five clues, completed-case state, 50 XP, 10 reputation, and the pressed-leaf bookmark in the notebook.
- Inspected title, gameplay, evidence, and resolution layouts at the available desktop viewport sizes.
- No warning/error console entries were reported by the browser log tool during the checked playthrough.

## Limits and outstanding checks

The browser's download-event automation stalled and its control session subsequently timed out. Backup export/import file-dialog interaction and the new-game overwrite confirmation have not been fully certified in the browser. The underlying serialization, import validation, and backup recovery paths are covered by the offline tests. This limitation does not affect the verified ordinary local save/reload flow.

Exact mobile viewport, other browsers, audio playback on real speakers, reduced-motion visual review, and extended play sessions remain manual checks. Desktop keyboard gameplay is the Phase 1 target. The pixel-art room is an original generated background with authored collisions, not a completed modular environment tileset.

Phase 2 has not started. Do not describe the decorative pinboard as a draggable evidence system or the empty pet basket as an implemented companion.
