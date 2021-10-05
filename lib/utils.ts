export const rarityMap: { [key: number]: string } = {
  0: 'Common',
  1: 'Rare',
  2: 'Legendary',
  3: 'Mythic',
}

export function rarityColorKey(level: number) {
  return rarityMap[level].toLowerCase()
}

export function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function isNumeric(num: any) {
  return !isNaN(num)
}

export function toSentenceCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function shuffle(arr: any[]) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
}
