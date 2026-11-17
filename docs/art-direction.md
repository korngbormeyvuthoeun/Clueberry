# Phase 1 art direction and provenance

The user selected the third supplied reference as the primary mood reference: green cabinetry, golden wood, cream details, terracotta accents, houseplants, and afternoon sunlight. References one and two inform dialogue presentation and readable interior depth. Reference images are not bundled or used as game textures.

Three original assets were created using the built-in imagegen tool:

- `public/assets/headquarters.png`: 1536 × 1024, warm detective room without embedded characters/UI.
- `public/assets/cast.png`: four characters, four directions each, transparent PNG. Player, Mira (mentor), Jun (student), Ada (librarian).
- `public/assets/walk.png`: sixteen player walk frames, four directions, transparent PNG derived from the original cast asset.

Exact prompts are in `asset-prompts.json`. ImageGen produced sprite dimensions different from the prompt's nominal grid dimensions, so `scripts/atlas.py` measures real alpha bounds per cell and exports frame metadata. Originals remain unchanged. Each sprite is sized consistently in the game.

Room coordinates use a 768 × 512 world. Furniture collision is authored in `src/content/headquarters.ts`. The playfield uses nearest-neighbor sampling and pixel rounding. UI text remains high-resolution for readability. The room's generated artwork has a denser pixel texture than the sprites; future reusable tiles should be standardized to an explicit authored pixel grid before the town phase.

The display-only third reference remains an inspiration only. No paid asset packs or externally sourced character art were used. The magnifying-glass favicon and UI line icons are original project code. Fraunces and DM Sans are used for interface typography; see font licenses if bundled locally.
