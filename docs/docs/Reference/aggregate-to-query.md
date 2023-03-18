---
sidebar_position: 6
---

# aggregateToQuery

Aggregates a set of `UseQueryResult` into a single query.

```typescript
import {
  aggregateToQuery,
  UseQueryResult,
} from "@ryfylke-react/rtk-query-loader";

const queries = [
  useQueryOne(),
  useQueryTwo(),
  useQueryThree(),
] as const;

const query: UseQueryResult<unknown> = {
  ...aggregateToQuery(queries),
  data: queries.map((query) => query.data),
};
```

:::caution
`aggregateToQuery` does not add any `data` to the resulting query. You will have to do that manually afterwards.
:::
