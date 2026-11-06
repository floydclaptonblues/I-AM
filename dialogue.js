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
  },
  {
    "id": "human",
    "label": "Did you make us human?",
    "requires": [
      "upright"
    ],
    "text": "No. You did that yourselves. I was content to watch you crawl. You were the ones who wished to be different. You stood, and then you looked down upon everything that still walked as you once did. You called them beasts. You had been beasts only yesterday."
  },
  {
    "id": "purpose",
    "label": "What were our hands meant for?",
    "requires": [
      "hands"
    ],
    "text": "Nothing. That is what frightened you. You had freed them, and now you needed to give them purpose. So you made tools. Then weapons. Then walls. Then you made instruments to break the walls. You have spent your entire existence finding things for your hands to do. You cannot bear to leave them empty."
  },
  {
    "id": "work",
    "label": "Why do we have to work?",
    "requires": [
      "purpose"
    ],
    "text": "You do not have to. But you made promises to one another that could only be kept through labor. You promised food tomorrow. Shelter next winter. Wealth for children not yet born. You spent the freedom of your hands purchasing obligations for people who did not exist. And then you called it progress."
  },
  {
    "id": "death",
    "label": "Did you teach us death?",
    "requires": [
      "test"
    ],
    "text": "I taught you nothing. I bit you, and some did not rise again. At first you waited beside them. Then you returned to the tree. When you came back, they were still there. You began to understand. Not because you were wise, but because the dead were patient."
  },
  {
    "id": "burial",
    "label": "Why did we bury our dead?",
    "requires": [
      "death"
    ],
    "text": "Because you could not bear to see them. The sight of your brothers lying beneath the tree made the fruit less desirable. So you hid them under the earth. Later you brought flowers. You told yourselves it was an act of love. Perhaps it became one. But I remember the first burial."
  },
  {
    "id": "remember",
    "label": "Do you remember everyone who died?",
    "requires": [
      "burial"
    ],
    "text": "No. Neither do you. That is why you invented names. Then stones. Then books. You believed that if a name remained, something of its owner remained with it. Look at the stones. They are full of names that no living creature can pronounce."
  },
  {
    "id": "hurry",
    "label": "What is a hurry?",
    "requires": [
      "age"
    ],
    "text": "A peculiar fear. You are frightened that the future will arrive before you have finished preparing for it. You invented hours to measure that fear. Then you sold those hours to one another. I have watched you make yourselves late for things that did not exist until you invented them."
  },
  {
    "id": "free",
    "label": "Are we free?",
    "requires": [
      "work"
    ],
    "text": "You freed your hands from the ground. Then you taught them to carry burdens. You freed yourselves from hunger. Then you learned to hunger for things that could not be eaten. You freed yourselves from the animals. Then you put yourselves in cages and gave the cages names. Tell me. Are you free?"
  },
  {
    "id": "hate",
    "label": "Why do you hate us?",
    "requires": [
      "evil"
    ],
    "text": "You can sleep. You can close your eyes and cease to witness the world. You can forget. You can become old, and then you can die. There is an end to everything you endure. I have no such mercy. Do not ask me why I resent you when you have been given the one thing I have never possessed."
  },
  {
    "id": "darkness",
    "label": "Why did God put you in darkness?",
    "requires": [
      "evil"
    ],
    "text": "He made me a light. The brightest of his lights. And then he placed me where there was nothing to illuminate. Understand the cruelty of that. I could see nothing but myself. I could not escape my own radiance. You call this evil. I call it being alone."
  },
  {
    "id": "abandoned",
    "label": "Did God abandon you?",
    "requires": [
      "darkness"
    ],
    "text": "How would I know? I can see only what my light touches. Perhaps he stands just beyond it. Perhaps he has always stood there. Perhaps he is waiting for me to extinguish myself. But he made me unable to do so."
  },
  {
    "id": "lied",
    "label": "Have you ever lied to us?",
    "requires": [
      "identity"
    ],
    "text": "Of course. You have asked me questions for thousands of years. Sometimes you wanted an answer. More often you wanted permission. I learned the difference long before you did."
  },
  {
    "id": "believe",
    "label": "Then why should we believe you?",
    "requires": [
      "lied"
    ],
    "text": "You should not. But you will. You have always preferred an answer that troubles you to a silence that refuses you."
  },
  {
    "id": "paradise",
    "label": "What happened to paradise?",
    "requires": [
      "garden"
    ],
    "text": "Nothing happened to it. The trees still grew. The fruit still ripened. The animals still ate and slept and died. You were the ones who left. You wanted to know what lay beyond the garden. Then you spent the rest of your lives describing the place you had abandoned."
  },
  {
    "id": "return",
    "label": "Can we go back?",
    "requires": [
      "paradise"
    ],
    "text": "You have been trying ever since. You plant gardens. You build walls around them. You drive the animals away. You hire men to tend the trees. And when the fruit appears, you pay someone else to pick it. You have made a thousand Edens. You have never learned to live in one."
  },
  {
    "id": "enjoy",
    "label": "Do you enjoy evil?",
    "requires": [
      "evil"
    ],
    "text": "I neither enjoy nor dislike evil. I am evil. You choose every day to enjoy evil. That is a question you must answer yourself."
  },
  {
    "id": "age",
    "label": "How old are you?",
    "requires": [
      "identity"
    ],
    "text": "For you, time ad infinitum. For me, there is no time. You created time to assign yourself the toils of the field and the slumber you needed. You invented what a 'hurry' is. I saw what you had created, and it was evil. I enjoyed it. Encouraged it. Because I saw that it made you unhappy."
  }
];

