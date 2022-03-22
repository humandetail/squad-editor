<template>
  <div
    class="squad-editor-preview-wrapper markdown-body"
    :class="isCollapsed ? 'collapsed' : ''"
    :style="wrapperStyle"
    id="J_squad-editor-preview-wrapper"
    v-html="parsedValue">
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import markdown from '../../../utils/markdownIt';
import { isCollapsedKey, inputValueKey } from '../../../config/provideKeys';

const isCollapsed = inject(isCollapsedKey, ref(false));
const inputValue = inject(inputValueKey, ref(''));

const wrapperStyle = computed(() => {
  return {
    width: isCollapsed.value ? 0 : '50%'
  }
});

const parsedValue = computed(() => {
  return markdown.render(inputValue.value) + '<br />';
})
</script>
