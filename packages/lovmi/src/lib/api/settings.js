import { derived } from "svelte/store"

import { gateway } from "$lib/api"

export const {
  //
  leaderboardEnabled,
  isLeaderboardEnabled,
  getCurrentEra,
  era,
} = gateway

const { settings } = gateway

export const xssAttackFixed = derived(
  settings,
  ($settings) => $settings?.xss_attack_fixed
)
