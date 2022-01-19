import Vue from 'vue'
import Vuex from 'vuex'
import {fetchData} from '../../services/fetchers'
import createPersistedState from "vuex-persistedstate"
import auth from './modules/auth'

Vue.use(Vuex)

const getDefaultState = () => {
    return {
        orders: [],
        drawer: true,
        dialogQrCode: false,
        order: {},
        itemsReady: [],
        parcels: [],
        count: 0,
        itemsParcel: []
    }
}

export default new Vuex.Store({
    modules: {
        auth
    },
    getters: {
        getParcels: state => {
            if (state.parcels[state.order.number] !== undefined) {
                return state.parcels[state.order.number];
            }

            return [];
        },
        getItemsParcel: state => {
            let count = [];
            let countItemsParcels = [];

            if (state.itemsParcel[state.order.number] !== undefined) {
                state.parcels[state.order.number].forEach(function (parcel) {
                    count[parcel.number] = 0;
                    let countWeight = 0;
                    Object.values(state.itemsReady[state.order.number]).forEach(item => {
                        if (item.parcelNumber === parcel.number) {
                            count[parcel.number] = count[parcel.number]+1;
                            countWeight += item.weight
                        }
                    });

                    countItemsParcels.push([parcel.number, count[parcel.number], countWeight]);
                });
            }

            return countItemsParcels;
        }
    },
    plugins: [createPersistedState()],
    state: getDefaultState(),
    mutations: {
        addOrderParcel(state, parcelNum) {
            state.parcels[state.order.number].push({number: parcelNum})
            Vue.set(state.parcels, state.order.number, state.parcels[state.order.number])
        },
        setOrders(state) {
            fetchData('orders').then((response) => {
                state.orders = response;
            })
        },
        toggleMenu(state) {
            state.drawer = !this.state.drawer;
        },
        toggleDialogQrCode(state) {
            state.dialogQrCode = !state.dialogQrCode
        },
        setOrder(state, order) {
            state.order = order;
            // we create an array to keep the items ready
            if (state.itemsReady[order.number] === undefined) {
                state.itemsReady[order.number] = [];
            }
            // we create an array to keep parcel number
            if (state.parcels[order.number] === undefined) {
                state.parcels[order.number] = [];
            }

            // we create an array to item in from parcels
            if (state.itemsParcel[order.number] === undefined) {
                state.itemsParcel[order.number] = [];
            }
        },
        pushItemsReady(state, item) {
            state.itemsReady[state.order.number].push(item)
            Vue.set(state.itemsReady, state.order.number, state.itemsReady[state.order.number])

            state.parcels[state.order.number].forEach(function (parcel) {
                console.log(parcel, item.parcelNumber);

                Object.values(state.itemsReady[state.order.number]).forEach(item => {
                    if (item.parcelNumber === parcel.number) {
                        state.itemsParcel[state.order.number].splice(0, 0, [item.parcelNumber, item]);
                    }
                });
            });
        },
        resetState(state) {
            Object.assign(state, getDefaultState())
        }
    },
    actions: {
        setOrderParcel(context, parcelNum) {
            context.commit('addOrderParcel', parcelNum)
        },
        fetchOrders(context) {
            context.commit('setOrders');
        },
        addItemsReady(context, item) {
            context.commit('pushItemsReady', item);
        }
    }
})