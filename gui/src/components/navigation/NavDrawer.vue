<template>
  <v-navigation-drawer
    theme="dark"
    permanent
    clipped
    :rail="minified"
    rail-width="70"
  >
    <v-list nav>
      <v-list-item
        title="Document templates"
        to="/document-template/"
        prepend-icon="mdi-card-account-details-outline"
      />
      <v-list-item
        title="Template matching jobs"
        to="/template-matching-job/"
        prepend-icon="mdi-compare"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
defineProps<{
  minified: boolean;
}>();
</script>
