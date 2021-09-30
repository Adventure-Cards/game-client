import Link from 'next/link'

import { rarityColorKey } from '../lib/utils'
import { IDeck } from '../lib/types'
import * as CSS from 'csstype'

const containerStyle: CSS.Properties = {
  position: "relative",
};

const deckIdStyle: CSS.Properties = {
  position: "absolute",
  right: "20px",
  top: "20px",
};

const DeckPreview = ({ deck, images }: { deck: IDeck, images: any }) => {
  return (
    <Link href={`/deck/${deck.id}`}>
      <div className="flex flex-col w-96 justify-between p-4 bg-background rounded-md shadow-xl cursor-pointer ease-in-out duration-200 transform hover:rotate-2 hover:scale-95">
       <div style={containerStyle}>
         <span style={deckIdStyle}>#{deck.id}</span>
         <div dangerouslySetInnerHTML={{__html: images[deck.id]}}/>
       </div>
      </div>
    </Link>
  )
}

export default DeckPreview
