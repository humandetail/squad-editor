<script setup lang="ts">
import { ref } from 'vue';

import SquadEditor from '../../packages';
import '../../packages/squadEditor/assets/styles/dark.scss';

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>

  <SquadEditor :value="msg" maxHeight="1000px" />
</template>
