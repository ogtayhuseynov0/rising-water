import { LocalStorage } from 'quasar'
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '/v1', component: () => import('pages/Index.vue') },
      { path: '/v2', component: () => import('pages/V2.vue') }
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/Auth.vue'),
    children: [
      { path: '/login', component: () => import('pages/Login.vue') }
    ],
    beforeEnter: (to, from, next) => {
      if (LocalStorage.getItem('access_token') !== null) {
        next('/dashboard/report')
      } else {
        next()
      }
    }
  },
  {
    path: '/dashboard/report',
    component: () => import('layouts/Dashboard.vue'),
    children: [
      { path: '/dashboard/report', component: () => import('pages/Dashboard.vue') }
    ],
    beforeEnter: (to, from, next) => {
      if (LocalStorage.getItem('access_token') === null) {
        next('/login')
      } else {
        next()
      }
    }
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
