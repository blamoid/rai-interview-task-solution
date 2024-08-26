import type { ApiClient } from '../ApiClient';
import type { DocumentTemplateOut } from './common';

export interface TemplateMatchingJobIn {
  document_template_ids: number[];
}

export enum JobState {
  SUBMITTED = 'SUBMITTED',
  RUNNING = 'RUNNING',
  FAILED = 'FAILED',
  SUCCEEDED = 'SUCCEEDED',
}

export interface TemplateMatchingJobJSONIn extends TemplateMatchingJobIn {}

export interface TemplateMatchingJobOut {
  id: number;
  created_at: string;
  job_state: JobState | null;
  job_id: string | null;
  document_templates: DocumentTemplateOut[];
}

export interface SampleResult {
  sample_id: number;
  score: number;
}

export interface TemplateMatchingJobTempLateResults {
  template_id: number;
  sample_results: SampleResult[];
}

export interface TemplateMatchingJobResults {
  results_per_template: TemplateMatchingJobTempLateResults[];
  total_run_time: number;
}

export default class TemplateMatchingJobApi {
  client: ApiClient;
  pathPrefix: string;

  constructor(client: ApiClient) {
    this.client = client;
    this.pathPrefix = '/template-matching-job/';
  }

  async list(): Promise<TemplateMatchingJobOut[]> {
    return await this.client.get(this.pathPrefix);
  }

  create(params: TemplateMatchingJobIn): Promise<TemplateMatchingJobIn> {
    return this.client.post(this.pathPrefix, params);
  }

  detail(jobId: number): Promise<TemplateMatchingJobOut> {
    return this.client.get(`${this.pathPrefix}${jobId}`);
  }

  rerun(jobId: number): Promise<null> {
    return this.client.post(`${this.pathPrefix}${jobId}/submit`);
  }

  delete(jobId: number): Promise<null> {
    return this.client.delete(`${this.pathPrefix}${jobId}`);
  }

  async results(jobId: number): Promise<TemplateMatchingJobResults> {
    return await this.client.get(`${this.pathPrefix}${jobId}/results`);
  }
}
