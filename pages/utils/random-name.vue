<template>
  <div class="random-name-generator">
    <h2>Random Name Generator</h2>
    <div class="controls">
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

const WORD_LIST = ['golf', 'bravo', 'helium', 'unison', 'kayak', 'oscar', 'fusion', 'talent', 'envoy', 
  'anchor', 'nebula', 'breeze', 'zenith', 'parade', 'india', 'ignite', 'thrive', 'zebra', 'lima', 'safari', 
  'velvet', 'sigma', 'octave', 'novel', 'xenon', 'glider', 'dynamo', 'whimsy', 'crystal', 'sable', 'kernel', 
  'luster', 'foxtrot', 'ultra', 'kilo', 'ripple', 'temple', 'matrix', 'island', 'alpha', 'fable', 'jovial', 
  'impact', 'mellow', 'legend', 'uplift', 'fluent', 'driven', 'ranger', 'hazard', 'amber', 'jigsaw', 'tango', 
  'groove', 'juliet', 'vector', 'rocket', 'blazer', 'delta', 'beacon', 'quiver', 'aspect', 'whale', 'oracle', 
  'pixel', 'zephyr', 'jungle', 'lantern', 'charlie', 'drifter', 'yonder', 'vivid', 'cobalt', 'gadget', 'prism', 
  'nectar', 'yodel', 'quartz', 'cascade', 'hotel', 'apex', 'violet', 'piano', 'yellow', 'robot', 'wander', 
  'sierra', 'magnet', 'echo', 'harbor', 'ember', 'nimbus', 'mango'];

function getRandomWord() {
  let word;
  do {
    word = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
  } while (word.length < 4 || word.length > 8);
  return word;
}

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
  do {
    const wordCount = Math.random() < 0.5 ? 2 : 3;
    words = [];
    for (let i = 0; i < wordCount; i++) {
      words.push(getRandomWord());
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
