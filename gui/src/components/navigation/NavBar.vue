<template>
  <v-app-bar app clipped-left theme="dark">
    <v-app-bar-nav-icon @click="$emit('toggleMinified')" />
    <v-app-bar-title> Template matching manager </v-app-bar-title>
  </v-app-bar>
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'toggleMinified'): void;
}>();
</script>
