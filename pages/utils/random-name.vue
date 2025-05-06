<template>
  <div class="random-name-generator">
    <h2>Random Name Generator</h2>
    <div class="controls" style="flex-direction: column; align-items: flex-start; gap: 0.5em;">
      <div style="display: flex; gap: 1em; flex-wrap: wrap; align-items: center;">
        <span style="font-weight: bold;">Word Groups:</span>
        <label v-for="group in GROUP_KEYS" :key="group" style="display: flex; align-items: center; gap: 0.25em;">
          <input type="checkbox" v-model="selectedGroups" :value="group" />
          {{ group }}
        </label>
      </div>
      <div style="display: flex; gap: 0.5em; align-items: center;">
        <label for="format">Format:</label>
        <select v-model="format" id="format">
          <option value="PascalCase">PascalCase</option>
          <option value="camelCase">camelCase</option>
          <option value="snake_case">snake_case</option>
          <option value="kebab-case">kebab-case</option>
          <option value="ALL_CAPS">ALL_CAPS</option>
        </select>
        <button @click="generateName"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center">
          <Icon name="mdi:check-circle" class="w-5 h-5 mr-2" />
          Generate Name
        </button>
      </div>
    </div>
    <div class="output" v-if="name">
      <span>{{ name }}</span>
      <button @click="copyName" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center">
        <Icon name="mdi:content-copy" class="w-5 h-5 mr-2" />
        Copy
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const format = ref('kebab-case');
const name = ref('');

// Word groups
const WORD_GROUPS = {
  normie: [
    'golf', 'bravo', 'helium', 'unison', 'kayak', 'fusion', 'talent', 'envoy', 'anchor', 'nebula', 'breeze', 'zenith', 'parade', 'ignite', 'thrive', 'novel', 'glider', 'dynamo', 'whimsy', 'crystal', 'sable', 'kernel', 'luster', 'ripple', 'temple', 'matrix', 'island', 'fable', 'jovial', 'impact', 'mellow', 'legend', 'uplift', 'fluent', 'driven', 'ranger', 'hazard', 'amber', 'jigsaw', 'groove', 'vector', 'rocket', 'blazer', 'beacon', 'quiver', 'aspect', 'whale', 'oracle', 'pixel', 'zephyr', 'jungle', 'lantern', 'drifter', 'vivid', 'cobalt', 'gadget', 'prism', 'nectar', 'quartz', 'cascade', 'apex', 'violet', 'piano', 'yellow', 'robot', 'wander', 'magnet', 'echo', 'harbor', 'ember', 'nimbus', 'mango', 'blue', 'sky', 'pendant', 'breezy', 'sleek', 'snazzy', 'snappy', 'nudge', 'nuzzle', 'trump', 'wall', 'tariff', 'vibe', 'code', 'fire', 'mad', 'stuff', 'slop', 'salty', 'ate', 'noob', 'troll', 'yeet', 'bop', 'boppy', 'simp', 'cringe', 'opp', 'savage', 'twin', 'drip', 'flex', 'tea', 'goat', 'sheesh', 'glaze', 'chad', 'beta', 'mog', 'slay', 'fam', 'yap', 'yapping'
  ],
  'NATO phonetic': [
    'alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot', 'golf', 'hotel', 'india', 'juliet', 'kilo', 'lima', 'mike', 'november', 'oscar', 'papa', 'quebec', 'romeo', 'sierra', 'tango', 'uniform', 'victor', 'whiskey', 'xray', 'yankee', 'zulu'
  ],
  colors: [
    'amber', 'blue', 'cobalt', 'crimson', 'cyan', 'emerald', 'gold', 'indigo', 'ivory', 'jade', 'lavender', 'lilac', 'magenta', 'maroon', 'navy', 'olive', 'orange', 'peach', 'pink', 'plum', 'red', 'rose', 'ruby', 'sable', 'sapphire', 'scarlet', 'silver', 'teal', 'topaz', 'turquoise', 'violet', 'yellow'
  ],
  'gen alpha': [
    'rizz', 'rizzle', 'rizzly', 'gyatt', 'cook', 'rip', 'ripped', 'brain', 'rot', 'skibidi', 'ohio', 'sigma', 'sus', 'cap', 'aura', 'bruh', 'pookie', 'drip', 'flex', 'tea', 'goat', 'sheesh', 'glaze', 'chad', 'mog', 'slay', 'fam', 'yap', 'yapping', 'stuff', 'slop', 'fire', 'mad'
  ],
  animals: [
    'zebra', 'safari', 'meerkat', 'racoon', 'tuxedo', 'sphinx', 'whale', 'octave', 'lion', 'tiger', 'bear', 'fox', 'wolf', 'eagle', 'hawk', 'falcon', 'crane', 'owl', 'dove', 'sable', 'orca', 'otter', 'mole', 'mink', 'lynx', 'bison', 'moose', 'deer', 'elk', 'ram', 'goat', 'sheep', 'cow', 'bull', 'horse', 'mule', 'donkey', 'camel', 'llama', 'alpaca', 'yak', 'ox', 'panda', 'koala', 'kangaroo', 'lemur', 'monkey', 'ape', 'gorilla', 'baboon', 'gibbon', 'sloth', 'bat', 'rat', 'mouse', 'vole', 'shrew', 'rabbit', 'hare', 'beaver', 'porcupine', 'hedgehog', 'skunk', 'weasel', 'ferret', 'stoat', 'ermine', 'badger', 'otter', 'seal', 'walrus', 'whale', 'dolphin', 'porpoise', 'manatee', 'dugong', 'narwhal', 'beluga', 'orca', 'penguin', 'puffin', 'auk', 'gull', 'tern', 'skua', 'petrel', 'albatross', 'shearwater', 'fulmar', 'gannet', 'booby', 'frigate', 'cormorant', 'shag', 'pelican', 'heron', 'egret', 'bittern', 'stork', 'ibis', 'spoonbill', 'flamingo', 'crane', 'rail', 'coot', 'moorhen', 'bustard', 'ostrich', 'emu', 'cassowary', 'kiwi', 'tinamou', 'rhea', 'seriema', 'sunbittern', 'kagu', 'mesite', 'hoatzin', 'turaco', 'cuckoo', 'roadrunner', 'coucal', 'ani', 'owl', 'nightjar', 'frogmouth', 'oilbird', 'potoo', 'swift', 'hummingbird', 'kingfisher', 'bee-eater', 'roller', 'motmot', 'tody', 'jacamar', 'woodpecker', 'toucan', 'barbet', 'honeyguide', 'wryneck', 'piculet', 'sapsucker', 'flicker', 'woodcreeper', 'ovenbird', 'antbird', 'antthrush', 'antpitta', 'tapaculo', 'gnateater', 'crescentchest', 'ploughbill', 'donacobius', 'manakin', 'pipra', 'cotinga', 'becard', 'tityra', 'schnoz', 'grift'
  ]
};

