# Under the hood

How does `rtk-query-loader` work _under the hood_?

## The underlying principles

1. We have a higher-order component (wrapper)
2. We aggregate the status of a collection of queries that are run through a hook
3. We conditionally render the appropriate states
4. We pass the data to the consumer-component through the use of `React.forwardRef`

### Can't I just build this myself?

Yes you can, the concept itself is quite simple. But making it properly type-safe can be difficult, and this package has been thoroughly tested and thought out. And we do offer some killer [features](../Features/index.md).

## Virtual DOM

Imagine you have this component, rendered through `withLoader`:

```tsx
const loader = createLoader({...});

const Component = withLoader((props, queries) => {...}, loader);

const App = () => {
    return (
        <div>
            <Component />
        </div>
    )
}
```

What actually ends up rendering in the virtual DOM is something like this:

```txt title="onLoading"
div
└── RTKLoader
    └── loader.onLoading(props)
```

```txt title="onError"
div
└── RTKLoader
    └── loader.onError(props, error)
```

```txt title="onFetching"
div
└── RTKLoader
    └── loader.onFetching(props, Component)
```

```txt title="onSuccess"
div
└── RTKLoader
    └── null
    └── Component (with data)
    └── null
```

```txt title="whileFetching"
div
└── RTKLoader
    └── loader.whileFetching.prepend()
    └── Component (with data)
    └── loader.whileFetching.append()
```

## RTKLoader

`RTKLoader` simply receives the loader and component, and handles returning the correct state depending on the query. You can take a look at how this component behaves [in the codebase](https://github.com/ryfylke-react-as/rtk-query-loader/blob/main/src/RTKLoader.tsx).
