import { http, HttpResponse, delay } from "msw";

const RESPONSE_DELAY = 100;

export const handlers = [
  http.get("https://google.com/pokemons", async () => {
    await delay(RESPONSE_DELAY);

    return HttpResponse.json(
      {
        results: [
          {
            name: "charizard",
          },
          {
            name: "pikachu",
          },
        ],
      },
      { status: 200 }
    );
  }),
  http.get(
    "https://google.com/pokemon/*",
    async ({ request }) => {
      const name = request.url.split("/").at(-1);
      await delay(RESPONSE_DELAY);
      if (name === "error") {
        return HttpResponse.error();
      }

      if (name === "delay") {
        await delay(100);
      }

      return HttpResponse.json(
        {
          name: name,
          id: name?.length,
        },
        { status: 200 }
      );
    }
  ),
];
