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
        getColorStatus(status) {
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
        realStatus: function (items, orderNumber) {
            if (items === undefined) {
                return 'Anomalie';
            }

            if (this.$store.state.itemsReady[orderNumber] === undefined ||
                this.$store.state.itemsReady[orderNumber] === null || this.$store.state.itemsReady[orderNumber].length === 0) {
                return 'Non traité';
            }

            if (this.$store.state.itemsReady[orderNumber].length === items.length) {
                return 'Traité';
            } else {
                return 'En cours';
            }
        },
    },
}