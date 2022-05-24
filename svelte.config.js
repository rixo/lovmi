import adapter from "@sveltejs/adapter-auto"
import preprocess from "svelte-preprocess"

function LoadSecrets() {
  return {
    name: "load-secrets",
    configureServer: async () => {
      ;(await import("dotenv")).config()
    },
  }
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess({
    scss: {
      prependData: '@import "src/bulma.scss";',
    },
  }),
  kit: {
    adapter: adapter(),
    vite: {
      plugins: [LoadSecrets()],
    },
  },
}

export default config
