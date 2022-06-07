import * as db from "$lib/_db"

export const createOperation = async ({
  era,
  period,
  time,
  user,
  from,
  to,
  amount,
}) => {
  // console.log(">> op", {
  //   era,
  //   period,
  //   time,
  //   user,
  //   from,
  //   to,
  //   amount,
  // })
  // return
  await db.upsert({
    _id: `${era}/bank/transfert/${user}/${time}`,
    time,
    period: parseInt(period),
    from,
    to,
    amount: parseFloat(amount),
  })
}

export const transfert = async ({ era, period, from, to, amount }) => {
  const time = Date.now()

  const actualFrom = amount < 0 ? to : from
  const actualTo = amount < 0 ? from : to

  await createOperation({
    era,
    period,
    time,
    user: actualTo,
    from: actualFrom,
    to: actualTo,
    amount,
  })

  await createOperation({
    era,
    period,
    time,
    user: actualFrom,
    from: actualFrom,
    to: actualTo,
    amount: -1 * amount,
  })
}

export const getUserBalance = async (era, user) => {
  const { docs: ops } = await db.find({
    selector: {
      _id: {
        $gt: `${era}/bank/transfert/${user}/`,
        $lt: `${era}/bank/transfert/${user}/\uffff`,
      },
    },
    limit: 99999,
  })
  return ops.reduce((total, op) => total + parseFloat(op.amount), 0)
}
