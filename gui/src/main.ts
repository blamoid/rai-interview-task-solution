import { createApp } from 'vue';
import App from './App.vue';
import vuetify from '@/plugins/vuetify.ts';
import router from '@/router';
import { createApiClient } from '@/api';
import urlJoin from 'url-join';
import { createPinia } from 'pinia';

const app = createApp(App);

app.use(vuetify);

app.use(router);

const apiClient = createApiClient({
  baseURL: urlJoin(import.meta.env.VITE_APP_ENDPOINT, 'api'),
});

app.use(apiClient);

const pinia = createPinia();
app.use(pinia);

app.mount('#app');
