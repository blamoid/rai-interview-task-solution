<template>
  <v-app>
    <nav-bar @toggle-minified="minifiedMenu = !minifiedMenu" />
    <div>
      <nav-drawer :minified="minifiedMenu" />
    </div>

    <v-main>
      <v-container fluid>
        <router-view />
        <v-snackbar
          :model-value="errorText != null"
          color="error"
          location="bottom right"
        >
          {{ errorText }}
        </v-snackbar>
        <v-snackbar
          :model-value="messageText != null"
          color="success"
          location="bottom right"
        >
          {{ messageText }}
        </v-snackbar>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useReportingStore } from '@/stores/Reporting.ts';
import { computed, ref } from 'vue';
import NavBar from '@/components/navigation/NavBar.vue';
import NavDrawer from '@/components/navigation/NavDrawer.vue';

const reportingStore = useReportingStore();
const errorText = computed(() => reportingStore.errorText);
const messageText = computed(() => reportingStore.messageText);

const minifiedMenu = ref(true);
</script>
