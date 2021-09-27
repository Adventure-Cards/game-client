import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { useDispatch, useSelector } from '../../lib/hooks'
import { startGame, updateDeckId, submitAction, processStack } from '../../lib/store'
import { useCardsForDeck } from '../../lib/useCardsForDeck'

import { rarityMap, rarityColorKey, toSentenceCase } from '../../lib/utils'

import {
  Action,
  Card as ICard,
  ActionType,
  AbilityAction,
  CardLocation,
  CardType,
  Ability,
} from '../../lib/game/types'

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
    <div className="relative w-screen h-screen p-4">
      <div className="flex flex-col h-full w-full">
        <div className="flex flex-row border-t border-gray-200" style={{ height: 'calc(100% - 66px)' }}>
          <div className="flex flex-row w-3/4 h-full border-l border-gray-200">
            <div className="w-1/2 overflow-scroll border-r border-gray-200">
              <HandPanel />
            </div>
            <div className="w-1/2 overflow-scroll border-r border-gray-200">
              <BattlefieldPanel />
            </div>
          </div>

          <div className="w-1/4 border-r border-gray-200">
            <StackPanel />
          </div>
        </div>

        <div className="flex flex-row justify-between border border-gray-200" style={{ height: '66px' }}>
          <PlayerPanel />
          <OpponentPanel />
          <GamePanel />
        </div>
      </div>
    </div>
  )
}

export default PlayPage

function OpponentPanel() {
  const game = useSelector((state) => state.game.game)

  return (
    <div className="flex flex-row gap-2 p-2">
      <div className="flex flex-col text-center">
        <p className="text-white">Address</p>
        <p className="">test-opponent</p>
      </div>

      <div className="border-r border-gray-200" />

      <div className="flex flex-col text-center w-12">
        <p className="text-white">Life</p>
        <p className="">{game.opponentLife}</p>
      </div>

      <div className="border-r border-gray-200" />
    </div>
  )
}

function PlayerPanel() {
  const game = useSelector((state) => state.game.game)

  return (
    <div className="flex flex-row gap-2 p-2">
      <div className="flex flex-col text-center">
        <p className="text-white">Address</p>
        <p className="">{game.players[0].username}</p>
      </div>

      <div className="border-r border-gray-200" />

      <div className="flex flex-col text-center w-12">
        <p className="text-white">Life</p>
        <p className="">{game.players[0].life}</p>
      </div>

      <div className="border-r border-gray-200" />

      <div className="flex flex-col text-center w-16">
        <p className="text-white">Library</p>
        <p className="">
          {game.players[0].deck.filter((card) => card.location === CardLocation.LIBRARY).length}
        </p>
      </div>

      <div className="border-r border-gray-200" />

      <div className="flex flex-col text-center w-12">
        <p className="text-white">White</p>
        <p className="">{game.players[0].manaPool.white}</p>
      </div>
      <div className="flex flex-col text-center w-12">
        <p className="text-blue-600">Blue</p>
        <p className="">{game.players[0].manaPool.blue}</p>
      </div>
      <div className="flex flex-col text-center w-12">
        <p className="text-black">Black</p>
        <p className="">{game.players[0].manaPool.black}</p>
      </div>
      <div className="flex flex-col text-center w-12">
        <p className="text-red-700">Red</p>
        <p className="">{game.players[0].manaPool.red}</p>
      </div>
      <div className="flex flex-col text-center w-12">
        <p className="text-green-700">Green</p>
        <p className="">{game.players[0].manaPool.green}</p>
      </div>

      <div className="border-r border-gray-200" />
    </div>
  )
}

function GamePanel() {
  const dispatch = useDispatch()
  const game = useSelector((state) => state.game.game)

  function handleClickSubmitAction(action: Action) {
    dispatch(submitAction(action))
  }

  return (
    <div className="flex flex-row gap-2 p-2">
      {game.players[0].availableActions
        .filter((action) => action.type === 'PRIORITY_ACTION')
        .map((action, idx) => (
          <div key={idx} className="flex flex-col justify-center mx-2">
            <button
              className="px-2 py-1 bg-gold border border-gray-200"
              onClick={() => handleClickSubmitAction(action)}
            >
              Next Phase
            </button>
          </div>
        ))}

      <div className="border-r border-gray-200" />

      <div className="flex flex-col text-center w-12">
        <p className="text-white">Turn</p>
        <p className="">{game.turn}</p>
      </div>

      <div className="border-r border-gray-200" />

      <div className="flex flex-col text-center w-20">
        <p className="text-white">Phase</p>
        <p className="">{game.phase}</p>
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
    <div className="flex flex-col h-full items-center gap-4 p-2 ">
      <p className="text-center">Stack</p>

      <div className="flex flex-col flex-1 justify-end w-full overflow-y-scroll no-scrollbar">
        {[...game.stack].reverse().map((stackItem, idx) => (
          <div key={idx} className="flex flex-row w-full gap-4">
            <p className="w-5">{game.stack.length - idx - 1}</p>
            <p className="">
              {game.players.find((player) => player.id === stackItem.controllerId)?.username}
            </p>
            <p className="">{stackItem.effectItem.effect.type}</p>
          </div>
        ))}
      </div>

      {game.stack.length > 0 && (
        <button className="px-2 py-1 bg-gold border border-gray-200" onClick={handleClickProcessStack}>
          Process Stack
        </button>
      )}
    </div>
  )
}

