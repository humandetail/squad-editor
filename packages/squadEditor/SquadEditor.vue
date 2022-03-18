<template>
  <div
    ref="squadEditorContainer"
    class="squad-editor">
    <ToolbarWrapper
      :can-undo="canUndo"
      :can-redo="canRedo"
      @item-click="handleItemClick"
    />

    <EditorWrapper
      ref="editorWrapper"
      :size="{ minHeight, maxHeight }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, provide, readonly, Ref, nextTick, watch } from 'vue';
import { useFullscreen, useRefHistory } from '@vueuse/core';

import { useState } from './hooks';
import linkedScroll from './utils/linkedScroll';
import ToolbarHandler from './libs/ToolbarHandler';
import Uploader from './libs/Uploader';
import { isCtrlKeyDown } from './utils/tools';

import ToolbarWrapper from './components/toolbar/index.vue';
import EditorWrapper from './components/editor/index.vue';

import { FileUploadActionType, SelectionModeType, SelectionType } from './types';

const props = withDefaults(defineProps<{
  value: string;
  minHeight?: string,
  maxHeight?: string;
  tabKey?: string;
  uploader?: FileUploadActionType
}>(), {
  value: 'Welcome to use SquadEditor!',
  minHeight: '300px',
  maxHeight: '600px',
  tabKey: '  '
});
const emit = defineEmits<{(e: 'update:value', value: string): void}>();

const editorWrapper = ref();
const squadEditorContainer = ref();

// 预览区收起
const [isCollapsed, setIsCollapsed] = useState(false);

// 数据
const inputValue = ref<string>(props.value);
const { undo, redo, canUndo, canRedo } = useRefHistory(inputValue);

// 编辑器选区
const [selection, setSelection] = useState<SelectionType>([0, 0]);

const { toggle } = useFullscreen(squadEditorContainer);

// toolbar 点击处理
const handleItemClick = async (toolName: string) => {
  if (!toolName) return;

  if (toolName === 'fullscreen') {
    toggle();
    return;
  }

  if (toolName === 'undo') {
    undo();
    return;
  }

  if (toolName === 'redo') {
    redo();
    return;
  }
  toolbarHandler.exec(toolName, inputValue.value, selection.value);
}

// 处理按键事件
const handleKeyDown = async (e: KeyboardEvent) => {
  const target = e.target as HTMLTextAreaElement;
  setSelection([target.selectionStart, target.selectionEnd]);
  const ctrlKeyDown = isCtrlKeyDown(e);
  switch (e.key.toLowerCase()) {
    case 'enter':
      e.preventDefault();
      setSelection([target.selectionStart, target.selectionEnd]);
      await nextTick();
      toolbarHandler.handlerEnterPress(inputValue.value, selection.value);
      break;

    case 'z':
      if (ctrlKeyDown) {
        e.preventDefault();
        undo();
      }
      break;

    case 'y':
      if (ctrlKeyDown) {
        e.preventDefault();
        redo();
      }
      break;

    case 'tab':
      e.preventDefault();
      replaceValue(props.tabKey, 'end');
      break;
    default:
      break;
  }
}

// 处理粘贴事件
const handlePaste = async (e: ClipboardEvent) => {
  if (e.clipboardData?.types.includes('Files')) {
    e.preventDefault();
    await nextTick();
    if (props.uploader) {
      uploader.requestUpload(e.clipboardData.files);
    }
  }
}

// eslint-disable-next-line no-undef
const replaceValue = (replacement: string, selectMode: SelectionModeType = 'preserve', selection?: SelectionType) => {
  editorWrapper.value?.editor?.replaceText(replacement, selectMode, selection);
}

const handleChangeInputValue = (value: string) => {
  inputValue.value = value;
}

const toolbarHandler = new ToolbarHandler(replaceValue, setSelection);
const uploader = new Uploader(
  replaceValue,
  setSelection,
  () => selection.value,
  () => inputValue.value,
  props.uploader
);

watch(() => inputValue, (newValue) => {
  emit('update:value', newValue.value);
}, { immediate: true, deep: true });

onMounted(() => {
  linkedScroll();
});

provide<Ref<boolean>>('isCollapsed', readonly(isCollapsed));
provide<(value: boolean) => void>('setIsCollapsed', setIsCollapsed);

provide<Ref<string>>('inputValue', readonly(inputValue));
provide<(value: string) => void>('setInputValue', handleChangeInputValue);

provide<Ref<SelectionType>>('selection', selection);
provide<(value: SelectionType) => void>('setSelection', setSelection);

provide<(e: KeyboardEvent) => void>('handleKeyDown', handleKeyDown);
provide<(e: ClipboardEvent) => void>('handlePaste', handlePaste);

// eslint-disable-next-line no-undef
defineExpose<{replaceValue:(replacement: string, selectMode?: SelectionModeType, selection?: SelectionType) => void; }>({
  replaceValue
});
</script>
