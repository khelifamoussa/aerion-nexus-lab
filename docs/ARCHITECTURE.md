# AERION NEXUS architecture

## Preservation contract
The current production Site remains the behavioral baseline. No production replacement is permitted until regression checks, visual review and scientific validation pass.

## Frontend layers
- `App.jsx`: navigation, workspaces and mission orchestration.
- `HangarScene.jsx`: isolated WebGL/R3F digital-twin renderer.
- `labData.js`: replaceable scientific registry and demo-state contract.
- `styles.css`: design tokens, adaptive layout and scientific 2D surfaces.

## Planned services
Research specification, simulation, evidence, manuscript, review and versioned storage are separate future service boundaries. Displayed results remain labelled as simulated evidence until real backend execution replaces them.

## Extensibility rules
1. Separate WebGL rendering from scientific state.
2. Keep agent outputs serializable and auditable.
3. Version every model, experiment and manuscript.
4. Never place provider secrets in browser code.
5. Add methods as registry modules, not hard-coded branches.
6. Preserve Scientific 2D mode for accessibility and lower-powered devices.
