# Under the hood

How does `rtk-query-loader` work _under the hood_?

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

## Custom `loaderComponent`

You could pass a custom `loaderComponent` to your loaders, if you'd like:

```typescript
const CustomLoader = (props: CustomLoaderProps) => {
  // Handle rendering
};

const loader = createLoader({
  loaderComponent: CustomLoader,
  // ...
});
```

This allows you to have really fine control over how the rendering of components using `withLoader` should work.
