<template>
  <button
    v-if="icon !== '|'"
    class="btn-toolbar-item"
    :disabled="disabled"
    @click="$emit('item-click', toolName)">
    <span
      class="toolbar-icon"
      :title="toolName"
      v-html="iconHTML"
    />
  </button>

  <div
    v-else
    class="btn-toolbar-item divider">
    <span
      class="toolbar-icon"
      :title="toolName"
      v-html="iconHTML"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { defaultIcon, divider } from '../../assets/icons';

const props = withDefaults(defineProps<{
  toolName: string;
  icon: string;
  disabled?: boolean;
}>(), {
  toolName: '',
  icon: '',
  disabled: false
});

defineEmits<{(e: 'item-click', value: string): void}>();

const iconHTML = ref<string>(defaultIcon);

watch(() => props.icon, async (icon) => {
  if (!icon) return;

  if (icon === '|') {
    iconHTML.value = divider;
    return;
  }

  if (/<svg>(.*?)<\/svg>/.test(icon)) {
    iconHTML.value = icon;
    return;
  }

  const res: any = await import('../../assets/icons');
  if (res[icon]) {
    iconHTML.value = res[icon];
    return;
  }

  iconHTML.value = defaultIcon;
}, { immediate: true });
</script>