function BattlefieldPanel() {
  const cardsOnBattlefield = useSelector((state) =>
    state.game.game.players[0].deck.filter((card) => card.location === CardLocation.BATTLEFIELD)
  )

  return (
    <div className="flex flex-col items-center gap-6 p-2 pb-6">
      <p className="">Battlefield ({cardsOnBattlefield.length})</p>

      {cardsOnBattlefield.map((card, idx) => (
        <Card key={idx} card={card} />
      ))}
    </div>
  )
}

function HandPanel() {
  const cardsInHand = useSelector((state) =>
    state.game.game.players[0].deck.filter((card) => card.location === CardLocation.HAND)
  )

  return (
    <div className="flex flex-col items-center gap-6 p-2 pb-6">
      <p className="">Hand ({cardsInHand.length})</p>

      {cardsInHand.map((card, idx) => (
        <Card key={idx} card={card} />
      ))}
    </div>
  )
}

const Card = ({ card, className }: { card: ICard; className?: string }) => {
  const dispatch = useDispatch()

  const game = useSelector((state) => state.game.game)

  const availableActionsForCard = useSelector((state) =>
    state.game.game.players[0].availableActions
      .filter((action) => action.type === ActionType.ABILITY_ACTION)
      .filter((action) => (action as AbilityAction).cardId === card.id)
  )

  function getActionForAbility(ability: Ability) {
    const action = game.players[0].availableActions
      .filter((action) => action.type === ActionType.ABILITY_ACTION)
      .filter((action) => (action as AbilityAction).cardId === card.id)
      .find((action) => (action as AbilityAction).abilityId === ability.id)

    return action
  }

  function handleClickSubmitActionForAbility(ability: Ability) {
    const action = getActionForAbility(ability)

    if (action) {
      console.log('dispatching action:', action)
      dispatch(submitAction(action))
    }
  }

  function handleClickSubmitAction(action: Action) {
    dispatch(submitAction(action))
  }

  useEffect(() => {
    console.log('availableActionsForCard for card.id', card.id, availableActionsForCard)
  }, [availableActionsForCard])

  return (
    <div
      className={`flex flex-col justify-between w-72 h-96 p-4 bg-background
      rounded-md shadow-xl border-4 border-${rarityColorKey(card.level)} transition-all
      ${card.tapped ? 'transform rotate-12' : 'transform rotate-0'} ${className}`}
    >
      <div className="flex flex-col space-y-3 overflow-y-scroll no-scrollbar">
        <p className={``}>{card.name}</p>

        <p className={`text-${rarityColorKey(card.level)}`}>
          {rarityMap[card.level]} {toSentenceCase(card.type)}
        </p>

        {card.abilities.map((ability, idx) => (
          <div key={idx} className="flex flex-col">
            <div className="flex flex-row justify-between items-center pb-2">
              <p className="py-2">{ability.name}</p>
              {getActionForAbility(ability) && (
                <button
                  className="px-2 py-1 bg-gold border border-gray-200"
                  onClick={() => handleClickSubmitActionForAbility(ability)}
                >
                  Submit Action
                </button>
              )}
            </div>

            <p>{ability.description}</p>
          </div>
        ))}

        {availableActionsForCard.map((action, idx) => (
          <button
            key={idx}
            className="px-2 py-1 bg-gold border border-gray-200"
            onClick={() => handleClickSubmitAction(action)}
          >
            Submit Action: {action.type}
          </button>
        ))}
      </div>

      <div className="flex flex-row justify-end">
        {card.type === CardType.CREATURE && (
          <p>
            {card.attack}/{card.defense}
          </p>
        )}
        {/* @ts-ignore */}
        {/* {card.type === 'artifact' && (card.attack > 0 || card.defense > 0) && (
          <p>
            +{card.attack}/+{card.defense}
          </p>
        )} */}
      </div>
    </div>
  )
}
