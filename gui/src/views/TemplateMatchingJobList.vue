<template>
  <v-container>
    <v-card>
      <v-card-title> Jobs </v-card-title>
      <v-card-text>
        <v-data-table
          ref="dataTable"
          density="compact"
          :headers="headers"
          :loading="loadingInProgress"
          :items="jobs"
          :search="search"
          item-value="id"
          multi-sort
          class="mt-10 px-10"
          @click:row="handleRowClick"
        >
          <template #top>
            <v-toolbar flat density="compact">
              <v-text-field
                v-model="search"
                prepend-icon="mdi-magnify"
                label="Search"
                class="ml-1"
                single-line
                hide-details
              />
              <v-spacer />
              <template-matching-job-form
                title="New template matching job"
                :allow-file-upload="true"
                @template-matching-job-saved="fetchJobs"
              />
            </v-toolbar>
          </template>
          <template #item.actions="{ item }">
            <div class="d-inline-block text-no-wrap">
              <v-btn
                variant="plain"
                color="blue"
                icon="mdi-refresh"
                @click.stop="rerunJob(item.id)"
              />
              <v-btn
                variant="plain"
                color="red"
                icon="mdi-delete"
                @click.stop="deleteJob(item.id)"
              />
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import TemplateMatchingJobForm from '@/components/template-matching-job/TemplateMatchingJobForm.vue';
import { type ComponentInstance, onMounted, ref } from 'vue';
import type { TemplateMatchingJobOut } from '@/api/resources/TemplateMatchingJob.ts';
import { useApi } from '@/api';
import { useReportingStore } from '@/stores/Reporting.ts';
import type { VDataTable } from 'vuetify/components';
import router from '@/router';

const headers = [
  { title: 'ID', align: 'start', sortable: true, key: 'id' },
  { title: 'Created at', align: 'center', sortable: true, key: 'created_at' },
  { title: 'State', align: 'center', sortable: true, key: 'job_state' },
  { title: 'Actions', align: 'end', sortable: false, key: 'actions' },
] as const;

const search = ref('');

const api = useApi();
const reportingStore = useReportingStore();

const loadingInProgress = ref(true);
const jobs = ref<TemplateMatchingJobOut[]>([]);

const dataTable = ref<ComponentInstance<typeof VDataTable>>();

const handleRowClick = (_e: PointerEvent, row: any) => {
  router.push(`/template-matching-job/${row.item.id}`);
};

async function fetchJobs() {
  try {
    loadingInProgress.value = true;
    jobs.value = await api.templateMatchingJob.list();
  } catch (e) {
    console.error(e);
    reportingStore.reportError('Failed to fetch jobs');
  } finally {
    loadingInProgress.value = false;
  }
}

async function deleteJob(jobId: number) {
  try {
    const confirmed = confirm('Are you sure?');
    if (!confirmed) return;

    await api.templateMatchingJob.delete(jobId);
    await fetchJobs();
  } catch (e) {
    console.error(e);
    reportingStore.reportError('Failed to delete job');
  }
}

async function rerunJob(jobId: number) {
  try {
    const confirmed = confirm('Are you sure?');
    if (!confirmed) return;

    await api.templateMatchingJob.rerun(jobId);
    await fetchJobs();
  } catch (e) {
    console.error(e);
    reportingStore.reportError('Failed to rerun job');
  }
}

onMounted(() => {
  fetchJobs();
});
</script>
