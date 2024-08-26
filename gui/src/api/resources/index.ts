import DocumentTemplateApi from '@/api/resources/DocumentTemplate.ts';
import type { ApiClient } from '@/api';

export default class Api {
  documentTemplate: DocumentTemplateApi;

  constructor(client: ApiClient) {
    this.documentTemplate = new DocumentTemplateApi(client);
  }
}
