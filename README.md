# @ryfylke-react/create-api-slice

## **Usage**

```bash
yarn add @ryfylke-react/create-api-slice
# or
npm i @ryfylke-react/create-api-slice
```

Create the slice as you normally would, but use our `createAPISlice` function instead of `createSlice` from redux toolkit. 

_slices/postSlice.ts_

```typescript
import {
  createAPISlice,
  StateStatus,
} from "@ryfylke-react/create-api-slice";

const initialState = {
  ...baseInitialState,
  state: StateStatus.IDLE,
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

Then, when you create thunks that require loading state, make sure to append `:load` to the thunk name. 

_slices/postThunks.ts_

```typescript
export const getPost = createAsyncThunk(
  `post/getPost:load`,
  async (slug: string, { rejectWithValue }) => {
    return axios
      .get<PostData[]>(`${API_URL}/posts?slug=${slug}`)
      .then((res) => res.data[0])
      .catch((err) => rejectWithValue(err));
  }
);
```

Calling `dispatch(getPost("..."))` will now automatically set the loading state to `1` (PENDING), which will again automatically change to `2` (FULFILLED) or `3` (REJECTED).

Here's how you'd implement this logic on the UI:

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

This unfortunately only supports **one** concurring loading state per slice. This means that if you call two async thunks that both have `:load` appended - they will both mutate the same loading state. 
