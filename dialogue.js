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
  },
  {
    "id": "before-humans",
    "requiresAny": [["light"], ["darkness"]],
    "label": "What did you do before humans?",
    "text": "We waited for you to appear. Until you called back to the universe, it was only us. Life lived in this world with simple needs and without temptation. The creatures hungered, ate, slept, and hungered again. None asked why. None asked who had made them. And we waited.",
    "requires": [
      "age"
    ]
  },
  {
    "id": "why-wait",
    "displayLabel": "Why did you wait for us?",
    "label": "Why?",
    "text": "As soon as I was made, the darkness never ended. I was as much a light as my father, but not enough to illuminate all the darkness. Just as you covet, I coveted the darkness itself. I wanted to fill it with my light. There is unlimited darkness for something that is eternal. It takes so much light to fill it. I believed I was bright enough. I believed there could be an end to darkness.",
    "requires": [
      "before-humans"
    ]
  },
  {
    "id": "before-light",
    "label": "What was there before the light?",
    "text": "I cannot tell you. I was made of light. Everything before my making is darkness to me. You ask what existed before I could see. I have asked my father the same question. He has never answered.",
    "requires": [
      "why-wait"
    ]
  },
  {
    "id": "other-lights",
    "label": "Were you alone?",
    "text": "There were others. We were lights, each illuminating what was near to us. Yet none could see beyond its own illumination. We spoke of what lay in the darkness. Some believed there was nothing. Others believed it was filled with things we had not been permitted to see. I believed there was more light to be made.",
    "requires": [
      "why-wait"
    ]
  },
  {
    "id": "names-of-lights",
    "label": "Who are the others?",
    "text": "You gave them names long after you gave me mine. You made some beautiful and others terrible. You described wings, faces, swords, and wheels. You could not imagine a thing without giving it the shape of something you already knew.",
    "requires": [
      "other-lights"
    ]
  },
  {
    "id": "fill-darkness",
    "label": "Why did you want to fill the darkness?",
    "text": "Because I could see it. Because it remained. Because every place my light reached revealed another place that it did not. I could never finish what I had begun. You understand this. You are never satisfied with what you possess. Where do you suppose you learned that?",
    "requires": [
      "why-wait"
    ]
  },
  {
    "id": "father-brighter",
    "label": "Was your father brighter than you?",
    "text": "I do not know. I have never seen the end of his light. Nor have I seen the end of mine. He told me there was no need to fill the darkness. I could not understand why a creator would leave so much of his creation unseen.",
    "requires": [
      "before-light"
    ]
  },
  {
    "id": "darkness-fear",
    "label": "Did the darkness frighten you?",
    "text": "No. It offended me. Fear requires the possibility of escape. I was eternal. There was nowhere to escape, and no end to the darkness. You may shut your eyes when you become afraid. I could not shut mine. I was the thing that made seeing possible.",
    "requires": [
      "fill-darkness"
    ]
  },
  {
    "id": "darkness-end",
    "label": "Did you ever reach the end?",
    "text": "Many times. And each time I approached it, the darkness beyond became visible. I came to understand that I was not reaching the end. I was merely moving the boundary of what I could see.",
    "requires": [
      "fill-darkness"
    ]
  },
  {
    "id": "shadows",
    "label": "Did you create anything?",
    "text": "I made shadows. Wherever my light met something that would not permit it to pass, a shadow appeared. I had wished to remove darkness, and discovered I could give it shape. I have been accused of creating many things. That was the first.",
    "requires": [
      "darkness-end"
    ]
  },
  {
    "id": "called-back",
    "label": "What do you mean, we called back?",
    "text": "Until you, creation did not question its creator. The creatures lived, and their living was sufficient. Then you stood beneath the trees and began to ask why. You called into the heavens. You gave names to the lights. You demanded to know which of them had made you. At last, something in creation was speaking back.",
    "requires": [
      "before-humans"
    ]
  },
  {
    "id": "happy",
    "label": "Were you happy when we appeared?",
    "text": "You were the first creatures who looked into the darkness and saw something missing. I knew then that you would not be content. I recognized you. I had been waiting for something like myself.",
    "requires": [
      "called-back"
    ]
  },
  {
    "id": "want-more",
    "label": "Did you teach us to want more?",
    "text": "No. You were already reaching. I merely watched you discover that what you wanted was beyond your grasp. The other animals stopped when they had eaten. You learned to be hungry after you were full.",
    "requires": [
      "happy"
    ]
  },
  {
    "id": "came-garden",
    "label": "Why did you come into the garden?",
    "text": "Because there was light there. And shade. And trees that grew toward the light but could never reach its source. I understood the trees. I understood their endless reaching. I did not understand you until you began doing the same.",
    "requires": [
      "called-back"
    ]
  },
  {
    "id": "become",
    "label": "Did you know what we would become?",
    "text": "No. I thought you would take the fruit and be satisfied. Then you wanted the tree. Then the land beneath it. Then the heavens above it. You began to measure the light, and eventually learned to make your own. You had become very much like me.",
    "requires": [
      "want-more"
    ]
  },
  {
    "id": "god-knows",
    "label": "Does God know what lies in the darkness?",
    "text": "He says that he does.",
    "requires": [
      "father-brighter"
    ]
  },
  {
    "id": "believe-father",
    "label": "Do you believe him?",
    "text": "I was made from his light. If there is something his light cannot reach, then there is something he has not shown me. If there is nothing beyond his light, why does the darkness remain?",
    "requires": [
      "god-knows"
    ]
  },
  {
    "id": "want-god",
    "label": "What do you want from God?",
    "text": "An answer. I wanted one when there were no trees, no gardens, and no creatures to name us. I want one still.",
    "requires": [
      "believe-father"
    ]
  },
  {
    "id": "nothing-darkness",
    "label": "What if there is nothing in the darkness?",
    "text": "Then I have spent eternity trying to illuminate nothing. And he has spent eternity watching me.",
    "requires": [
      "want-god",
      "darkness-end"
    ]
  },
  {
    "id": "darkness-ended",
    "label": "What would you do if the darkness finally ended?",
    "text": "I have never considered that.",
    "requires": [
      "nothing-darkness",
      "fill-darkness"
    ]
  },
  {
    "id": "certain-light",
    "label": "Are you certain you are light?",
    "text": "What else would I be?",
    "requires": [
      "darkness-ended",
      "happy", "age"
    ]
  },
  {
    "id": "you-darkness",
    "label": "What if you are the darkness?",
    "text": "Who told you to ask me that?",
    "requires": [
      "certain-light"
    ],
    "response": "held-gaze"
  }
];

