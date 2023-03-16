---
sidebar_position: 2
---

# What problem does this solve?

Handling the loading and error state of components that depend on external data can be very tedious,
especially when you are managing multiple queries. RTK Query Loader aims to help you solve these issues by letting you create composable loaders that you can move out of the presentational components.

- [x] Isolate the data-loading code away from the presentational components
- [x] Increased type certainty
  - 🔥 Way less optional chaining in your components
  - 🔥 You write the components as if the data is already present
- [x] Composability
  - ♻️ Extend existing loaders
  - ♻️ Overwrite only select properties
- [x] Full control
  - 🛠️ Loading/error states
  - 🛠️ Custom loader-component
  - 🛠️ Control defer behaviour
