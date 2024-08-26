import axios from 'axios';
import type { App } from 'vue';
import type { AxiosRequestConfig, Method } from 'axios';
import Api from '@/api/resources';

type AdditionalRequestConfig = Omit<AxiosRequestConfig, 'method' | 'url' | 'data'>;

export interface ApiClient {
  get: <ResponseType>(
    path: string,
    requestConfig?: AdditionalRequestConfig,
  ) => Promise<ResponseType>;
  getBlob: (path: string) => Promise<Blob>;
  post: <DataType, ResponseType>(
    path: string,
    data?: DataType,
    requestConfig?: AdditionalRequestConfig,
  ) => Promise<ResponseType>;
  postFormData: <ResponseType>(
    path: string,
    data?: FormData,
    requestConfig?: AdditionalRequestConfig,
  ) => Promise<ResponseType>;
  put: <DataType, ResponseType>(
    path: string,
    data?: DataType,
    requestConfig?: AdditionalRequestConfig,
  ) => Promise<ResponseType>;
  delete: <ResponseType>(
    path: string,
    requestConfig?: AdditionalRequestConfig,
  ) => Promise<ResponseType>;
}

export interface ApiClientOptions {
  baseURL: string;
}

interface RequestOptions<DataType> {
  method: Method;
  url: string;
  data?: DataType;
  requestConfig?: AdditionalRequestConfig;
}

export class VueApiPlugin<T> {
  api: T;
  vueGlobalProperty: string;

  constructor(api: T, vueGlobalProperty?: string) {
    this.api = api;
    this.vueGlobalProperty = vueGlobalProperty || '$api';
  }

  install(app: App): void {
    app.config.globalProperties[this.vueGlobalProperty] = this.api;
  }
}

let matchingApi: Api | undefined = undefined;

export const createApiClient = ({ baseURL }: ApiClientOptions) => {
  const api = axios.create({
    baseURL,
  });

  async function request<DataType, ResponseType>({
    method,
    url,
    data,
    requestConfig = {},
  }: RequestOptions<DataType>) {
    const response = await api.request({ method, url, data, ...requestConfig });
    return response.data as ResponseType;
  }

  const client: ApiClient = {
    get: (url: string, requestConfig?: AxiosRequestConfig) =>
      request({ method: 'GET', url, requestConfig }),
    getBlob: (path, requestConfig: AxiosRequestConfig = {}) =>
      request({
        method: 'GET',
        url: path,
        requestConfig: {
          ...requestConfig,
          responseType: 'blob',
          headers: {
            Accept:
              'application/octet-stream,image/jpg,image/jpeg,image/gif,image/png,*/*',
          },
        },
      }),
    post: <DataType>(
      url: string,
      data: DataType,
      requestConfig?: AxiosRequestConfig,
    ) => request({ method: 'POST', url, data, requestConfig }),
    postFormData: <FormData>(
      url: string,
      formData: FormData,
      requestConfig: AxiosRequestConfig = {},
    ) =>
      request({
        method: 'POST',
        url,
        data: formData,
        requestConfig: {
          ...requestConfig,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      }),
    put: <DataType>(
      url: string,
      data: DataType,
      requestConfig?: AxiosRequestConfig,
    ) => request({ method: 'PUT', url, data, requestConfig }),
    delete: (url: string, requestConfig?: AxiosRequestConfig) =>
      request({ method: 'DELETE', url, requestConfig }),
  };

  matchingApi = new Api(client);

  return new VueApiPlugin(matchingApi);
};

export function useApi(): Api {
  if (!matchingApi) {
    throw 'Error: you need to create api first before using it in composition api';
  }

  return matchingApi;
}
