import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import OurStoryView from '../views/OurStoryView.vue'
import WeddingView from '../views/WeddingView.vue'
import ProposalView from '../views/ProposalView.vue'
import HelpView from '../views/HelpView.vue'
import TravelView from '../views/TravelView.vue'
import ContactView from '../views/ContactView.vue'
import Login from '../views/Login.vue'
import Admin from '../views/Admin.vue'
import AutoRsvp from '../views/AutoRsvp.vue'
import Invites from '../views/InvitesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/story',
      name: 'Our Story',
      component: OurStoryView,
    },
    {
      path: '/wedding',
      name: 'The Wedding',
      component: WeddingView,
    },
    {
      path: '/proposal',
      name: 'The Proposal',
      component: ProposalView,
    },
    {
      path: '/help',
      name: 'Help Out',
      component: HelpView,
    },
    {
      path: '/travel',
      name: 'Travel Info',
      component: TravelView,
    },
    {
      path: '/contact',
      name: 'Contact',
      component: ContactView,
    },
    { path: '/login', component: Login },
    {
      path: '/admin',
      component: Admin,
      meta: { requiresAuth: true },
    },
    { path: '/rsvp', component: AutoRsvp },
    {
      path: '/invites',
      component: Invites,
      meta: { requiresAuth: true },
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0, behavior: 'smooth' }
  },
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
