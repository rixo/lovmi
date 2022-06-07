import * as db from "$lib/_db"
import { transfert, getUserBalance } from "$lib/_db/bank"
import { userExists } from "$lib/_db/users"
import * as cookie from "cookie"

const authenticate = async (auth) => {
  const [name, password] = Buffer.from(auth.slice(6), "base64")
    .toString()
    .split(":")

  const res = await fetch(`${import.meta.env.VITE_USER_DB_HOST}/_session`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ name, password }),
  })

  if (res.ok) {
    return name.split("__").slice(2).join("__")
  }

  return null
}

const respond = (status, body) => {
  // const transfertId = Buffer.from(JSON.stringify(body)).toString("base64")
  const transfertId = btoa(
    JSON.stringify({
      success: status === 200,
      status,
      ...body,
    })
  )
  return {
    status: 303,
    headers: {
      location: `/my-account/transfert/${transfertId}`,
    },
  }
}

const handle = async ({ recipient: _recipient, allBalance, amount, auth }) => {
  try {
    if (!auth) {
      return {
        status: 401,
        body: {
          error: "unauthorized",
        },
      }
    }

    const user = await authenticate(auth)
    if (!user) {
      return {
        status: 403,
        body: {
          error: "invalid auth",
        },
      }
    }

    if (!_recipient) {
      return {
        status: 400,
        body: {
          error: "missing recipient",
        },
      }
    }

    if (!(allBalance || amount)) {
      return {
        status: 400,
        body: {
          error: "missing amount",
        },
      }
    }

    const settings = await db.get("$settings")
    const [era, period] = String(settings.current_era).split(".")

    const recipient = await userExists(_recipient, era)

    if (!recipient) {
      return respond(404, {
        message: `Utilisateur inconnu : ${recipient}.`,
      })
    }

    if (recipient === user) {
      return respond(409, {
        message: "Rien ne sert de transférer à soi-même. (Assez évident.)",
      })
    }

    const balance = await getUserBalance(era, user)

    const actualAmount = allBalance ? balance : amount

    if (actualAmount > balance) {
      return respond(403, {
        message: "Crédit insuffisant.",
      })
    }

    if (actualAmount === 0) {
      return respond(403, {
        message:
          "Opération stupide : vous avez demandé à transférer rien du tout.",
      })
    }

    await transfert({
      era,
      period,
      from: user,
      to: recipient,
      amount: actualAmount,
    })

    return respond(200, {
      recipient,
      amount: actualAmount,
    })
  } catch (err) {
    console.error("Unexpected error", err)
    return respond(500, {
      message:
        "Votre transfert a échoué pour une raison qui nous échappe totalement.",
    })
  }
}

const isCrsfAttackFixed = async () => {
  const settings = await db.get("$settings")
  return !!settings?.csrf_attack_fixed
}

const authFromCookie = (request) => {
  const cookies = cookie.parse(request.headers.get("cookie") || "")
  if (cookies["lovmi-user"]) return atob(cookies["lovmi-user"])
}

export async function get({ url, request }) {
  if (await isCrsfAttackFixed()) {
    return respond(405, {
      message: "Alerte ! Vous êtes victime d'une tentative de piratage !",
      hackAlert: true,
    })
  }

  const recipient = url.searchParams.get("recipient")
  const allBalance = url.searchParams.get("all") == "on"
  const amount = url.searchParams.get("amount")
  const auth = url.searchParams.get("auth") || authFromCookie(request)

  return handle({ recipient, allBalance, amount, auth })
}

export async function post({ request }) {
  const form = await request.formData()

  const recipient = form.get("recipient")
  const allBalance = form.get("all") === "on"
  const amount = form.get("amount")
  const auth = form.get("auth")

  return handle({ recipient, allBalance, amount, auth })
}
