import { derived } from "svelte/store"

import { gateway } from "$lib/api"
import { user } from "$lib/api/user"

export const myBankAccount = derived(
  [gateway.bankOperations, user],
  ([$allOperations, $user]) => {
    if (!$user) {
      return {
        operations: [],
        balance: 0,
      }
    }

    const operations = $allOperations.filter((op) => {
      const user = op._id.split("/")[3]
      return user === $user.id
    })

    const balance = operations.reduce(
      (total, op) => total + parseFloat(op.amount),
      0
    )

    return { operations, balance }
  }
)
