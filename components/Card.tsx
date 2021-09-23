import Image from 'next/image'
import jpeg from '../public/adv.jpeg'

import { getCardData } from '../lib/getCardData'

const rarityMap: { [key: number]: string } = {
  0: 'Common',
  1: 'Rare',
  2: 'Legendary',
  3: 'Mythic',
}

const Card = ({ card, idx }: { card: string; idx: number }) => {
  const cardData = getCardData(card)

  if (!cardData) {
    return null
  }

  return (
    <div className="flex flex-col justify-between w-72 h-96 p-4 bg-background rounded-md shadow-xl">
      <div className="flex flex-col space-y-3 overflow-y-scroll">
        <p className={``}>{cardData.name}</p>

        <div className="flex justify-center items-center" style={{ width: 256, backgroundColor: '#000000' }}>
          <Image src={jpeg} height={150} width={150} />
        </div>

        <p className={`text-${rarityMap[cardData.level].toLowerCase()}`}>
          {rarityMap[cardData.level]} {cardData.type.charAt(0).toUpperCase() + cardData.type.slice(1)}
        </p>

        {cardData.effect && <p>{cardData.effect}</p>}

        {/* @ts-ignore */}
        {cardData.specialEffect && <p>{cardData.specialEffect}</p>}
      </div>

      <div className="flex flex-row justify-end">
        {cardData.type === 'creature' && (
          <p>
            {cardData.attack}/{cardData.defense}
          </p>
        )}
        {/* @ts-ignore */}
        {cardData.type === 'artifact' && (cardData.attack > 0 || cardData.defense > 0) && (
          <p>
            +{cardData.attack}/+{cardData.defense}
          </p>
        )}
      </div>
    </div>
  )
}

export default Card
