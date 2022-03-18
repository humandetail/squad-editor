<template>
  <main
    class="squad-editor-main-wrapper"
    :style="size">
    <InputWrapper ref="editor" />

    <PreviewWrapper />
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import InputWrapper from './input/index.vue';
import PreviewWrapper from './preview/index.vue';

withDefaults(defineProps<{
  size: { minHeight: string; maxHeight: string; }
}>(), {
  size: () => {
    return { minHeight: '300px', maxHeight: '600px' }
  }
});

const editor = ref();

defineExpose({
  editor
})
</script>
