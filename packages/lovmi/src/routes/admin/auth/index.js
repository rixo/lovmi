import { validateToken, generateAdminToken } from "$lib/admin/auth"

const { ADMIN_PASSWORD } = process.env

export async function post({ request }) {
  const data = await request.json()

  if (data.token) {
    if (await validateToken(data.token)) {
      return {
        status: 200,
        body: {
          token: await generateAdminToken(),
        },
      }
    }
  }

  if (data.password) {
    if (data.password === ADMIN_PASSWORD) {
      return {
        status: 200,
        body: {
          token: await generateAdminToken(),
        },
      }
    }
  }

  return {
    status: 401,
    body: {
      message: `Mot de passe incorrect`,
    },
  }
}
