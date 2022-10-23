// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import { handlers } from "./mocks";
import { someApi, store } from "./store";

const server = setupServer(...handlers);
beforeAll(() => server.listen());
beforeEach(() => store.dispatch(someApi.util.resetApiState()));
afterEach(() => server.resetHandlers());
afterAll(() => {
  server.close();
});
