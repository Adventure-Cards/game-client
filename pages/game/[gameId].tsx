import type { NextPage } from 'next'
import { useEffect } from 'react'

import { useGameConnection } from '../../lib/socket/useGameConnection'
import { useGame } from '../../lib/socket/useGame'
import { useWallet } from '../../lib/useWallet'
import { shortenAddress } from '@usedapp/core'

import { IAction } from '../../lib/newTypes'

import CardInHand from '../../components/game/CardInHand'
import CardOnBattlefield from '../../components/game/CardOnBattlefield'

const GamePage: NextPage = () => {
  // 1) useGameConnection handles the logic of joining the game "room"
  // and processing game state updates (which updates the redux store)
  // 2) children should use the useGame hook to read game state data
  useGameConnection()

  const { game } = useGame()

  if (!game) {
    return (
      <div className="relative w-screen h-screen p-4">
        <div className="flex flex-col justify-center items-center h-full w-full ">Loading</div>
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
          <div className="flex flex-row">
            <OpponentHandPanel />
          </div>

          <div className="flex flex-1">
            <BattlefieldPanel />
          </div>

          <div className="flex flex-row">
            <HandPanel />
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 z-20">
        <OpponentPanel />
      </div>

      <div className="absolute top-0 right-0 z-20">
        <OpponentGamePanel />
      </div>

      <div className="absolute bottom-0 left-0 z-20">
        <PlayerPanel />
      </div>

      <div className="absolute bottom-0 right-0 z-20">
        <PlayerGamePanel />
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

function OpponentHandPanel() {
  const { game } = useGame()
  const opponent = game.opponent

  return (
    <div className="flex-1 flex flex-row justify-center gap-2">
      {[...new Array(opponent.numberOfCardsInHand)].map((card, idx) => (
        <p>CARD</p>
      ))}
    </div>
  )
}

function PlayerPanel() {
  const { game } = useGame()
  const player = game.player
  const { ens } = useWallet()

  return (
    <div className="flex flex-col justify-end gap-3 p-4 text-sm">
      <p className="">Mana: {player.mana}</p>

      <p className="">Life: {player.life}</p>

      <p className="">Library: {player.numberOfCardsInLibrary}</p>

      <p className="">Graveyard: {player.graveyard.length}</p>

      <p className="underline">{ens ?? shortenAddress(player.address)}</p>
    </div>
  )
}

function OpponentPanel() {
  const { game } = useGame()
  const opponent = game.opponent

  return (
    <div className="flex flex-col justify-end gap-3 p-4 text-sm">
      <p className="">Mana: {opponent.mana}</p>

      <p className="">Life: {opponent.life}</p>

      <p className="">Library: {opponent.numberOfCardsInLibrary}</p>

      <p className="">Graveyard: {opponent.graveyard.length}</p>

      <p className="underline">{shortenAddress(opponent.address)}</p>
    </div>
  )
}

function PlayerGamePanel() {
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
                Pass Priority
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

function OpponentGamePanel() {
  const { game, submitAction } = useGame()
  const opponent = game.opponent

  function handleClickSubmitAction(action: IAction) {
    submitAction(action)
  }

  return (
    <div className="flex flex-col justify-end items-end gap-3 p-4 text-sm">
      <div>
        {opponent.actions
          .filter((action) => action.type === 'PRIORITY_ACTION')
          .map((action, idx) => (
            <div key={idx} className="flex flex-col justify-center">
              <button
                className="px-2 py-1 bg-gold border border-gray-200 text-base"
                onClick={() => handleClickSubmitAction(action)}
              >
                Pass Priority
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
  const { game, submitAction } = useGame()

  function handleClickProcessStack() {
    // submitAction()
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
