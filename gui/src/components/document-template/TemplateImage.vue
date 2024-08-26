<template>
  <v-img
    v-intersect="loadImageBytes"
    :src="imageUrl"
    width="100"
    class="mx-auto"
    alt="Template image"
  >
    <template #placeholder>
      <v-progress-circular indeterminate color="grey" />
    </template>
  </v-img>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useApi } from '@/api';

const templateProps = defineProps<{
  templateId: number;
}>();

const imageUrl = ref<string | undefined>(undefined);

const api = useApi();

async function loadImageBytes() {
  try {
    let blob;
    blob = await api.documentTemplate.downloadTemplateFile(templateProps.templateId);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        imageUrl.value = e.target.result;
      }
    };
    reader.readAsDataURL(blob);
  } catch (e) {
    console.error(e);
  }
}
</script>

<style scoped></style>
