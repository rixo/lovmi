import jwt from "jsonwebtoken"

const { ADMIN_PASSWORD, JWT_SECRET } = process.env

const SCOPE = "lovmi.admin"

export const generateAdminToken = async () => {
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

export const validateToken = async (token) => {
  if (!token) {
    return false
  }
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, { subject: SCOPE }, (err, decoded) => {
      if (err) resolve(false)
      else resolve(!!decoded)
    })
  })
}

const validateRequestAuth = async (request) => {
  const auth = request.headers.get("authorization")
  if (!auth) return false
  if (!auth.startsWith("Bearer ")) return false
  const token = auth.slice("Bearer ".length)
  return await validateToken(token)
}

export const authGuard = async (request, handler) => {
  const authorized = await validateRequestAuth(request)
  if (authorized) {
    return await handler()
  } else {
    return {
      status: 401,
      body: {
        message: "Unauthorized",
      },
    }
  }
}
