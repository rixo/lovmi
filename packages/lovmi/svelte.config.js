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
      prependData: '@import "src/vars.scss";',
    },
  }),
  hot: {
    optimistic: false,
  },
  kit: {
    adapter: adapter(),
    vite: {
      plugins: [LoadSecrets()],
      optimizeDeps: {
        ignore: ["@svouch/pouchdb"],
      },
    },
  },
}

export default config
