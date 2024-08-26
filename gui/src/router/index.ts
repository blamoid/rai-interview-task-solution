import { createRouter, createWebHistory } from 'vue-router';
import DocumentTemplateList from '@/views/DocumentTemplateList.vue';
import TemplateMatchingJobList from '@/views/TemplateMatchingJobList.vue';
import TemplateMatchingJobDetail from '@/views/TemplateMatchingJobDetail.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/document-template',
      name: 'DocumentTemplateList',
      component: DocumentTemplateList,
    },
    {
      path: '/template-matching-job',
      name: 'TemplateMatchingJobList',
      component: TemplateMatchingJobList,
    },
    {
      path: '/template-matching-job/:id',
      name: 'TemplateMatchingJobDetail',
      component: TemplateMatchingJobDetail,
    },
  ],
});

export default router;
