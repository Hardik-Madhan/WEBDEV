// ==============================================================================
//  CARESURE - ABOUT PAGE DATA & LOGIC
//  File: app/about/about.data.ts
//  Purpose: Stores structured data and core guiding principles for the About page
// ==============================================================================

import { HeartHandshake, ShieldCheck, UsersRound, type LucideIcon } from "lucide-react"

export type Principle = {
  icon: LucideIcon
  title: string
  text: string
}

/** Core guiding values rendered on the About page */
export const principles: Principle[] = [
  {
    icon: ShieldCheck,
    title: "Safety comes first",
    text: "Profiles in this prototype are not verified, and example reviews are illustrative.",
  },
  {
    icon: HeartHandshake,
    title: "Care is personal",
    text: "Every family and caretaker is different. We make it easier to compare support and find a good fit.",
  },
  {
    icon: UsersRound,
    title: "Communities matter",
    text: "Care works best close to home. CareSure helps families discover local support in their community.",
  },
]
