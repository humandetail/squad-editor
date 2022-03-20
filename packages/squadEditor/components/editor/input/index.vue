<template>
  <div class="squad-editor-input-wrapper">
    <textarea
      ref="editor"
      class="squad-editor__editor"
      :value="inputValue"
      id="J_squad-editor-input-wrapper"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
      @keydown="handleKeyDown"
      @paste="handlePaste"
      @select="handleSelect"
    />

    <div
      class="btn-collapse"
      v-html="collapsedIcon"
      @click="setIsCollapsed(!isCollapsed)">
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, nextTick, ref, Ref } from 'vue';
import {
  isCollapsedKey,
  setIsCollapseKey,
  inputValueKey,
  setInputValueKey,
  selectionKey,
  setSelectionKey,
  handleKeyDownKey,
  handlePasteKey
} from '../../../config/provideKeys'

const editor = ref<HTMLTextAreaElement>();

const isCollapsed = inject(isCollapsedKey, ref(false));
const setIsCollapsed = inject(setIsCollapseKey, (_val: boolean) => {});

const inputValue = inject(inputValueKey, ref(''));
const setInputValue = inject(setInputValueKey, (_val: string) => {});

const selection = inject(selectionKey, ref<[number, number]>([0, 0]));
const setSelection = inject(setSelectionKey, (_val: [number, number]) => {});

const handleKeyDown = inject(handleKeyDownKey, (_val: KeyboardEvent) => {});
const handlePaste = inject(handlePasteKey, (_val: ClipboardEvent) => {})

const collapsedIcon = computed(() => {
  return !isCollapsed.value
    ? '<svg t="1646965483310" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1282" width="20" height="20"><path d="M213.333333 896a85.333333 85.333333 0 0 1-85.333333-85.333333V213.333333a85.333333 85.333333 0 0 1 85.333333-85.333333h597.333334a85.333333 85.333333 0 0 1 85.333333 85.333333v597.333334a85.333333 85.333333 0 0 1-85.333333 85.333333H213.333333m42.666667-341.333333h362.666667L469.333333 704l60.586667 60.586667L782.506667 512l-252.586667-252.586667L469.333333 320l149.333334 149.333333H256v85.333334z" fill="" p-id="1283"></path></svg>'
    : '<svg t="1646967162262" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1431" width="20" height="20"><path d="M810.666667 127.99999999a85.333333 85.333333 0 0 1 85.33333301 85.33333301L896.00000001 810.666667a85.333333 85.333333 0 0 1-85.33333301 85.33333301l-597.333334 0a85.333333 85.333333 0 0 1-85.33333301-85.33333301l0-597.333334a85.333333 85.333333 0 0 1 85.33333301-85.33333301L810.666667 127.99999999m-42.666667 341.33333301l-362.666667 0L554.666667 320l-60.586667-60.586667L241.493333 512l252.586667 252.586667L554.666667 704l-149.333334-149.333333L768 554.666667l0-85.333334z" fill="" p-id="1432"></path></svg>';
});

const handleInput = (e: any) => {
  setInputValue(e.target.value);
}

const handleChange = (e: any) => {
  setInputValue(e.target.value);
}

const handleFocus = (e: any) => {
  const target = e.target as HTMLTextAreaElement;

  setTimeout(() => {
    setSelection([target.selectionStart, target.selectionEnd]);
  }, 0);
}

const handleBlur = (e: FocusEvent) => {
  const target = e.target as HTMLTextAreaElement;

  setSelection([target.selectionStart, target.selectionEnd]);
}

const handleSelect = (e: any) => {
  const target = e.target as HTMLTextAreaElement;

  setSelection([target.selectionStart, target.selectionEnd]);
}

// eslint-disable-next-line no-undef
const replaceText = (text: string, selectMode: SelectionMode = 'preserve', newSelection?: [number, number]) => {
  editor.value?.focus();
  editor.value?.setRangeText(text, ...selection.value, selectMode);
  setInputValue(editor.value?.value ?? '');

  nextTick().then(() => {
    if (newSelection) {
      setSelection(newSelection);
      editor.value?.setSelectionRange(...newSelection);
    } else {
      // 重新获取 selection
      editor.value?.blur();
      editor.value?.focus();
    }
  });
}

defineExpose({
  replaceText
});
</script>
