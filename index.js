const { salesOrders, purchaseOrders } = require("./orders.js");

class Store {
    constructor(salesOrders = [], purchaseOrders = []) {
        this.sales = salesOrders;
        this.purchases = purchaseOrders;
        this.queue = [];
        this.head = 0;
        this.tail = 0;
    }
    updateOrder(id, newQuantity) {
        let typeOfOrder = id.split('')[0] === 's' ? 'sales' : 'purchases';
        let orderToUpdate = this[typeOfOrder].find(order => order.id === id);
        if (orderToUpdate) {
            orderToUpdate.quantity = newQuantity;
        }
        console.log(orderToUpdate);
    }
    sortOrdersByDate(orderType) {
        let orderDateKey = orderType === 'sales' ? 'created' : 'receiving';
        if (this[orderType].length <= 1) {
            console.log(`Message: Not enough ${orderType} orders to sort`);
            return;
        }

        this[orderType] = this[orderType].slice().sort((a, b) => {
            let dateA = new Date(a[orderDateKey]);
            let dateB = new Date(b[orderDateKey]);

            if (!dateA || !dateB) {
                console.log('Error Message: Check date formats/values');
                return;
            } else {
                return dateA - dateB;
            }
        }
        );
    }
}

let currentStore;

function allocate(salesOrders, purchaseOrders) {
    if (!salesOrders || !purchaseOrders) {
        console.log('Error Message: Please provide salesOrder & purchaseOrder values to allocate()');
    }

    if (!currentStore) {
        currentStore = new Store(salesOrders, purchaseOrders);
        currentStore.sortOrdersByDate('sales');
        currentStore.sortOrdersByDate('purchases');
        console.log('After Sort => ', currentStore) //REMOVE
        return;
    } else {
        console.log('Store exists, updating current store');
        return;
    }
}

allocate(salesOrders, purchaseOrders);