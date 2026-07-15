# Stores

Zustand stores holding UI state (not business state — that lives natively per ADR-002). Screens and components read from here; writes typically originate from `services/` reacting to bridge events.