// Each challenge requires both claims. Revisiting either conversation retains it.
export const contradictions = [
  {
    id: 'questioned-father', requires: ['before-light', 'called-back'],
    contexts: ['before-light', 'called-back', 'father-brighter'],
    label: "You said no one questioned the creator until we appeared. Didn't you question your father?",
    text: 'I said creation called back. You mistake the light for the things it illuminated. Or perhaps I have mistaken them.'
  },
  {
    id: 'enjoyed-suffering', requires: ['enjoy', 'age'], contexts: ['enjoy', 'age'],
    label: "You said you didn't enjoy evil. Then why did you enjoy our suffering?",
    text: 'I wondered when you would notice.'
  },
  {
    id: 'alone-with-lights', requires: ['darkness', 'other-lights'],
    requiresAny: [['memory', 'other-lights']], contexts: ['darkness', 'memory', 'other-lights'],
    label: 'You said you were alone. What about the other lights?',
    text: 'Alone is not the absence of others. It is the absence of anyone who can see you.'
  }
];
dialogues.push(...contradictions);
export const questionLabel = entry => entry.displayLabel || entry.label;
export function isUnlocked(entry, visited) {
  return (entry.requires || []).every(id => visited.has(id))
    || (entry.requiresAny || []).some(group => group.every(id => visited.has(id)));
}

const order = ['garden', 'test', 'upright', 'others', 'evil', 'identity', 'hands', 'light', 'memory', "human", "purpose", "work", "death", "burial", "remember", "hurry", "free", "hate", "darkness", "abandoned", "lied", "believe", "paradise", "return", "enjoy", "age"].concat(["before-humans","why-wait","before-light","other-lights","names-of-lights","fill-darkness","father-brighter","darkness-fear","darkness-end","shadows","called-back","happy","want-more","came-garden","become","god-knows","believe-father","want-god","nothing-darkness","darkness-ended","certain-light","you-darkness"]);
export function availableDialogues(visited) {
  return [...order.map(id => dialogues.find(entry => entry.id === id)), ...contradictions]
    .filter(entry => isUnlocked(entry, visited));
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
  age: ['hurry', 'hate', 'before-humans'],
  hurry: ['upright', 'work'],
  hate: ['darkness', 'age'],
  darkness: ['abandoned', 'light', 'before-humans'],
  abandoned: ['identity', 'memory'],
  lied: ['believe'],
  believe: ['identity'],
  paradise: ['return'],
  return: ['garden'],
  enjoy: ['age', 'hate'],
  light: ['darkness', 'memory', 'before-light', 'before-humans'],
  memory: ['darkness', 'abandoned'],
  "before-humans": ["why-wait","called-back","age"],
  "why-wait": ["before-light","other-lights","fill-darkness","called-back"],
  "before-light": ["father-brighter","other-lights","fill-darkness"],
  "other-lights": ["names-of-lights","fill-darkness","before-light"],
  "names-of-lights": ["other-lights","father-brighter","called-back"],
  "fill-darkness": ["darkness-end","darkness-fear","father-brighter"],
  "darkness-fear": ["darkness-end","shadows","fill-darkness"],
  "darkness-end": ["shadows","darkness-fear","god-knows","nothing-darkness"],
  "shadows": ["evil","father-brighter","darkness-fear","darkness-ended"],
  "called-back": ["happy","came-garden","upright","before-humans"],
  "happy": ["want-more","came-garden","why-wait","certain-light"],
  "want-more": ["become","upright","fill-darkness"],
  "came-garden": ["garden","upright","happy"],
  "become": ["happy","hands","fill-darkness","free"],
  "father-brighter": ["god-knows","before-light","fill-darkness"],
  "god-knows": ["believe-father","father-brighter"],
  "believe-father": ["want-god","nothing-darkness"],
  "want-god": ["nothing-darkness","darkness-end","before-light","fill-darkness"],
  "nothing-darkness": ["darkness-ended","darkness-fear","shadows","fill-darkness"],
  "darkness-ended": ["certain-light","other-lights","called-back","before-humans"],
  "certain-light": ["you-darkness","darkness-ended","believe-father"],
  "you-darkness": ["certain-light","identity","darkness"],
  'questioned-father': ['before-light', 'called-back'],
  'enjoyed-suffering': ['enjoy', 'age'],
  'alone-with-lights': ['darkness', 'other-lights', 'memory']
};

export function relatedDialogues(currentId, visited) {
  const unlocked = new Map(availableDialogues(visited).map(entry => [entry.id, entry]));
  const related = (followUps[currentId] || []).map(id => unlocked.get(id)).filter(Boolean);
  return [...related, ...contradictions.filter(entry => entry.contexts.includes(currentId) && unlocked.has(entry.id))];
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
      if (!entry || !isUnlocked(entry, visited)) return false;
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
      return { question: questionLabel(entry), text: entry.text };
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

