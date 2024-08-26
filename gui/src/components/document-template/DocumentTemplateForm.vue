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
                <v-text-field
                  v-model="documentTemplate.name"
                  autofocus
                  label="Name"
                  required
                  :rules="[(v: unknown) => !!v || 'This field is required']"
                />
                <v-file-input
                  v-if="allowFileUpload"
                  :model-value="documentTemplate.file ? [documentTemplate.file] : []"
                  label="Template file"
                  :rules="[ONLY_IMAGE_RULE, REQUIRED_FILE_RULE]"
                  @update:model-value="updateFile($event)"
                />
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
import { type ComponentInstance, ref, watch } from 'vue';
import type {
  DocumentTemplateIn,
  DocumentTemplateOut,
  DocumentTemplateUpdate,
} from '@/api/resources/DocumentTemplate.ts';
import { isArray, pick } from 'lodash';
import type { VForm } from 'vuetify/components';
import { useApi } from '@/api';
import { useReportingStore } from '@/stores/Reporting.ts';
import { ONLY_IMAGE_RULE, REQUIRED_FILE_RULE } from '@/lib/formRules.ts';

const templateProps = withDefaults(
  defineProps<{
    title?: string;
    editedTemplate?: DocumentTemplateOut;
    allowFileUpload?: boolean;
  }>(),
  {
    title: 'New document template',
    editedTemplate: undefined,
    allowFileUpload: false,
  },
);

const emit = defineEmits<{
  (e: 'document-template-saved'): void;
}>();

defineSlots<{
  activator(props: { props: Record<string, any> }): any;
}>();

const documentTemplate = ref<Partial<DocumentTemplateIn>>({});

function updateFile(files: File | File[]) {
  const file = isArray(files) ? files[0] : files;
  if (!file) return;

  documentTemplate.value.file = file;
}

const dialog = ref(false);

const form = ref<ComponentInstance<typeof VForm>>();

function closeForm() {
  dialog.value = false;
}

const api = useApi();
const reportingStore = useReportingStore();

const submitDisabled = ref(false);

async function submitForm() {
  if (!form.value) return;

  const result = await form.value.validate();
  if (!result.valid) return;

  try {
    submitDisabled.value = true;
    if (templateProps.editedTemplate?.id != null) {
      await api.documentTemplate.update(
        templateProps.editedTemplate.id,
        pick(documentTemplate.value, ['name']) as DocumentTemplateUpdate,
      );
    } else {
      await api.documentTemplate.create(
        documentTemplate.value as DocumentTemplateIn,
      );
    }
    documentTemplate.value = {};
    emit('document-template-saved');
    closeForm();
  } catch (error) {
    console.error(error);
    reportingStore.reportError('Failed to save document template.');
  } finally {
    submitDisabled.value = false;
  }
}

watch(
  () => templateProps.editedTemplate,
  (newEditedTemplate) => {
    if (newEditedTemplate) {
      documentTemplate.value = pick(newEditedTemplate, ['name']);
    }
  },
  {
    immediate: true,
  },
);
</script>
