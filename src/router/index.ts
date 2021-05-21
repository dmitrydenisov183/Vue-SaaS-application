import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import TheDashboard from '@/views/TheDashboard.vue'
import TheSignUp from '@/views/TheSignUp.vue'
import TheEmailVerification from '@/views/TheEmailVerification.vue'
import TheLogin from '@/views/TheLogin.vue'
import ThePasswordReset from '@/views/ThePasswordReset.vue'
import TheNewPassword from '@/views/TheNewPassword.vue'
import TheInboxes from '@/views/TheInboxes.vue'
import TheInbox from '@/views/TheInbox.vue'
import TheAccountDetails from '@/views/TheAccountDetails.vue'
import TheBilling from '@/views/TheBilling.vue'
import ThePageNotFound from '@/views/ThePageNotFound.vue'
import AuthModule from '@/store/modules/AuthModule'
import { getEmailByInboxId } from '@/utils/misc'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: '',
    redirect: 'inboxes',
    component: TheDashboard,
    children: [
      {
        path: '/inboxes',
        name: 'inboxes',
        component: TheInboxes,
        meta: {
          title: 'Inboxes',
          authRequired: true,
          verifyRequired: true
        }
      },
      {
        path: '/inboxes/:inboxId',
        name: 'inbox-details',
        component: TheInbox,
        meta: {
          title: '',
          authRequired: true,
          verifyRequired: true
        }
      },
      {
        path: '/account-settings',
        name: 'account-settings',
        component: TheAccountDetails,
        meta: {
          title: 'Account Settings',
          authRequired: true,
          verifyRequired: true
        }
      },
      {
        path: '/billing',
        name: 'billing',
        component: TheBilling,
        meta: {
          title: 'Billing',
          authRequired: true,
          verifyRequired: true
        }
      }
    ]
  },
  {
    path: '/sign-up',
    name: 'sign-up',
    component: TheSignUp,
    meta: {
      title: 'Sign Up',
      guest: true
    }
  },
  {
    path: '/email-verification',
    name: 'Email verification',
    component: TheEmailVerification,
    meta: {
      title: 'Email Verification'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: TheLogin,
    meta: {
      title: 'Log In',
      guest: true
    }
  },
  {
    path: '/password-reset',
    name: 'password-reset',
    component: ThePasswordReset,
    meta: {
      title: 'Password Reset',
      guest: true
    }
  },
  {
    path: '/new-password',
    name: 'new-password',
    component: TheNewPassword,
    meta: {
      title: 'New Password',
      guest: true
    }
  },
  {
    path: '*',
    name: 'page-not-found',
    component: ThePageNotFound,
    meta: {
      title: '404 Page Not Found'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  const title = to.name === 'inbox-details' ? 'Inbox Details' : to.meta.title

  document.title = `${title} | Warmup Inbox`

  if (to.meta.authRequired && !AuthModule.isAuthenticated) {
    next({ path: '/login', replace: true })

    return
  }

  if (to.meta.guest && AuthModule.isAuthenticated) {
    next({ path: '/inboxes', replace: true })

    return
  }

  next()
})

export default router
