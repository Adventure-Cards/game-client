## Adventure Cards Deck Viewer & Game Engine

### Deck Viewer
The deck viewer is a simple interface for Adventure Cards NFTs. You can search for decks by address or mint #, and view the cards in each deck rendered as playing cards for the game. The goal for the deck viewer is to support usage of the game.

#### Roadmap
- [ ] add card/deck data analytics, like % of each color, average mana cost distribution, etc
- [ ] add future functionality, like a deck builder
- [ ] improve search UX
- [ ] add basic dapp fuctionality (connect wallet, see decks I own)

### Game Engine
The game engine is an experimental project to build the card game engine with rules similar to those of Magic: The Gathering.

Card Data
- Cards are annotated with the game data found in this [spreadsheet](https://docs.google.com/spreadsheets/d/1ZfwQ4sVlR8x7mpz2iimLwnUFGNeUdJSGLCm-zwJVZbw/edit#gid=20077689910)
- The repo includes code to read the and populate the characteristics of every card in the game
- Cards have abilities (static data)
- Abilities have Costs and Effects (static data)

Costs and Effects
- Costs and Effects represent changes to be made to the game state (e.g. ManaCost, DamagePlayerEffect)
- Effects have an ExecutionType, which is eiher `respondable` or `immediate`
  - Immediate Effects are executed upon submission
  - Respondable Effects are added to the Stack upon submission
- Costs are always executed upon submission (they are not respondable, like MTG)
- Effects sitting in the Stack are executed in LIFO order according to the rules of priority (as in MTG)

Actions
- The user submits Actions which produce CostItems and EffectItems (instances of a Cost or Effect with parameters supplied)
- Actions roughly correspond to Abilities (and soon Spells too), but there are also some special Actions (Priority Actions)

Other things to note
- After every Effect is executed, the system runs `updateAvailableActionsForPlayers` which calculates all of the actions each player can now take (because there is a new game state). This function takes into account the current turn phase, who has priority, abilities on all on permanents, and if the player is able to pay the CostItems associated with each action.
- The Combat Ability is a special Ability that all creature Cards get
- Effects can be composed by triggering one after another

#### Roadmap
- [ ] add handlers for new ActionsTypes, CostTypes, and EffectTypes as we add more complex card data and user actions (casting permanents onto the battlefield, casting spells, effects that are triggered by other effects, equipping artifacts to creatures, etc)
- [ ] build a server to support multiplayer
- [ ] improve game UI (perhaps draw inspiration from MTG Arena)
