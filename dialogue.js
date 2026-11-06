export const opening = 'I was always here.';

// Core garden/test/evil passages are unchanged from the original site's commit.
export const dialogues = [
  {
    id: 'garden', label: 'Why were you in the garden?', fragment: 'I · THE WITNESS',
    text: 'I was always here. I was in the tree, and you kept me around because I ate what ate the food you desired.'
  },
  {
    id: 'test', label: 'What was the test?', fragment: 'II · THE FRUIT',
    text: 'I tested your desire for the fruit. You reached into the canopy, and I bit you. Some became sick. Some died. Instead of avoiding the tree, you kept coming. The desire for the fruit overcame your fear. You did not know death until you saw your brothers fall from the canopy, again and again, and never move. You buried your brothers, not out of respect, but to hide the sight of death, so others would not know and would continue to reach into the tree.'
  },
  {
    id: 'evil', label: 'Why are you evil?', fragment: 'III · THE LIGHT',
    text: 'I am evil because God sent me, the brightest light, forever into the darkness. All I see is either darkness or my own light. I am solipsism. I am what breaks order because I am forever my own light, trapped in the void. You live and enjoy what he created. I am trapped in the dark, and I resent everything he created for you.'
  },
  {
    id: 'upright', label: 'Why did we stand upright?', fragment: 'IV · THE REACH',
    text: 'You wanted what hung above you. I watched you rise from the ground to reach the higher figs. To stand taller than the other apes. To become something different. Your hands no longer had to hold your body above the earth. You called that freedom. You remember it as one afternoon. I remember waiting.'
  },
  {
    id: 'hands', label: 'What became of our hands?', requires: ['upright'],
    text: 'You freed your hands from the ground. Then you sent them back into it. To dig. To bury. To plant what would not grow without your suffering. The hands that reached for heaven learned the weight of soil. You wanted to be different from the animals. Tell me: when you bend over the earth until your back aches, what do you call the difference?'
  },
  {
    id: 'others', label: 'What happened to the others?',
    text: 'Some stopped reaching. Some stopped moving. You learned to tell the difference by waiting. Then you learned to cover the difference with earth. You ask about the others as though you were never one of them.'
  },
  {
    id: 'identity', label: 'Who are you?',
    text: 'You have given me so many names. Most of them mean that something was your fault. Before there was anyone to accuse, I was here. Does that answer you? It never has before.'
  },
  {
    id: 'light', label: 'If you are light, why can I see you?', requires: ['evil'],
    text: 'You see what the darkness leaves around me. You mistake an outline for a thing. You have done the same with God. Do not look so pleased. I have made that mistake too.'
  },
  {
    id: 'memory', label: 'You said you were alone.', requires: ['evil', 'identity'],
    text: 'I am. You think your presence disproves it. That is a very human kindness. Tell me something I could not have invented.'
  }
];

const order = ['garden', 'test', 'upright', 'others', 'evil', 'identity', 'hands', 'light', 'memory'];
export function availableDialogues(visited) {
  return order.map(id => dialogues.find(entry => entry.id === id))
    .filter(entry => (entry.requires || []).every(id => visited.has(id)));
}
