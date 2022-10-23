import { rest } from "msw";

const RESPONSE_DELAY = 600;

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
    return res(
      c.delay(RESPONSE_DELAY),
      c.status(200),
      c.json({
        name: req.params.name,
        id: req.params.name.length,
      })
    );
  }),
];
