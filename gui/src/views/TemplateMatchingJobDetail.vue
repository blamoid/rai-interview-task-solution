<template>
  <v-container :style="styleContainer">
    <v-card>
      <v-card-title> Job Detail - {{ $route.params.id }}</v-card-title>
    </v-card>
    <v-card>
      <v-card-text v-if="!loadingJob">
        <strong>State: </strong>
        {{ job.job_state }}
      </v-card-text>
      <v-skeleton-loader v-if="loadingJob" type="text" width="175px" />
      <v-card-text v-if="job.job_state === JobState.SUCCEEDED && !loadingJobResults"
        ><strong>Total run time: </strong
        >{{ jobResults.total_run_time }}</v-card-text
      >
      <v-skeleton-loader
        v-if="job.job_state === JobState.SUCCEEDED && loadingJobResults"
        type="text"
        width="200px"
      />
    </v-card>
    <v-card
      v-for="templateResult in jobResults.results_per_template"
      :key="templateResult.template_id"
    >
      <v-data-table
        ref="dataTable"
        density="compact"
        :headers="headers"
        :loading="loadingJobResults"
        :items="templateResult.sample_results"
        :search="search"
        item-value="sample_id"
        multi-sort
        class="mt-10 px-10"
      >
        <template #top>
          <strong>Template - {{ templateResult.template_id }}</strong>
        </template>
        <template #item.score="{ item }">
          <v-progress-linear
            :color="getProgressBarColor(item.score)"
            :model-value="item.score * 100"
            :height="20"
          >
            <template #default="{ value }">
              <strong>{{ Math.round(value) }}%</strong>
            </template>
          </v-progress-linear>
        </template>
      </v-data-table>
    </v-card>
    <v-card
      v-if="job.job_state === JobState.SUCCEEDED && loadingJobResults"
      class="mt-10 px-10"
    >
      <v-skeleton-loader type="table-tbody" />
    </v-card>
    <v-card
      v-if="job.job_state === JobState.SUCCEEDED && loadingJobResults"
      class="mt-10 px-10"
    >
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, type StyleValue } from 'vue';
import { useApi } from '@/api';
import { useReportingStore } from '@/stores/Reporting.ts';
import {
  JobState,
  type TemplateMatchingJobOut,
  type TemplateMatchingJobResults,
} from '@/api/resources/TemplateMatchingJob';
import { useRoute } from 'vue-router';

const route = useRoute();

const api = useApi();
const reportingStore = useReportingStore();

const loadingJob = ref(true);
const loadingJobResults = ref(true);

const styleContainer: StyleValue = {
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
};

const headers = [
  { title: 'ID', align: 'start', sortable: true, key: 'sample_id' },
  {
    title: 'Score',
    align: 'start',
    sortable: true,
    key: 'score',
    width: '100%',
  },
] as const;

const search = ref('');

const job = ref<Partial<TemplateMatchingJobOut>>({});
const jobResults = ref<Partial<TemplateMatchingJobResults>>({});

const getProgressBarColor = (value: number) => {
  if (value > 0.75) {
    return 'green-darken-3';
  }
  if (value > 0.5) {
    return 'blue-darken-3';
  }
  if (value > 0.25) {
    return 'yellow-darken-3';
  }
  return 'red-darken-3';
};

async function fetchJob() {
  try {
    loadingJob.value = true;
    const jobId = Number(route.params.id);
    job.value = await api.templateMatchingJob.detail(jobId);
    if (job.value.job_state === JobState.SUCCEEDED) {
      jobResults.value = await fetchJobResults(jobId);
    }
  } catch (e) {
    console.error(e);
    reportingStore.reportError('Failed to fetch template matching job');
  } finally {
    loadingJob.value = false;
  }
}

async function fetchJobResults(jobId: number) {
  try {
    loadingJobResults.value = true;
    return await api.templateMatchingJob.results(jobId);
  } catch (e) {
    console.error(e);
    reportingStore.reportError('Failed to fetch template matching job results');
    return {};
  } finally {
    loadingJobResults.value = false;
  }
}

onMounted(() => {
  fetchJob();
});
</script>
