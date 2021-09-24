import Link from 'next/link'

import { rarityColorKey } from '../lib/utils'
import { IDeck } from '../lib/types'
import images from '../data/images'

const containerStyle = {
  position: "relative",
};

const deckIdStyle = {
  position: "absolute",
  right: "20px",
  top: "20px",
};

const DeckPreview = ({ deck }: { deck: IDeck }) => {
  return (
    <Link href={`/deck/${deck.id}`}>
      <div className="flex flex-col w-96 justify-between p-4 bg-background rounded-md shadow-xl cursor-pointer">
       <div style={containerStyle}>
         <span style={deckIdStyle}>#{deck.id}</span>
         <div dangerouslySetInnerHTML={{__html: images[deck.id]}}/>
       </div>
      </div>
    </Link>
  )
}

export default DeckPreview
