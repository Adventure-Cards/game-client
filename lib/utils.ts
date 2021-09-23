export const rarityMap: { [key: number]: string } = {
  0: 'Common',
  1: 'Rare',
  2: 'Legendary',
  3: 'Mythic',
}

export function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}
