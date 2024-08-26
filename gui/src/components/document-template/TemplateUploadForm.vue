<template>
  <v-dialog v-model="dialog" persistent max-width="700px" @keydown.esc="closeForm">
    <template #activator="{ props }">
      <v-btn v-bind="props" variant="text" icon="mdi-file-upload-outline" />
    </template>
    <v-card>
      <v-form ref="form" lazy-validation @submit.prevent="submitForm">
        <v-card-title> Upload template </v-card-title>
        <v-card-text>
          <v-file-input
            :model-value="file ? [file] : []"
            label="Template file"
            :rules="[ONLY_IMAGE_RULE, REQUIRED_FILE_RULE]"
            @update:model-value="updateFile($event)"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn @click="closeForm">Close</v-btn>
          <v-spacer />
          <v-btn color="primary" type="submit">Upload</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { VForm } from 'vuetify/components';
import { type ComponentInstance, ref } from 'vue';
import { ONLY_IMAGE_RULE, REQUIRED_FILE_RULE } from '@/lib/formRules.ts';
import { isArray } from 'lodash';
import { useApi } from '@/api';
import { useReportingStore } from '@/stores/Reporting.ts';

const templateProps = defineProps<{
  templateId: number;
}>();

const emit = defineEmits<{
  (e: 'template-updated'): void;
}>();

const dialog = ref(false);

const file = ref<File | undefined>(undefined);

function updateFile(files: File | File[]) {
  const newFile = isArray(files) ? files[0] : files;
  if (!newFile) return;

  file.value = newFile;
}

function closeForm() {
  dialog.value = false;
}

const api = useApi();
const reportingStore = useReportingStore();

const form = ref<ComponentInstance<typeof VForm>>();
const submitDisabled = ref(false);

async function submitForm() {
  if (!form.value) return;

  const result = await form.value.validate();
  if (!result.valid) return;

  try {
    submitDisabled.value = true;
    await api.documentTemplate.uploadTemplateFile(
      templateProps.templateId,
      file.value as File,
    );
    file.value = undefined;
    closeForm();
    emit('template-updated');
  } catch (e) {
    console.error(e);
    reportingStore.reportError('Failed to upload new template');
  } finally {
    submitDisabled.value = false;
  }
}
</script>
