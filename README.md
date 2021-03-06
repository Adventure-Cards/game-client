## Adventure Cards Game Client

[Link to app ->](https://0xadventure.cards/)

### Start Here

<details>
  <summary>What is Adventure Cards?</summary>
  
  * Adventure Cards started as an NFT project inspired by Loot and Magic: The Gathering. Each original Adventure Cards deck includes 45 procedurally-generated card titles. Since launch, a community of builders has begun developing a full-fledged trading card game with mechanics similar to Hearthstone or MTG.
  * The original Adventure Cards website -> https://0xadventures.com/
  
</details>
<details>
  <summary>How do I purchase a deck?</summary>

  You can purchase a deck on OpenSea -> https://opensea.io/collection/adventure-cards
  
</details>
<details>
  <summary>Where can I play this game?</summary>
  
  * Playtesting is currently live -> https://0xadventure.cards/playtest
  * Please note that the game is unstable and under active development
  
</details>
<details>
  <summary>How can I contribute to the development of the game?</summary>
  
  1. Playtesting
  2. Game development
  3. UI/UX design
  4. Contract development
  5. Art
  
</details>

### Contributing to this repository

1. Clone the repository
```
git clone https://github.com/Adventure-Cards/game-client.git && cd game-client
```
2. Copy `sample.env` -> `.env`
```
cp sample.env .env
```
3. Start the nextjs development server
```
yarn dev
```
4. (optional) Clone and start the [game server](https://github.com/Adventure-Cards/game-server)

#### Overview
The game client is a Next.js app that makes use of `tailwindcss`, `redux-toolkit`, and `socket.io-client`. Please take a look at the open issues, or reach out on [discord](https://discord.gg/YdgRxhMq) if you can't find a good place to start.
