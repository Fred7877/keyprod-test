export default {
    methods: {
        generateParcelNumber() {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            const charactersLength = characters.length;
            for (let i = 0; i < 12; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        },
        getColorStatusOrder(status) {
            switch (status) {
                case 'En cours':
                    return 'blue';

                case 'Traité':
                    return 'green';

                case 'Non traité':
                    return 'orange';

                case 'Anomalie':
                    return 'red';
            }
        },
        getQuantityEnteredForOrder(order) {
            let quantitiesEntered = 0;

            this.$store.state.itemsParcel.forEach((obj) => {
                if (order.number === obj[1].order) {
                    obj[1].items.forEach((parcelItem) => {
                        quantitiesEntered += parcelItem.quantityEntered;
                    });
                }
            });

            return quantitiesEntered;
        },
        getQuantityExpectedForOrder(order) {
            let quantitiesExpected = 0;
            if (order !== undefined && order !== null) {
                order.items.forEach((item) => {
                    if (item.quantity !== undefined) {
                        quantitiesExpected += item.quantity;
                    }
                });
            }

            return quantitiesExpected;
        },
        getQuantityEnteredForProduct(product) {
            let quantitiesEntered = 0;
            if (this.$store.state.itemsParcel !== undefined) {
                this.$store.state.itemsParcel.forEach((obj) => {
                    obj[1].items.forEach((item) => {
                        if (product.qrCode === item.qrCode) {
                            quantitiesEntered += item.quantityEntered;
                        }
                    });

                });
            }

            return quantitiesEntered;
        },
        realStatus: function (items, order) {
            if (items === undefined) {
                return 'Anomalie';
            }

            if (this.getQuantityEnteredForOrder(order) === 0) {
                return 'Non traité';
            }

            if (this.getQuantityExpectedForOrder(order) === this.getQuantityEnteredForOrder(order)) {
                return 'Traité';
            } else {
                return 'En cours';
            }
        },
    },
}