import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router/index'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        idToken: localStorage.getItem('tokin'),
        userId: localStorage.getItem('userId'),
        policyNumber: localStorage.getItem('policyNumber'),
        fullname: localStorage.getItem('fullname'),
    },
    mutations: {
        authUser(state, userData) {
            state.idToken = userData.token;
            state.userId = userData.userId;
            state.policyNumber = userData.policyNumber;
            state.fullname = userData.fullname;
        },
        clearAuth(state) {
            state.idToken = null
            state.userId = null
            state.policyNumber = null
            state.fullname = null

        },
    },
    actions: {
        login({
            commit
        }, userData) {
            // console.log(userData)
            localStorage.setItem('tokin', userData.token);
            localStorage.setItem('userId', userData.userId);
            localStorage.setItem('policyNumber', userData.policyNumber);
            localStorage.setItem('fullname', userData.fullName);

            commit('authUser', {
                token: localStorage.getItem('tokin'),
                userId: localStorage.getItem('userId'),
                policyNumber: localStorage.getItem('policyNumber'),
                fullname: localStorage.getItem('fullname'),

            });

            router.push('/dashboard');
            // });
        },
        logout({
            commit
        }) {
            commit('clearAuth')
            localStorage.setItem("tokin", "")
            localStorage.setItem("userId", "")
            localStorage.setItem('policyNumber', "")
            localStorage.setItem('fullname', "")
            router.replace('/home')
        },
    }
})