const GROUP_KEYS = ['normie', 'NATO phonetic', 'colors', 'gen alpha', 'animals'];

const selectedGroups = ref([...GROUP_KEYS]); // default: all selected

// Union of all words (for fallback)
const WORD_LIST = GROUP_KEYS.flatMap(key => WORD_GROUPS[key]);

function getRandomWord(wordPool) {
  let word;
  do {
    word = wordPool[Math.floor(Math.random() * wordPool.length)];
  } while (word.length < 4 || word.length > 8);
  return word;
} // now takes wordPool argument

function formatWords(words, fmt) {
  switch (fmt) {
    case 'PascalCase':
      return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
    case 'camelCase':
      return words[0].toLowerCase() + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
    case 'snake_case':
      return words.map(w => w.toLowerCase()).join('_');
    case 'kebab-case':
      return words.map(w => w.toLowerCase()).join('-');
    case 'ALL_CAPS':
      return words.map(w => w.toUpperCase()).join('_');
    default:
      return words.join(' ');
  }
}

function generateName() {
  let tries = 0;
  let words, candidate;
  // Build the word pool from selected groups
  let wordPool = [];
  if (selectedGroups.value.length === 0) {
    wordPool = WORD_LIST;
  } else {
    wordPool = selectedGroups.value.flatMap(key => WORD_GROUPS[key]);
  }
  if (wordPool.length === 0) wordPool = WORD_LIST;
  do {
    const wordCount = Math.random() < 0.5 ? 2 : 3;
    words = [];
    for (let i = 0; i < wordCount; i++) {
      words.push(getRandomWord(wordPool));
    }
    candidate = formatWords(words, format.value);
    tries++;
  } while ((candidate.length > 31 || candidate.length < 8) && tries < 20);
  name.value = candidate;
}

function copyName() {
 navigator.clipboard.writeText(name.value);
}
</script>

<style scoped>
.random-name-generator {
  max-width: 400px;
  margin: 0 auto;
  padding: 1em;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #fafbfc;
}

.controls {
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin-bottom: 1em;
}

.output {
  display: flex;
  align-items: center;
  gap: 0.5em;
  font-weight: bold;
  font-size: 1.2em;
}

button {
  cursor: pointer;
}
</style>
