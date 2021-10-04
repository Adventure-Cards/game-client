import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import {
  useDispatch,
  useSelector,
  startGame,
  updateDeckId,
  submitAction,
  processStack,
} from '../../lib/store'
import { useCardsForDeck } from '../../lib/useCardsForDeck'

import { IAction, CardLocation } from '../../lib/game/types'

import CardInHand from '../../components/game/CardInHand'
import CardOnBattlefield from '../../components/game/CardOnBattlefield'

import { useDrop } from 'react-dnd'

const PlayPage: NextPage = () => {
  const router = useRouter()
  const { deckId: pathDeckId } = router.query

  const dispatch = useDispatch()
  const game = useSelector((state) => state.game.game)

  const { data: deck, fetch } = useCardsForDeck()

  useEffect(() => {
    // when the path changes (by user or when it becomes defined)
    // kick off the fetch function
    const pathDeckIdAsNumber = Number(pathDeckId)
    dispatch(updateDeckId(pathDeckIdAsNumber))
    fetch(pathDeckIdAsNumber)
  }, [pathDeckId])

  function handleStartGame() {
    dispatch(startGame(deck))
  }

  useEffect(() => {
    if (game && game.opponentLife < 0) {
      alert('you win!')
    }
  }, [game])

  if (!deck) {
    return <div className="relative w-screen h-screen p-4" />
  }

  if (window && window.innerWidth < 768) {
    return (
      <div className="relative w-screen h-screen p-4">
        <div className="flex flex-col justify-center items-center h-full w-full ">
          Please visit on desktop to play!
        </div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="relative w-screen h-screen p-4">
        <div className="flex flex-col justify-center items-center h-full w-full ">
          <button className="px-6 py-4 bg-gold border border-gray-200" onClick={handleStartGame}>
            Start Game
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="relative w-screen h-screen p-4">
        <div className="flex flex-col h-full w-full">
          <div className="flex flex-1">
            <BattlefieldPanel />
          </div>

          <div className="flex flex-row">
            <HandPanel />
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 z-20">
        <StackPanel />
      </div>

      <div className="absolute bottom-0 left-0 z-20">
        <PlayerPanel />
      </div>

      <div className="absolute bottom-0 right-0 z-20">
        <GamePanel />
      </div>

      <div className="absolute top-0 z-20" style={{ right: 'calc(50vw - 120px)' }}>
        <OpponentPanel />
      </div>
    </>
  )
}

export default PlayPage

function BattlefieldPanel() {
  const cardsOnBattlefield = useSelector((state) =>
    state.game.game.players[0].deck.filter((card) => card.location === CardLocation.BATTLEFIELD)
  )

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'CARD',
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))

  return (
    <div ref={drop} className={`flex flex-row flex-1 justify-center items-center gap-6 ${isOver ? '' : ''}`}>
      {cardsOnBattlefield.map((card, idx) => (
        <CardOnBattlefield key={idx} card={card} />
      ))}
    </div>
  )
}

function HandPanel() {
  const cardsInHand = useSelector((state) =>
    state.game.game.players[0].deck.filter((card) => card.location === CardLocation.HAND)
  )

  return (
    <div className="flex-1 flex flex-row justify-center gap-2">
      {cardsInHand.map((card, idx) => (
        <CardInHand key={idx} card={card} />
      ))}
    </div>
  )
}

function OpponentPanel() {
  const game = useSelector((state) => state.game.game)

  return (
    <div className="flex flex-col text-center gap-3 p-4 text-sm" style={{ width: '240px' }}>
      <p className="">test-opponent</p>
      <p className="">Life: {game.opponentLife}</p>
    </div>
  )
}

function PlayerPanel() {
  const game = useSelector((state) => state.game.game)
  const deckId = useSelector((state) => state.app.deckId)

  return (
    <div className="flex flex-col justify-end gap-3 p-4 text-sm">
      <p className="text-white">
        Mana:
        <span className="text-white mx-2">{game.players[0].manaPool.white}</span>
        <span className="text-blue-600 mx-2">{game.players[0].manaPool.blue}</span>
        <span className="text-black mx-2">{game.players[0].manaPool.black}</span>
        <span className="text-red-700 mx-2">{game.players[0].manaPool.red}</span>
        <span className="text-green-700 mx-2">{game.players[0].manaPool.green}</span>
      </p>

      <div className="flex flex-col gap-2">
        <p className="">Life: {game.players[0].life}</p>

        <p className="">
          Library: {game.players[0].deck.filter((card) => card.location === CardLocation.LIBRARY).length}
        </p>

        <p className="">
          Graveyard: {game.players[0].deck.filter((card) => card.location === CardLocation.GRAVEYARD).length}
        </p>

        <p className="">
          <Link href={`/deck/${deckId}`}>
            <a className="underline">{game.players[0].username}</a>
          </Link>
        </p>
      </div>
    </div>
  )
}

function GamePanel() {
  const dispatch = useDispatch()
  const game = useSelector((state) => state.game.game)

  function handleClickSubmitAction(action: IAction) {
    dispatch(submitAction(action))
  }

  return (
    <div className="flex flex-col justify-end items-end gap-3 p-4 text-sm">
      <div>
        {game.players[0].availableActions
          .filter((action) => action.type === 'PRIORITY_ACTION')
          .map((action, idx) => (
            <div key={idx} className="flex flex-col justify-center">
              <button
                className="px-2 py-1 bg-gold border border-gray-200 text-base"
                onClick={() => handleClickSubmitAction(action)}
              >
                Next Phase
              </button>
            </div>
          ))}
      </div>
      <div className="flex flex-row items-center gap-4">
        <div className="flex flex-col text-center">
          <p>Turn</p>
          <p>{game.turn}</p>
        </div>

        <div className="flex flex-col text-center">
          <p>Phase</p>
          <p>{game.phase}</p>
        </div>
      </div>
    </div>
  )
}

function StackPanel() {
  const dispatch = useDispatch()
  const game = useSelector((state) => state.game.game)

  function handleClickProcessStack() {
    dispatch(processStack())
  }

  return (
    <div className="flex flex-col items-end gap-4 p-4 text-sm">
      <p className="text-center">Stack</p>

      <div className="flex flex-col justify-end">
        {[...game.stack].reverse().map((stackItem, idx) => (
          <div key={idx} className="flex flex-row w-full gap-3">
            <p className="">{game.stack.length - idx - 1}</p>
            <p className="">
              {game.players.find((player) => player.id === stackItem.controllerId)?.username}
            </p>
            <p className="">{stackItem.effectItem.effect.type}</p>
          </div>
        ))}
      </div>

      {game.stack.length > 0 && (
        <button
          className="px-2 py-1 bg-gold border border-gray-200 text-base"
          onClick={handleClickProcessStack}
        >
          Process Stack
        </button>
      )}
    </div>
  )
}
