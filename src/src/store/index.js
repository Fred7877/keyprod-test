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
        itemsParcel: [],
    }
}

export default new Vuex.Store({
    modules: {
        auth
    },
    getters: {
        getParcels: state => {
            let parcels = [];
            state.itemsParcel.forEach((obj) => {
                if (obj[1].orderNumber === state.order.number) {
                    parcels.push(obj[0]);
                }
            });
            return parcels;
        },
        getItemsParcels: state => {
            let parcels = [];
            state.itemsParcel.forEach((obj) => {
                if (obj[1].order === state.order.number) {
                    let quantityEntered = 0;
                    let totalWeight = 0;
                    obj[1].items.forEach(item => {
                        quantityEntered += item.quantityEntered;
                        totalWeight += item.weight * item.quantityEntered;
                    });
                    parcels.push([obj[0], quantityEntered, totalWeight]);
                }
            });

            return parcels;
        },
    },
    plugins: [createPersistedState()],
    state: getDefaultState(),
    mutations: {
        deleteParcel(state, parcel){
            let deleted = false;
            console.log(state.itemsParcel);
            state.itemsParcel.forEach((obj) => {
                if(obj[0] === parcel[0]) {
                    if(obj[1].items.length === 0) {
                        state.itemsParcel.splice(obj, 1);
                        deleted = true;
                    }
                }
            });

            return deleted;
        },
        addOrderParcel(state, parcelNum) {
            state.itemsParcel.push([parcelNum, {
                parcelNumber: parcelNum,
                orderNumber: this.state.order.number,
                order: state.order.number,
                items: []
            }]);
            console.log(state.itemsParcel);
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
        },
        pushItemsReady(state, payload) {
            state.itemsParcel.forEach((itemParcel) => {
                if (itemParcel[0] === payload.item.parcelNumber &&
                    itemParcel[1].order === state.order.number) {
                    itemParcel[1]['items'].push(payload.item)
                }
            });

            console.log(state.itemsParcel);
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
        addItemsReady(context, payload) {
            context.commit('pushItemsReady', payload);
        }
    }
})