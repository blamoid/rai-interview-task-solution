<template>
  <v-dialog v-model="dialog" persistent max-width="700px" @keydown.esc="closeForm">
    <template #activator="{ props }">
      <slot name="activator" v-bind="{ props }">
        <v-btn v-bind="props"> New </v-btn>
      </slot>
    </template>
    <v-card>
      <v-form ref="form" lazy-validation @submit.prevent="submitForm">
        <v-card-title>
          {{ title }}
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select
                  :v-model="selectedTemplatesIds"
                  autofocus
                  :items="documentTemplates"
                  item-title="name"
                  item-value="id"
                  hint="Select document templates"
                  label="Document templates"
                  multiple
                  persistent-hint
                  required
                  :rules="[(v: unknown) => !!v || 'This field is required']"
                  :loading="loadingInProgress"
                  @update:model-value="updateSelectedTemplates($event as number[])"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="text" type="button" @click="closeForm">Close</v-btn>
          <v-spacer />
          <v-btn
            color="primary"
            variant="text"
            type="submit"
            :disabled="submitDisabled"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { type ComponentInstance, onMounted, ref } from 'vue';
import type { VForm } from 'vuetify/components';
import { useApi } from '@/api';
import { useReportingStore } from '@/stores/Reporting.ts';
import type { DocumentTemplateOut } from '@/api/resources/common';

const emit = defineEmits<{
  (e: 'template-matching-job-saved'): void;
}>();

defineSlots<{
  activator(props: { props: Record<string, any> }): any;
}>();

defineProps<{
  title: string;
}>();

const documentTemplates = ref<DocumentTemplateOut[]>([]);
const selectedTemplatesIds = ref<number[]>([]);

function updateSelectedTemplates(templateIds: number[]) {
  selectedTemplatesIds.value = templateIds;
}

const dialog = ref(false);

const form = ref<ComponentInstance<typeof VForm>>();

function closeForm() {
  dialog.value = false;
}

const api = useApi();
const reportingStore = useReportingStore();

const submitDisabled = ref(false);

const loadingInProgress = ref(true);

async function submitForm() {
  if (!form.value) return;

  const result = await form.value.validate();
  if (!result.valid) return;

  try {
    submitDisabled.value = true;
    await api.templateMatchingJob.create({
      document_template_ids: selectedTemplatesIds.value,
    });
    selectedTemplatesIds.value = [];
    emit('template-matching-job-saved');
    closeForm();
  } catch (error) {
    console.error(error);
    reportingStore.reportError('Failed to save template matching job.');
  } finally {
    submitDisabled.value = false;
  }
}

async function fetchDocumentTemplates() {
  try {
    loadingInProgress.value = true;
    documentTemplates.value = await api.documentTemplate.list();
  } catch (e) {
    console.error(e);
    reportingStore.reportError('Failed to fetch template matching jobs');
  } finally {
    loadingInProgress.value = false;
  }
}

onMounted(() => {
  fetchDocumentTemplates();
});
</script>
