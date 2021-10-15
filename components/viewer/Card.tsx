import Image from 'next/image'
import jpeg from '../../public/adv.jpeg'

import { ICardData } from '../../lib/viewer/types'
import { rarityMap, rarityColorKey, toSentenceCase } from '../../lib/utils'

const Card = ({ card }: { card: ICardData }) => {
  return (
    <div
      className={`flex flex-col justify-between w-72 h-96 p-4 bg-background
      rounded-md shadow-xl border-4 border-${rarityColorKey(card.level)}`}
    >
      <div className="flex flex-col space-y-3 overflow-y-scroll no-scrollbar">
        <p className={``}>{card.name}</p>

        <div className="flex justify-center items-center" style={{ width: 248, backgroundColor: '#000000' }}>
          <Image src={jpeg} height={120} width={120} />
        </div>

        <p className={`text-${rarityColorKey(card.level)}`}>
          {rarityMap[card.level]} {toSentenceCase(card.type)}
        </p>
      </div>
    </div>
  )
}

export default Card
