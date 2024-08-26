import { pick } from 'lodash';
import type { ApiClient } from '@/api';

interface DocumentTemplateBase {
  name: string;
  uploaded_at: string;
  template_filename: string;
  template_file_type: string;
}

export interface DocumentTemplateOut extends DocumentTemplateBase {
  id: number;
  created_at: string;
}

export interface DocumentTemplateJSONIn extends DocumentTemplateBase {}

export interface DocumentTemplateIn extends DocumentTemplateJSONIn {
  file: File;
}

export interface DocumentTemplateUpdate {
  name: string;
}

export default class DocumentTemplateApi {
  client: ApiClient;
  pathPrefix: string;

  constructor(client: ApiClient) {
    this.client = client;
    this.pathPrefix = '/document-template/';
  }

  async list(): Promise<DocumentTemplateOut[]> {
    return await this.client.get(this.pathPrefix);
  }

  create(params: DocumentTemplateIn): Promise<DocumentTemplateOut> {
    const formData = new FormData();
    formData.set('file', params.file, params.file.name);
    const whitelistedParams: Record<
      keyof DocumentTemplateJSONIn,
      string | null | File
    > = pick(params, [
      'name',
      'uploaded_at',
      'template_filename',
      'template_file_type',
    ]);
    formData.append('json_body', JSON.stringify(whitelistedParams));
    return this.client.postFormData(this.pathPrefix, formData);
  }

  detail(templateId: number): Promise<DocumentTemplateOut> {
    return this.client.get(`${this.pathPrefix}${templateId}`);
  }

  update(templateId: number, params: DocumentTemplateUpdate): Promise<null> {
    return this.client.put(`${this.pathPrefix}${templateId}`, params);
  }

  delete(templateId: number): Promise<null> {
    return this.client.delete(`${this.pathPrefix}${templateId}`);
  }

  async uploadTemplateFile(templateId: number | string, file: File): Promise<null> {
    const formData = new FormData();
    formData.set('file', file, file.name);
    return this.client.postFormData(
      `${this.pathPrefix}${templateId}/upload`,
      formData,
    );
  }

  downloadTemplateFile(templateId: number | string): Promise<Blob> {
    return this.client.getBlob(`${this.pathPrefix}${templateId}/download`);
  }
}
