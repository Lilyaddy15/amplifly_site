// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import netlify from "@astrojs/netlify";

export default defineConfig({
  // The canonical origin. Astro.site is used for canonical URLs, Open Graph, JSON-LD and the sitemap.
  site: "https://amplifly.me",
  output: "static",
  integrations: [tailwind()],
  adapter: netlify(),
});
