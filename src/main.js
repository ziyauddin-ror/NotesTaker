// main.js file

import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './HomePage.vue';
import AboutPage from './AboutPage.vue';
import TodoPage from './TodoPage.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { 
            path: '/todo', 
            component: TodoPage 
        },
        {
            path: '/:pathMatch(.*)*', // 👈 catch-all for any unmatched route
            redirect: '/todo',
        },
    ]
});
createApp(App).use(router).mount('#app');