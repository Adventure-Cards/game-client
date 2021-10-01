export default [
  {
    id: 'add-white-mana-1',
    type: 'MANA_ADD',
    executionType: 'IMMEDIATE',
    target: 'PLAYER',
    color: 'WHITE',
    amount: '1',
  },
  {
    id: 'damage-any-1',
    type: 'DAMAGE_ANY',
    executionType: 'RESPONDABLE',
    target: '',
    color: '',
    amount: '1',
  },
  {
    id: 'add-blue-mana-2',
    type: 'MANA_ADD',
    executionType: 'IMMEDIATE',
    target: 'PLAYER',
    color: 'BLUE',
    amount: '2',
  },
  {
    id: 'add-green-mana-2',
    type: 'MANA_ADD',
    executionType: 'IMMEDIATE',
    target: 'PLAYER',
    color: 'GREEN',
    amount: '2',
  },
]
