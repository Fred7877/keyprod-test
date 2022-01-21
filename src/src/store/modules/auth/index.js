import {fetchData} from '../../../../services/fetchers'
import router from '../../../../router'

const state = {
    user: null,
};

const getters = {
    isAuthenticated: state => !!state.user,
    stateUser: state => state.user,
};

const actions = {
    async LogIn({commit}, User) {
        fetchData('login').then((response) => {
            for (let i in response) {
                if (response[i].username === User.get('username') && response[i].password === User.get('password')) {
                    // login success
                    commit('setUser', User.get('username'));
                    router.push({name: 'orders'});
                    break;
                }
            }
        })

        throw 'denied';
    },
    async logOut({commit}) {
        let user = null
        commit('logout', user)
        commit('resetState');
        await router.push({name: 'login'})
    }
};
const mutations = {
    setUser(state, username) {
        state.user = username
    },
    logout(state) {
        state.user = null
    },
};

export default {
    state,
    getters,
    actions,
    mutations
};