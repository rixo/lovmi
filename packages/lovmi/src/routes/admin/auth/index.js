import jwt from "jsonwebtoken"

const { ADMIN_PASSWORD, JWT_SECRET } = process.env

const SCOPE = "lovmi.admin"

const generateAdminToken = async () => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {},
      JWT_SECRET,
      {
        expiresIn: "1d",
        subject: SCOPE,
      },
      (err, token) => {
        if (err) reject(err)
        else resolve(token)
      }
    )
  })
}

const validateToken = async (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, { subject: SCOPE }, (err, decoded) => {
      if (err) resolve(false)
      else resolve(!!decoded)
    })
  })

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
