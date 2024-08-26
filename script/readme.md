# Library to be imported
Scripts under this area, are library features to be imported for tracking.

## Tracking architecture


### Concepts

- **interLayer**: an instance that is triggered at client events, pass it through subscribers with common variables. It handles a queued event log (defaults `dataLayer` of GTM) and an anchor element (defaults `document`).
- **subscriber**: single tracker-oriented subscriber that'll send pixels at corresponding interLayer events. Either one of types - External library based, Raw pixel sending. interLayer *DOES NOT* holds registered subscriber list, it rather only cares *publishing* events. How to handle the event is *ONLY UP TO* its subscriber.
- **common**: utility features that be used for common. `assert` (error handling), `until` (promised conditional await), `project` (object projection mapping), etc.

### Working Environment

It supports 2 types of running modes: `GTM`([Google Tag Manager](https://tagmanager.google.com)) and `Raw`(vanila.js) mode.

- **In case of GTM**, interLayer takes advantage of `dataLayer` and GTM trigger-tag loop. Features and instances that are used in common set in dataLayer variables. Each `interLayer` pub event will fire `trx.mux` templated event tag, `trx.sub.${sub_id}.${event}`.
- **In case of Raw**, each features and subscriber settings would be loaded asyncronously. It can sustain the name `dataLayer` for an interLayer queue, but it's basiscally different what it was in GTM. Because raw environment does not have dataLayer trigger-tag feature, it rather orchestrates `anchor` HTMLElement's event `listener-handler` feature instead.

### How it works






