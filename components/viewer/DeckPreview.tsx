import Link from 'next/link'

import { IDeck } from '../../lib/viewer/types'

const DeckPreview = ({ deck, images }: { deck: IDeck; images: any }) => {
  return (
    <Link href={`/deck/${deck.mintId}`}>
      <div className="flex flex-col w-96 justify-between p-4 bg-background rounded-md shadow-xl cursor-pointer">
        <div className="relative">
          <span className="absolute top-5 right-5">#{deck.mintId}</span>
          <div dangerouslySetInnerHTML={{ __html: images[deck.mintId] }} />
        </div>
      </div>
    </Link>
  )
}

export default DeckPreview
