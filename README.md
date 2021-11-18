# @ryfylke-react/create-api-slice

## **Usage**

_slices/postSlice.ts_

```typescript
const initialState = {
  ...baseInitialState,
  state: 0,
  // 0 = IDLE
  // 1 = PENDING
  // 2 = FULFILLED
  // 3 = REJECTED
} as PostDescription;

// Type is inferred, but you can optionally supply
const postSlice = createAPISlice<PostDescription>({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPost.fulfilled, (state, { payload }) => {
        state.post = payload;
      })
      .addCase(getPost.rejected, (state) => {
        state.post = null;
      });
  },
});

export const postReducer = postSlice.reducer;
```

_slices/postThunks.ts_

```typescript
export const getPost = createAsyncThunk(
  `post/getPost:load`,
  async (slug: string, { rejectWithValue }) => {
    return axios
      .get<PostData[]>(
        `${API_URL}/wp-json/wp/v2/posts?_embed&slug=${slug}`
      )
      .then((res) => res.data[0])
      .catch((err) => rejectWithValue(err));
  }
);
```

Calling `dispatch(getPost("..."))` will automatically set the loading state to `1` (PENDING), which will again automatically change to `2` (FULFILLED) or `3` (REJECTED).

To simplify checking loading state, you can `import { StateStatus } from "@ryfylke-react/create-api-slice` and do something like this:

```typescript
// ...
import { StateStatus } from "@ryfylke-react/create-api-slice";

const App = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { state, post } = useSelector((state) => state.post);

    useEffect(() => {
        dispatch(getPost(id));
    }, []);

    if (state === StateStatus.REJECTED) {
        return "Error from server";
    }
    if (state === StateStatus.FULFILLED) {
        return (...);
    }
    return "Loading...";
}
```
