# Provider JSON Import

Compass Ultra supports JSON workspace import, provider-shaped flag imports, and read-only backend proxy sync for selected providers.

## Recommended Flow

1. Export flags from your provider.
2. Import the JSON into Compass Ultra.
3. Review detected fields.
4. Run a release risk check.
5. Save a snapshot or export evidence.

## Provider Roadmap

- LaunchDarkly read-only sync
- Unleash read-only sync
- Flagsmith environment flag sync
- Statsig gates
- Firebase Remote Config templates
- OpenFeature-shaped JSON import

OpenFeature is a vendor-neutral SDK/specification rather than a hosted provider account. Compass Ultra can import OpenFeature-style flag JSON and generate SDK handoff evidence, but live sync still happens through the underlying provider such as LaunchDarkly, Unleash, Flagsmith, Statsig, or Firebase.
