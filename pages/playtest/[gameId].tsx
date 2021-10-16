import type { NextPage } from 'next'
import Head from 'next/head'

import { usePlaytestGame, usePlaytestGameConnection } from '../../lib/playtest/usePlaytest'
import CardInHand from '../../components/playtest/CardInHand'
import CardOnBattlefield from '../../components/playtest/CardOnBattlefield'

import { EffectItemType, IAction, IStackItem } from '../../lib/types'

const PlaytestGamePage: NextPage = () => {
  // 1) usePlaytestGameConnection handles the logic of joining the game "room"
  // and processing game state updates (which updates the redux store)
  // 2) children should use the usePlaytestGame hook to read game state data
  usePlaytestGameConnection()

  const { game } = usePlaytestGame()

  if (!game) {
    return (
      <div className="relative w-screen h-screen p-4">
        <div className="flex flex-col justify-center items-center h-full w-full">Loading</div>
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
      <Head>
        <title>Playtest - Adventure Cards</title>
      </Head>

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

      <div className="absolute top-32 right-0 z-20">
        <StackPanel />
      </div>
    </>
  )
}

export default PlaytestGamePage

function BattlefieldPanel() {
  const { game } = usePlaytestGame()
  const player1Cards = game.player1.battlefield
  const player2Cards = game.player2.battlefield

  return (
    <div className="flex flex-col flex-1 overflow-x-scroll">
      <div className={`h-1/2 w-full flex flex-row justify-center items-center gap-6`}>
        {player2Cards.map((card, idx) => (
          <CardOnBattlefield key={idx} card={card} />
        ))}
      </div>
      <div className={`h-1/2 w-full flex flex-row flex-1 justify-center items-center gap-6`}>
        {player1Cards.map((card, idx) => (
          <CardOnBattlefield key={idx} card={card} />
        ))}
      </div>
    </div>
  )
}

function HandPanel() {
  const { game } = usePlaytestGame()
  const cardsInHand = game.player1.hand

  return (
    <div className="flex-1 flex flex-row justify-center gap-2">
      {cardsInHand.map((card, idx) => (
        <CardInHand key={idx} card={card} />
      ))}
    </div>
  )
}

function OpponentHandPanel() {
  const { game } = usePlaytestGame()
  const cardsInHand = game.player2.hand

  return (
    <div className="flex-1 flex flex-row justify-center gap-2">
      {cardsInHand.map((card, idx) => (
        <CardInHand key={idx} card={card} />
      ))}
    </div>
  )
}

function PlayerPanel() {
  const { game } = usePlaytestGame()
  const player = game.player1

  return (
    <div className="flex flex-col justify-end gap-3 p-4 text-sm">
      <p className="">Mana: {player.mana}</p>

      <p className="">Life: {player.life}</p>

      <p className="">Library: {player.numberOfCardsInLibrary}</p>

      <p className="">Graveyard: {player.graveyard.length}</p>

      <p className="underline">{player.address}</p>
    </div>
  )
}

function OpponentPanel() {
  const { game } = usePlaytestGame()
  const opponent = game.player2

  return (
    <div className="flex flex-col justify-end gap-3 p-4 text-sm">
      <p className="">Mana: {opponent.mana}</p>

      <p className="">Life: {opponent.life}</p>

      <p className="">Library: {opponent.numberOfCardsInLibrary}</p>

      <p className="">Graveyard: {opponent.graveyard.length}</p>

      <p className="underline">{opponent.address}</p>
    </div>
  )
}

function PlayerGamePanel() {
  const { game, submitAction } = usePlaytestGame()
  const player = game.player1

  function handleClickSubmitAction(action: IAction) {
    submitAction(action)
  }

  return (
    <div className="flex flex-col justify-end items-end gap-3 p-4 text-sm">
      <div>
        {player.actions
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
  const { game, submitAction } = usePlaytestGame()
  const opponent = game.player2

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
  const { game } = usePlaytestGame()
  const cardsOnStack = [...game.player1.stack, ...game.player2.stack]

  function renderStackItemDetail(stackItem: IStackItem) {
    switch (stackItem.effectItem.type) {
      case EffectItemType.CAST: {
        const cardId = stackItem.effectItem.arguments.cardId
        const card = cardsOnStack.find((card) => card.id === cardId)
        if (!card) {
          return <></>
        }
        return <p>{card.name}</p>
      }
      default:
        return <></>
    }
  }

  return (
    <div className="flex flex-col items-start gap-4 p-4 text-sm">
      <p className="w-32 border-b border-gray-300">Stack</p>

      <div className="flex flex-col">
        {[...game.stack].reverse().map((stackItem, idx) => (
          <div key={idx} className="flex flex-row w-full gap-2">
            <p className="">
              {stackItem.controllerId === game.player1.id ? game.player1.address : game.player2.address}
            </p>
            <p className="">{stackItem.effectItem.type}</p>
            {renderStackItemDetail(stackItem)}
          </div>
        ))}
      </div>
    </div>
  )
}
