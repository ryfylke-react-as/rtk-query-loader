import { rest } from "msw";

const RESPONSE_DELAY = 100;

export const handlers = [
  rest.get("/pokemons", (req, res, c) => {
    return res(
      c.delay(RESPONSE_DELAY),
      c.status(200),
      c.json({
        results: [
          {
            name: "charizard",
          },
          {
            name: "pikachu",
          },
        ],
      })
    );
  }),
  rest.get("/pokemon/:name", (req, res, c) => {
    if (req.params.name === "error") {
      return res(c.delay(RESPONSE_DELAY), c.status(500));
    }
    if (req.params.name === "unprocessable") {
      return res(
        c.delay(RESPONSE_DELAY),
        c.status(422),
        c.json({ some_json_data: "woop" })
      );
    }
    const delay =
      req.params.name === "delay"
        ? RESPONSE_DELAY + 100
        : RESPONSE_DELAY;
    return res(
      c.delay(delay),
      c.status(200),
      c.json({
        name: req.params.name,
        id: req.params.name.length,
      })
    );
  }),
];
