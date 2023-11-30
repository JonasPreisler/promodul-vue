import store from '@/state/store'

export default [
  {
    path: '/employee',
    name: 'employee',
    meta: {
      authRequired: true,
    },
    component: () => import('./views/employee/default'),
  },
   {
     path: '/dashboard',
     name: 'dashboard',
     meta: { authRequired: true },
     component: () => import('./views/charts/echart/index')
   },
   {
    path: '/owner_dashboard',
    name: 'owner_dashboard',
    meta: { authRequired: true },
    component: () => import('./views/owner/dashboard')
  },
 
  {
    path: '/main',
    name: 'main',
    component: () => import('./views/main/index'),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
        if (store.getters['auth/loggedIn']) {
          // Redirect to the home page instead
          next({ name: 'default' })
        } else {
          // Continue to the login page
          next()
        }
      },
    },
  },

  {
    path: '/login',
    name: 'login',
    component: () => import('./views/account/login'),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
        if (store.getters['auth/loggedIn']) {
          // Redirect to the home page instead
          next({ name: 'default' })
        } else {
          // Continue to the login page
          next()
        }
      },
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('./views/account/register'),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
        if (store.getters['auth/loggedIn']) {
          // Redirect to the home page instead
          next({ name: 'default' })
        } else {
          // Continue to the login page
          next()
        }
      },
    },
  },
  {
    path: '/forgot-password',
    name: 'Forgot password',
    component: () => import('./views/account/forgot-password'),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        // If the user is already logged in
        if (store.getters['auth/loggedIn']) {
          // Redirect to the home page instead
          next({ name: 'default' })
        } else {
          // Continue to the login page
          next()
        }
      },
    },
  },
  {
    path: '/logout',
    name: 'logout',
    meta: {
      authRequired: false,
      beforeResolve(routeTo, routeFrom, next) {
        
          store.dispatch('authfack/logout')
        
        const authRequiredOnPreviousRoute = routeFrom.matched.some(
          (route) => route.push('/login')
        )
        // Navigate back to previous page, or home as a fallback
        next(authRequiredOnPreviousRoute ? { name: 'default' } : { ...routeFrom })
      },
    },
  },
  {
         path: '/settings',
         name: 'settings',
         meta: { authRequired: true },
         component: () => import('./views/settings/index')
  },
  {
    path: '/company',
    name: 'company',
    meta: { authRequired: true },
    component: () => import('./views/company/index')

  },
  {
    path: '/resource',
    name: 'resource',
    meta: { authRequired: true },
    component: () => import('./views/resource/index')
  },
  {
    path: '/file-manager',
    name: 'file-manager',
    meta: { authRequired: true },
    component: () => import('./views/file-manager/index')
   },
   {
    path: '/tasks',
    name: 'tasks',
    meta: { authRequired: true },
    component: () => import('./views/tasks/index')
   },
   {
    path: '/manage-employees',
    name: 'manage-employees',
    meta: { authRequired: true },
    component: () => import('./views/manage-employees/index')
   },
   {
    path: '/',
    name: 'calendar',
    meta: { authRequired: true },
    component: () => import('./views/calendar/calendar')
   },
   {
    path: '/scheduler',
    name: 'scheduler',
    meta: { authRequired: true },
    component: () => import('./views/scheduler/index')
   },
   {
    path: "/projects",
    name: "projects",
    component: {
      render(c) {
        return c("router-view");
      }
    },
    children: [
      {
        path: "",
        component: () => import("./views/projects/index")
      },
      {
        path: "overview/:id",
        name: "overview",
        component: () => import("./views/projects/overview")
      }
    ]
  },
  {
    path: "/owner_companies",
    name: "owner_companies",
    component: {
      render(c) {
        return c("router-view");
      }
    },
    children: [
      {
        path: "",
        component: () => import("./views/owner/companies")
      },
      {
        path: "overview/:id",
        name: "overview",
        component: () => import("./views/owner/companies_dashboard")
      }
    ]
  },



  // Redirect any unmatched routes to the 404 page. This may
  // require some server configuration to work in production:
  // https://router.vuejs.org/en/essentials/history-mode.html#example-server-configurations
 
]
