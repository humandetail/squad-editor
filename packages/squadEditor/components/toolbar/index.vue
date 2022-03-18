<template>
  <section class="squad-editor-toolbar-wrapper">
    <div class="toolbar-fluid">
      <template
        v-for="(item, index) in toolbars"
        :key="item.name + index">
        <ToolbarIcon
          v-if="!item.chidren"
          :disabled="item.disabled"
          :tool-name="item.name"
          :text="item.text"
          :icon="item.icon"
          @item-click="$emit('item-click', $event)"
        />

        <div v-else class="has-children">
          <ToolbarIcon
            :tool-name="item.name"
            :text="item.text"
            :icon="item.icon"
          />

          <ul class="toolbar-children">
            <li
              v-for="(child, childIndex) of item.chidren"
              :key="child.name + childIndex"
              class="item"
              @click="$emit('item-click', child.name)">
              {{ child.text }}
            </li>
          </ul>
        </div>
      </template>
    </div>

    <div class="toolbar-fixed-fluid">
      <ToolbarIcon
        tool-name="fullscreen"
        icon="fullscreen"
        text="fullscreen"
        @item-click="$emit('item-click', $event)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ToolbarIcon from './Icon.vue';

const props = defineProps<{
  canUndo: boolean;
  canRedo: boolean;
}>();
defineEmits<{(e: 'item-click', value: string): void}>();

const toolbars = computed(() => [
  { name: 'undo', text: 'undo', icon: 'undo', disabled: !props.canUndo },
  { name: 'redo', text: 'redo', icon: 'redo', disabled: !props.canRedo },
  { name: '', text: '', icon: '|' },
  {
    name: 'heading',
    icon: 'heading',
    chidren: [
      { name: 'h1', text: '一级标题', icon: '' },
      { name: 'h2', text: '二级标题', icon: '' },
      { name: 'h3', text: '三级标题', icon: '' },
      { name: 'h4', text: '四级标题', icon: '' },
      { name: 'h5', text: '五级标题', icon: '' },
      { name: 'h6', text: '六级标题', icon: '' }
    ]
  },
  { name: 'italic', text: 'italic', icon: 'italic' },
  { name: 'strikethrough', text: 'strikethrough', icon: 'strikethrough' },
  { name: 'bold', text: 'bold', icon: 'bold' },
  { name: '', text: '', icon: '|' },
  { name: 'orderedList', text: 'orderedList', icon: 'orderedList' },
  { name: 'unorderedList', text: 'unorderedList', icon: 'unorderedList' },
  { name: '', text: '', icon: '|' },
  { name: 'code', text: 'code', icon: 'code' },
  { name: 'link', text: 'link', icon: 'link' },
  { name: 'picture', text: 'picture', icon: 'picture' }
]);
</script>
