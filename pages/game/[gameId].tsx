import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import { useDispatch, useSelector } from '../../lib/store'
import { useGame } from '../../lib/socket/useGame'
import { shortenAddress } from '@usedapp/core'
import { useWallet } from '../../lib/useWallet'

import { IAction } from '../../lib/newTypes'

import CardInHand from '../../components/game/CardInHand'
import CardOnBattlefield from '../../components/game/CardOnBattlefield'

const GamePage: NextPage = () => {
  const router = useRouter()
  const { gameId: pathGameId } = router.query

  const { game } = useGame()

  if (!game) {
    return (
      <div className="relative w-screen h-screen p-4">
        <div className="flex flex-col justify-center items-center h-full w-full ">No game yet...</div>
      </div>
    )
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

export default GamePage

function BattlefieldPanel() {
  const { game } = useGame()
  const cardsOnBattlefield = game.player.battlefield

  return (
    <div className={`flex flex-row flex-1 justify-center items-center gap-6`}>
      {cardsOnBattlefield.map((card, idx) => (
        <CardOnBattlefield key={idx} card={card} />
      ))}
    </div>
  )
}

function HandPanel() {
  const { game } = useGame()
  const cardsInHand = game.player.hand

  return (
    <div className="flex-1 flex flex-row justify-center gap-2">
      {cardsInHand.map((card, idx) => (
        <CardInHand key={idx} card={card} />
      ))}
    </div>
  )
}

function OpponentPanel() {
  const { game } = useGame()
  const opponent = game.opponent

  return (
    <div className="flex flex-col text-center gap-3 p-4 text-sm" style={{ width: '240px' }}>
      <p className="">test-opponent</p>
      <p className="">Life: {opponent.life}</p>
    </div>
  )
}

function PlayerPanel() {
  const { game } = useGame()
  const player = game.player
  const { ens } = useWallet()

  return (
    <div className="flex flex-col justify-end gap-3 p-4 text-sm">
      <p className="text-white">
        Mana:
        <span className="text-white mx-2">{player.mana}</span>
      </p>

      <div className="flex flex-col gap-2">
        <p className="">Life: {player.life}</p>

        <p className="">Library: {player.numberOfCardsInLibrary}</p>

        <p className="">Graveyard: {player.graveyard.length}</p>

        <p className="">
          <a className="underline">{ens ?? shortenAddress(game.player.address)}</a>
        </p>
      </div>
    </div>
  )
}

function GamePanel() {
  const { game, submitAction } = useGame()

  function handleClickSubmitAction(action: IAction) {
    submitAction(action)
  }

  return (
    <div className="flex flex-col justify-end items-end gap-3 p-4 text-sm">
      <div>
        {game.player.actions
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
    // dispatch(processStack())
  }

  return (
    <div className="flex flex-col items-end gap-4 p-4 text-sm">
      <p className="text-center">Stack</p>

      <div className="flex flex-col justify-end">
        {[...game.stack].reverse().map((stackItem, idx) => (
          <div key={idx} className="flex flex-row w-full gap-3">
            <p className="">{game.stack.length - idx - 1}</p>
            <p className="">
              {/* {game.players.find((player) => player.id === stackItem.controllerId)?.username} */}
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
