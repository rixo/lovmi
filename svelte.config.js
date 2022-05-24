import adapter from "@sveltejs/adapter-auto"

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
  kit: {
    adapter: adapter(),
    vite: {
      plugins: [LoadSecrets()],
    },
  },
}

export default config
