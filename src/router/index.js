import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
        path: '*',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('../views/user/home')
    },
    {
        path: '/log',
        name: 'login',
        component: () => import('../views/login')
    },

    {
        path: '/booking',
        name: 'booking',
        props: true,
        component: () => import('../views/user/booking')
    },
    {
        path: '',
        name: 'layout',
        component: () => import('../views/Layout'),
        children: [{
                path: 'dashboard',
                name: 'dashboard',
                component: () => import('../views/Dashboard/dashboard')
            },
            {
                path: 'allLab',
                name: 'dashboard.allLab',
                component: () => import('../views/Dashboard/allLab')
            },
            {
                path: 'users',
                name: 'dashboard.users',
                component: () => import('../views/Dashboard/users')
            },
            {
                path: 'books',
                name: 'books',
                component: () => import('../views/Dashboard/books')
            },
        ]
    }
]

export default new VueRouter({
    // mode: 'history',
    base: process.env.BASE_URL,
    routes
})