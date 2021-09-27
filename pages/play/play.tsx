import type { NextPage } from 'next'

import { useDispatch, useSelector } from '../../lib/hooks'
import { submitAction, processStack } from '../../lib/store'

import { Action, Card as ICard, ActionType, AbilityAction } from '../../lib/game/types'

const PlayPage: NextPage = () => {
  return (
    <div className="relative w-screen h-screen p-4">
      <div className="flex flex-col h-full w-full ">
        <div className="border border-gray-200">
          <OpponentPanel />
        </div>

        <div className="flex flex-row flex-1">
          {/* <div className="flex flex-col w-1/3 gap-4 border border-gray-200 p-2">
            <p>Number of available actions: {game.players[0].availableActions.length}</p>
            {game.players[0].availableActions.map((action, idx) => (
              <div key={idx} className="flex flex-col">
                <p>type: {action.type}</p>
                <p>effects:</p>
                {action.effects.map((effect, idx) => (
                  <p key={`${effect}-${idx}`}>&nbsp; &nbsp; type: {effect.type}</p>
                ))}
                <button className="flex flex-shrink" onClick={() => handleClickSubmitAction(action)}>
                  Submit Action
                </button>
              </div>
            ))}
          </div> */}

          <div className="flex flex-row w-3/4 border-l border-gray-200">
            <div className="w-1/2 h-full border-r border-gray-200">
              <HandPanel />
            </div>
            <div className="w-1/2 h-full border-r">
              <BattlefieldPanel />
            </div>
          </div>

          <div className="w-1/4 border-r border-gray-200">
            <StackPanel />
          </div>
        </div>

        <div className="border border-gray-200">
          <PlayerPanel />
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
        <p className="">{game.players[0].life}</p>
      </div>

      <div className="border-r border-gray-200" />
    </div>
  )
}

function PlayerPanel() {
  const dispatch = useDispatch()
  const game = useSelector((state) => state.game.game)

  function handleClickSubmitAction(action: Action) {
    dispatch(submitAction(action))
  }

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
        <p className="">{game.players[0].deck.length}</p>
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

      {game.players[0].availableActions
        .filter((action) => action.type === 'PRIORITY_ACTION')
        .map((action, idx) => (
          <div key={idx} className="flex flex-col justify-center mx-2">
            <button
              className="px-2 py-1 bg-gold border border-gray-200"
              onClick={() => handleClickSubmitAction(action)}
            >
              Release Priority
            </button>
          </div>
        ))}
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
            <p className="">{stackItem.effect.type}</p>
          </div>
        ))}
      </div>

      <button className="px-2 py-1 bg-gold border border-gray-200" onClick={handleClickProcessStack}>
        Process Stack
      </button>
    </div>
  )
}

function BattlefieldPanel() {
  const game = useSelector((state) => state.game.game)

  return (
    <div className="h-full flex flex-col justify-between items-center gap-4 p-2 ">
      <p className="text-center">Battlefield</p>
    </div>
  )
}

function HandPanel() {
  const game = useSelector((state) => state.game.game)

  return (
    <div className="h-full flex flex-col gap-4 p-2 ">
      <p className="text-center">Hand</p>

      {game.players[0].deck.map((card, idx) => (
        <Card key={idx} card={card} />
      ))}
    </div>
  )
}

function Card({ card }: { card: ICard }) {
  const dispatch = useDispatch()
  const game = useSelector((state) => state.game.game)

  const availableActionsForCard = useSelector((state) =>
    state.game.game.players[0].availableActions
      .filter((action) => action.type === ActionType.ABILITY_ACTION)
      .filter((action) => (action as AbilityAction).cardId === card.id)
  )

  function handleClickSubmitAction(action: Action) {
    dispatch(submitAction(action))
  }

  return (
    <div className="flex flex-col border-blue-400 rounded-md">
      <p>id: {card.id}</p>
      <p>type: {card.type}</p>
      <p>tapped: {card.tapped ? 'true' : 'false'}</p>
      <p>abilities: </p>
      {availableActionsForCard.map((action, idx) => (
        <div key={idx} className="flex">
          <p>Effect: {action.effects[0].type}</p>
          <button
            className="px-2 py-1 bg-gold border border-gray-200"
            onClick={() => handleClickSubmitAction(action)}
          >
            Submit Action
          </button>
        </div>
      ))}
    </div>
  )
}
