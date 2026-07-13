<template>
  <router-view />
</template>

<script setup lang="ts">
import { useMeta } from 'quasar';

useMeta({
  title: 'Console',
  titleTemplate: (title) => `${title} · Conecta Admin`,
});
</script>