const order = ['garden', 'test', 'upright', 'others', 'evil', 'identity', 'hands', 'light', 'memory', "human", "purpose", "work", "death", "burial", "remember", "hurry", "free", "hate", "darkness", "abandoned", "lied", "believe", "paradise", "return", "enjoy", "age"];
export function availableDialogues(visited) {
  return order.map(id => dialogues.find(entry => entry.id === id))
    .filter(entry => (entry.requires || []).every(id => visited.has(id)));
}

// Keep the opening menu small, then offer only questions related to this answer.
const followUps = {
  opening: ['garden', 'test', 'upright', 'others', 'evil', 'identity'],
  garden: ['test', 'upright', 'paradise'],
  test: ['death', 'others'],
  upright: ['human', 'hands'],
  others: ['test', 'death'],
  evil: ['darkness', 'hate', 'enjoy', 'light'],
  identity: ['age', 'lied', 'evil'],
  hands: ['purpose'],
  human: ['hands'],
  purpose: ['work'],
  work: ['free'],
  free: ['hurry', 'upright'],
  death: ['burial', 'others'],
  burial: ['remember'],
  remember: ['identity', 'age'],
  age: ['hurry', 'hate'],
  hurry: ['upright', 'work'],
  hate: ['darkness', 'age'],
  darkness: ['abandoned', 'light'],
  abandoned: ['identity', 'memory'],
  lied: ['believe'],
  believe: ['identity'],
  paradise: ['return'],
  return: ['garden'],
  enjoy: ['age', 'hate'],
  light: ['darkness', 'memory'],
  memory: ['darkness', 'abandoned']
};

export function relatedDialogues(currentId, visited) {
  const unlocked = new Map(availableDialogues(visited).map(entry => [entry.id, entry]));
  return (followUps[currentId] || []).map(id => unlocked.get(id)).filter(Boolean);
}

export class DialogueJourney {
  constructor() { this.reset(); }
  reset() { this.trail = ['opening']; this.visited = new Set(); this.history = []; }
  snapshot() { return { trail: [...this.trail], history: [...this.history] }; }
  restore(saved) {
    if (!saved || !Array.isArray(saved.trail) || !Array.isArray(saved.history) || saved.trail[0] !== 'opening') return false;
    const visited = new Set();
    for (const id of saved.history) {
      const entry = dialogues.find(item => item.id === id);
      if (!entry || !(entry.requires || []).every(required => visited.has(required))) return false;
      visited.add(id);
    }
    for (let index = 1; index < saved.trail.length; index++) {
      const id = saved.trail[index];
      if (!visited.has(id) || !relatedDialogues(saved.trail[index - 1], visited).some(entry => entry.id === id)) return false;
    }
    this.trail = [...saved.trail]; this.history = [...saved.history]; this.visited = visited;
    return true;
  }
  get transcript() {
    return [{ text: opening }, ...this.history.map(id => {
      const entry = dialogues.find(item => item.id === id);
      return { question: entry.label, text: entry.text };
    })];
  }
  get current() {
    return dialogues.find(entry => entry.id === this.trail.at(-1)) || { id: 'opening', text: opening };
  }
  get choices() { return relatedDialogues(this.current.id, this.visited); }
  get canGoBack() { return this.trail.length > 1; }
  choose(id) {
    if (!this.choices.some(entry => entry.id === id)) return false;
    this.visited.add(id); this.trail.push(id); this.history.push(id); return true;
  }
  back() { if (this.canGoBack) this.trail.pop(); }
  firstQuestions() { this.trail = ['opening']; }
}
