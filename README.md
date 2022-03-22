# SquadEditor

<p>
<a href="https://github.com/humandetail/squad-editor">
  <img src="https://img.shields.io/github/license/humandetail/squad-editor.svg" />
</a>
<a href="https://github.com/humandetail/squad-editor">
  <img src="https://img.shields.io/github/issues/humandetail/squad-editor.svg" />
</a>
<a href="https://github.com/humandetail/squad-editor">
  <img src="https://img.shields.io/github/forks/humandetail/squad-editor.svg" />
</a>
<a href="https://github.com/humandetail/squad-editor">
  <img src="https://img.shields.io/github/stars/humandetail/squad-editor.svg" />
</a>
</p>

## 📦 Install

Install with npm:

```bash
npm i squad-editor
```

Install with yarn:

```bash
yarn add squad-editor
```

> SquadEditor requires `vue` >= v3

## 🦄 Usage

```vue
<template>
  <squad-editor
    ref="squadEditorRef"
    v-model:value="value"
    :min-height="state.minHeight"
    :max-height="state.maxHeight"
    :tabKey="state.tabKey"
    :uploader="state.uploader"
  />
</template>

<script setup>
import { ref, reactive } from 'vue'
import SquadEditor from 'squad-editor'
import 'squad-editor/styles/index.css'

const value = ref('')
const squadEditorRef = ref(null)

const uploader = (file) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ name: 'pictureName', url: 'picture.jpg' })
    }, 3000)
  })
}

const state = rective({
  minHeight: '300px',
  maxHeight: '800px',
  tabKey: '  ',
  uploader
})
</script>
```

## 📄 License

[MIT License](https://github.com/humandetail/squad-editor/blob/main/LICENSE) © 2019-PRESENT [Humandetail](https://github.com/humandetail)