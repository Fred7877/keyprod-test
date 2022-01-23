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
        isParcelRemoved: false
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
                        // Todo : ça serai bien d'utiliser les méthodes (sumItem, sumWeight) de la mixin ici...
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
        resetIsRemovedParcel(state) {
            state.isParcelRemoved = false;
        },
        deleteParcel(state, parcel) {
            state.itemsParcel.forEach((obj, i) => {
                if (obj[0] === parcel[0]) {
                    if (obj[1].items.length === 0) {
                        state.itemsParcel.splice(i, 1);
                        state.isParcelRemoved = true
                    }
                }
            });
        },
        addOrderParcel(state, parcelNum) {
            state.itemsParcel.push([parcelNum, {
                parcelNumber: parcelNum,
                orderNumber: this.state.order.number,
                order: state.order.number,
                items: []
            }]);
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
        pushItemsReady(state, payload) { // Add article into parcel
            let index = null;

            state.itemsParcel.forEach((itemParcel, i) => {
                if (itemParcel[0] === payload.item.parcelNumber) {
                    index = i;

                    /* Aucune de ces méthodes ne fonctionne, il faut recharger la page manuellement pour que le nouvel item soit persisté dans itemsParcel,
                        sinon, le nouvel item viendra écraser l'ancien...
                     */

                    /*itemParcel[1].items.unshift(payload.item);
                    itemParcel[1].items.push(payload.item);*/
                    //Object.assign(state.itemsParcel[i][1].items, payload.item);
                    //Vue.set(itemParcel[1].items, itemParcel[1].items.length, payload.item);
                }
            });

            // Ne fonctionne pas vraiment non plus
            Vue.set(state.itemsParcel[index][1].items, state.itemsParcel[index][1].items.length, payload.item);
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
        }
    }
})