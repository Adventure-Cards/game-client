import Image from 'next/image'
import jpeg from '../public/adv.jpeg'

import { ICardData } from '../lib/getCardData'
import { rarityMap } from '../lib/utils'

const Card = ({ card, idx }: { card: ICardData; idx: number }) => {
  return (
    <div
      className={`flex flex-col justify-between w-72 h-96
      p-4 bg-background rounded-md shadow-xl border-4 border-${rarityMap[card.level].toLowerCase()}`}
    >
      <div className="flex flex-col space-y-3 overflow-y-scroll">
        <p className={``}>{card.name}</p>

        <div className="flex justify-center items-center" style={{ width: 256, backgroundColor: '#000000' }}>
          <Image src={jpeg} height={150} width={150} />
        </div>

        <p className={`text-${rarityMap[card.level].toLowerCase()}`}>
          {rarityMap[card.level]} {card.type.charAt(0).toUpperCase() + card.type.slice(1)}
        </p>

        {card.effect && <p>{card.effect}</p>}

        {/* @ts-ignore */}
        {card.specialEffect && <p>{card.specialEffect}</p>}
      </div>

      <div className="flex flex-row justify-end">
        {card.type === 'creature' && (
          <p>
            {card.attack}/{card.defense}
          </p>
        )}
        {/* @ts-ignore */}
        {card.type === 'artifact' && (card.attack > 0 || card.defense > 0) && (
          <p>
            +{card.attack}/+{card.defense}
          </p>
        )}
      </div>
    </div>
  )
}

export default Card
