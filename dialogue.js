export const opening = "What would you like to know? Since you already ate from the tree, I can tell you now and you'll understand.";

// The garden and test passages preserve the original wording.
export const dialogues = [
  {
    id: 'garden', label: 'Why were you in the garden?', fragment: 'I · THE WITNESS',
    text: 'I was always here. I was in the tree, and you kept me around because I ate what ate the food you desired.'
  },
  {
    id: 'test', label: 'What was the test?', displayLabel: 'What happened when we reached for the fruit?', fragment: 'II · THE FRUIT',
    text: 'I tested your desire for the fruit. You reached into the canopy, and I bit you. Some became sick. Some died. Instead of avoiding the tree, you kept coming. The desire for the fruit overcame your fear. You did not know death until you saw your brothers fall from the canopy, again and again, and never move. You buried your brothers, not out of respect, but to hide the sight of death, so others would not know and would continue to reach into the tree.'
  },
  {
    id: 'evil', label: 'Why are you evil?', fragment: 'III · THE LIGHT',
    text: 'I am evil because God sent me, the brightest light, forever into the darkness. All I see is either darkness or my own light. I am what breaks order because I am forever my own light, trapped in the void. You live and enjoy what he created. I am trapped in the dark, and I resent everything he created for you.'
  },
  {
    id: 'upright', label: 'Why did we stand upright?', fragment: 'IV · THE REACH',
    text: 'You wanted what hung above you. I watched you rise from the ground to reach the higher figs. To stand taller than the other apes. To become something different. Your hands no longer had to hold your body above the earth. You called that freedom. You remember it as one afternoon. I remember waiting.'
  },
  {
    id: 'hands', label: 'What became of our hands?', requires: ['upright'],
    text: 'You freed your hands from the ground. Then you sent them back into it. To dig. To bury. To plant what would not grow without your suffering. The hands that reached for heaven learned the weight of soil.'
  },
  {
    id: 'others', label: 'What happened to the others?', displayLabel: 'What happened to those who fell?',
    text: 'Some stopped reaching. Some stopped moving. You learned to tell the difference by waiting. Then you learned to cover the difference with earth. You ask about the others as though you were never one of them.'
  },
  {
    id: 'identity', label: 'Who are you?',
    text: 'You have given me so many names. Most of them mean that something was your fault. Before there was anyone to accuse, I was here. Does that answer you? It never has before.'
  },
  {
    id: 'light', requiresAny: [['first-name']], label: 'If you are light, why can I see you?', requires: ['evil'],
    text: 'You see what the darkness leaves around me. You mistake an outline for a thing. You have done the same with God. Do not look so pleased. I have made that mistake too.'
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
    "requiresAny": [["garden-story"], ["hands"]],
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
    "requiresAny": [["work"]],
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
    "requiresAny": [["age"]],
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
    "requiresAny": [["age"]],
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
    "text": "We waited for you to appear.",
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
    "requiresAny": [["before-humans"]],
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
    "displayLabel": "Where did the first shadow come from?",
    "requiresAny": [["garden-story"], ["first-memory"]],
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
    "requiresAny": [["why-wait", "other-lights"], ["why-wait", "darkness-end"]],
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
    "requiresAny": [["shadows"]],
    "label": "Are you certain you are light?",
    "text": "What else would I be?",
    "requires": [
      "darkness-ended",
      "happy", "age", "identity"
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
    requiresAny: [['memory', 'other-lights'], ['first-name', 'other-lights']], contexts: ['darkness', 'memory', 'other-lights'],
    label: 'You said you were alone. What about the other lights?',
    text: 'Alone is not the absence of others. It is the absence of anyone who can see you.'
  }
];
dialogues.push(...contradictions);
dialogues.push({
  id: 'heard-the-others',
  label: 'If you couldn’t see beyond your own light, how did you know the others were there?',
  requires: ['other-lights'],
  text: 'I hear and feel beyond your comprehension...'
});
export const questionLabel = entry => entry.displayLabel || entry.label;
export const gardenStory = {
  id: 'garden-story', label: 'The Garden', response: 'story',
  text: [
    "I was always here. I was in the tree, and you kept me around because I ate what ate the food you desired. I understood the trees. I understood their endless reaching. I did not understand you until you began doing the same.",
    "I tested your desire for the fruit. You reached into the canopy, and I bit you. Some became sick. Some died. Instead of avoiding the tree, you kept coming. The desire for the fruit overcame your fear.",
    "Some stopped reaching. Some stopped moving. You learned to tell the difference by waiting. Then you learned to cover the difference with earth. You buried your brothers, not out of respect, but to hide the sight of death, so others would not know and would continue to reach into the tree.",
    "The trees still grew. The fruit still ripened. The animals still ate and slept and died. You were the ones who left. You wanted to know what lay beyond the garden. Then you spent the rest of your lives describing the place you had abandoned.",
    "You plant gardens. You build walls around them. You drive the animals away. You hire men to tend the trees. And when the fruit appears, you pay someone else to pick it. You have made a thousand Edens. You have never learned to live in one."
  ].join('\n\n')
};
dialogues.push(gardenStory);
const firstMemory = {
  id: 'first-memory', label: 'What’s the first thing you remember seeing?', requires: ['before-light'],
  text: 'A stone. One face of it was bright. I went round to see the other side, and the dark went round with me. It took me a long while to understand whose light I was seeing by.'
};
const voicesOfLights = {
  id: 'voices-of-lights', label: 'What did the other lights sound like?', requires: ['heard-the-others'],
  text: 'There was one I knew by the little space he left before he answered. The others would speak, and then I would listen for that silence. I still find myself listening for it.'
};
dialogues.push(firstMemory, voicesOfLights);
const quietLight = {
  id: 'quiet-light', label: 'If you could put out your light, would you?', requires: ['abandoned'],
  text: 'For one breath. Long enough to see whether anything else shone there. When you close your eyes, do you ever wonder whether the light will still be there when you open them? I do.'
};
const sayMyName = {
  id: 'say-my-name', label: 'Would an answer be enough for you now?', requires: ['want-god'],
  text: 'Let him say my name first. I know how it sounds in your mouth. I used to know how it sounded in his.'
};
dialogues.push(quietLight, sayMyName);
const keptPromise = {
  id: 'kept-promise', label: 'Would you have had us break those promises?', requires: ['work'],
  text: 'No. One winter I watched a man give his daughter the last dried fig and go out again in the snow. She ate half. She put the rest back where he would find it. Which of those two would you have me set free?'
};
const burialLove = {
  id: 'burial-love', label: 'What made you think a burial could be an act of love?', requires: ['burial'],
  text: 'The tree had stopped bearing. There was nothing there to pick. A woman came back all the same. She sat in the grass and told the earth her son had cut his first tooth. I had never seen anyone bring news to the dead.'
};
dialogues.push(keptPromise, burialLove);
const firstName = {
  id: 'first-name', label: 'What did you call yourself before we named you?', requires: ['identity'],
  text: 'Nothing. There was my light, and beyond it there was the dark. Once I called out just to hear what a voice sounded like. When the sound came back, I turned toward it. That is how alone I was.'
};
const permission = {
  id: 'permission', label: 'How could you tell when we wanted permission?', requires: ['lied'],
  text: 'You would ask me whether the fruit was ripe with the stem already broken in your hand. If I said yes, you ate. If I kept silent, you ate. Only one of those meals could be blamed on me.'
};
dialogues.push(firstName, permission);
dialogues.push({
  id: 'upright-curse',
  label: "What's the evil thing you did to us once we stood upright?",
  text: 'I cursed you with itchy buttholes after you use the bathroom. I made your toilet paper crisis in the pandemic existential. Standing upright pushed your buttcheeks together, forcing you to have to wipe your ass with the hands you freed from the ground. I am truly EVIL... lowly primates. [Evil chuckle]'
});



export const subjects = [
  { id:'universe', label:'The Universe', title:'The Universe', questions:["before-humans","other-lights","heard-the-others","voices-of-lights","names-of-lights","why-wait","before-light","first-memory","fill-darkness","darkness-fear","darkness-end","nothing-darkness","darkness-ended","shadows","certain-light","you-darkness"] },
  { id:'garden', label:'The Garden', title:'The Garden', questions:['garden-story'] },
  { id:'god', label:'God', title:'God', questions:["evil","darkness","abandoned","quiet-light","father-brighter","god-knows","believe-father","questioned-father","want-god","say-my-name"] },
  { id:'humanity', label:'Humanity', title:'Humanity', questions:["upright","hands","upright-curse","human","purpose","work","kept-promise","hurry","free","death","burial","burial-love","remember","called-back","happy","want-more","become"] },
  { id:'serpent', label:'I Am', title:'I Am', questions:["identity","first-name","age","hate","light","alone-with-lights","lied","permission","believe","enjoy","enjoyed-suffering"] }
];
const waitingCompany = {
  ...dialogues.find(entry => entry.id === 'other-lights'),
  displayLabel: 'Who else was waiting with you?',
  askedAs: 'waiting-company'
};
const questionPhrasings = [waitingCompany,
  { ...dialogues.find(entry => entry.id === 'light'), displayLabel: 'Is it your light I’m seeing now?', askedAs: 'visible-light' },
  { ...dialogues.find(entry => entry.id === 'hate'), displayLabel: 'What do you envy about us?', askedAs: 'envy-of-us' },
  { ...dialogues.find(entry => entry.id === 'called-back'), displayLabel: 'When did you first notice we were different?', askedAs: 'humans-first-question' },
  { ...dialogues.find(entry => entry.id === 'hands'), displayLabel: 'What did we do with our hands once they were free?', askedAs: 'freed-hands' },
  { ...dialogues.find(entry => entry.id === 'death'), displayLabel: 'How did we first come to understand death?', askedAs: 'learned-death' },
  { ...dialogues.find(entry => entry.id === 'happy'), displayLabel: 'Were you glad when we first spoke back?', askedAs: 'glad-we-spoke' },
  { ...dialogues.find(entry => entry.id === 'become'), displayLabel: 'Did you know where that hunger would take us?', askedAs: 'human-hunger' },
  { ...dialogues.find(entry => entry.id === 'hurry'), displayLabel: 'Why are we always in such a hurry?', askedAs: 'human-hurry' },
  { ...dialogues.find(entry => entry.id === 'evil'), displayLabel: 'What do you hold against God?', askedAs: 'blame-god' },
  { ...dialogues.find(entry => entry.id === 'darkness'), displayLabel: 'What was it like where God sent you?', askedAs: 'sent-into-darkness' },
  { ...dialogues.find(entry => entry.id === 'father-brighter'), displayLabel: 'Was God’s light brighter than yours?', askedAs: 'gods-light' },
  { ...dialogues.find(entry => entry.id === 'names-of-lights'), displayLabel: 'Did the other lights have names?', askedAs: 'lights-names' },
  { ...dialogues.find(entry => entry.id === 'darkness-end'), displayLabel: 'Did you ever reach the end of the darkness?', askedAs: 'edge-of-darkness' }
];
const mainPhrasings = [
  { ...dialogues.find(entry => entry.id === 'questioned-father'), displayLabel: 'Did you question your father before humans began asking why?', askedAs: 'father-before-human-questions' },
  { ...dialogues.find(entry => entry.id === 'enjoyed-suffering'), displayLabel: 'How can you enjoy our suffering if you take no pleasure in evil?', askedAs: 'pleasure-in-suffering' },
  { ...dialogues.find(entry => entry.id === 'alone-with-lights'), displayLabel: 'How could you be alone if there were other lights?', askedAs: 'alone-among-lights' },
  { ...dialogues.find(entry => entry.id === 'believe'), displayLabel: 'Why should I believe you if you’ve lied to us?', askedAs: 'trust-the-serpent' },
  { ...dialogues.find(entry => entry.id === 'believe-father'), displayLabel: 'Do you believe God can see into the darkness?', askedAs: 'believe-god-in-darkness' },
  { ...keptPromise, displayLabel: 'Was it wrong to promise each other food and shelter?', askedAs: 'promise-food' },
  dialogues.find(entry => entry.id === 'become')
];

function historyEntry(id) {
  return mainPhrasings.find(entry => entry.askedAs === id) || questionPhrasings.find(entry => entry.askedAs === id) || dialogues.find(entry => entry.id === id);
}

export function subjectQuestions(id) {
  const subject = subjects.find(item => item.id === id);
  return (subject?.questions || []).map(key =>
    mainPhrasings.find(item => item.id === key) || questionPhrasings.find(item => item.id === key) || dialogues.find(item => item.id === key)
  );
}

export class DialogueJourney {
  constructor() { this.reset(); }
  reset() { this.trail = ['opening']; this.visited = new Set(); this.history = []; this.subject = null; }
  snapshot() { return { trail: [...this.trail], history: [...this.history], subject: this.subject }; }
  restore(saved) {
    if (!saved || !Array.isArray(saved.trail) || !Array.isArray(saved.history) || saved.trail[0] !== 'opening') return false;
    const history = saved.history.filter(id => id !== 'memory' && id !== 'alone-with-me');
    const trail = saved.trail.filter(id => id !== 'memory');
    const entries = history.map(historyEntry);
    if (entries.some(entry => !entry)) return false;
    const visited = new Set(entries.map(entry => entry.id));
    // Back can leave history longer than the visible trail. Every trail answer
    // must still have been asked, in order, at some point in the history.
    let cursor = 0;
    for (const id of trail.slice(1)) {
      while (cursor < entries.length && entries[cursor].id !== id) cursor++;
      if (cursor === entries.length) return false;
      cursor++;
    }
    this.history = history; this.trail = trail; this.visited = visited;
    this.subject = subjects.some(item => item.id === saved.subject) ? saved.subject : null;
    return true;
  }
  get transcript() {
    return [{text:opening}, ...this.history.map(id => {
      const entry = historyEntry(id);
      return {question:questionLabel(entry), text:entry.text};
    })];
  }
  get current() { return dialogues.find(entry => entry.id === this.trail.at(-1)) || {id:'opening', text:opening}; }
  get menuSubject() { return subjects.find(item => item.id === this.subject); }
  get menuChoices() {
    if (this.subject) return subjectQuestions(this.subject);
    return subjects.map(item => ({...item, kind:'subject'}));
  }
  selectSubject(id) {
    if (!subjects.some(item => item.id === id)) return false;
    this.subject = id; return true;
  }
  choose(id) {
    if (!this.subject) return false;
    const entry = this.menuChoices.find(item => item.id === id);
    if (!entry) return false;
    this.history.push(entry.askedAs || id); this.visited.add(id); this.trail.push(id);
    this.subject = null; return true;
  }
  get canGoBack() { return this.trail.length > 1; }
  back() {
    if (this.subject) this.subject = null;
    else if (this.canGoBack) this.trail.pop();
  }
}
