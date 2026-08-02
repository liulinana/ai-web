import { ICONS } from '../assets'

export type SightCard = {
  ariaLabel: string
  kicker: string
  title: string
  body: string
  pin: string
}

export const sights: SightCard[] = [
  {
    ariaLabel: 'Open Stari Most card',
    kicker: 'Old Bridge',
    title: 'Stari Most',
    body: "The stone arch over the Neretva and Mostar's main landmark.",
    pin: ICONS.icon1,
  },
  {
    ariaLabel: 'Open Kujundziluk card',
    kicker: 'Bazaar Street',
    title: 'Kujundziluk',
    body: 'Copper shops, souvenirs, and the old bazaar lane by the bridge.',
    pin: ICONS.icon2,
  },
  {
    ariaLabel: 'Open Koski Mehmed Pasha Mosque card',
    kicker: 'Viewpoint',
    title: 'Koski Mehmed Pasha Mosque',
    body: 'A classic minaret view back toward Stari Most and the river.',
    pin: ICONS.icon3,
  },
  {
    ariaLabel: 'Open Kajtaz House card',
    kicker: 'Ottoman House',
    title: 'Kajtaz House',
    body: "A preserved residential house showing Mostar's Ottoman layers.",
    pin: ICONS.icon1,
  },
  {
    ariaLabel: 'Open War Photo Exhibition card',
    kicker: 'Museum',
    title: 'War Photo Exhibition',
    body: "A compact, moving stop for context on the city's recent history.",
    pin: ICONS.icon2,
  },
]
