const { salesOrders, purchaseOrders } = require("./orders.js");

class Store {
    constructor(salesOrders = [], purchaseOrders = []) {
        this.sales = salesOrders;
        this.purchases = purchaseOrders;
        this.queue = [];
        this.demand = 0;
        this.supply = 0;
        this.head = 0;
        this.tail = 0;
    }
    initiateStore() {
        this.sortOrdersByDate('sales');
        this.sortOrdersByDate('purchases');
        this.fillQueue();
    }
    fillQueue() {
        this.setTotals();
        this.sales.forEach((sale, index) => {
            console.log({ sale, index })
            if (sale.quantity < this.supply) {
                this.head = index;
                let queueObject = {
                    saleID: sale.id,
                    expectedDelivery: this.getDeliveryEstimate(sale.quantity)
                }

            }
        });
    }
    showQueue() {
        console.log('Queue at this time: ')
        console.log(this.queue);
    }
    getDeliveryEstimate(saleQuantity) {
        let demand = saleQuantity;
        let currentPurchaseOrder = this.purchases[0];
        if (!currentPurchaseOrder) {
            console.log('Message: Demand exceeds supply');
            return;
        }

        console.log('new loop =========')
        console.log({ currentPurchaseOrder })
        console.log('supply ', currentPurchaseOrder.quantity, ' <= demand ', demand)

        if (currentPurchaseOrder.quantity <= demand) {
            this.purchases = this.purchases.slice(1);
            demand = demand - currentPurchaseOrder.quantity;
            console.log('after compute = ', { demand })
            if (demand > 0) {
                console.log('Need to run again ➿')
                this.getDeliveryEstimate(demand);
                return;
            }
        } else {
            this.purchases[0].quantity = currentPurchaseOrder.quantity - demand;
            console.log('before exiting loop ', { demand: 0, supply: this.purchases[0].quantity });
            console.log('exit loop')
            return currentPurchaseOrder.receiving;
        }

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
    evaluateInventory() {
        this.setTotals();

        if (this.demand > this.supply) {
            console.log(`Message: A new purchase order for ${this.demand - this.supply} items needs to be made`);
        } else {
            console.log(`Message: Supply is ahead by ${this.supply - this.demand}`);
        }
    }
    setTotals() {
        this.demand = this.sales.reduce((total, order) => {
            return total += order.quantity;
        }, 0);
        this.supply = this.purchases.reduce((total, order) => {
            return total += order.quantity;
        }, 0);
    }
}

let currentStore;

function allocate(salesOrders, purchaseOrders) {
    if (!salesOrders || !purchaseOrders) {
        console.log('Error Message: Please provide salesOrder & purchaseOrder values to allocate()');
    }

    if (!currentStore) {
        currentStore = new Store(salesOrders, purchaseOrders);
        currentStore.initiateStore();

        // currentStore.evaluateInventory(); //REMOVE
        // console.log('After Sort => ', currentStore) //REMOVE
        return;
    } else {
        console.log('Store exists, updating current store');
        return;
    }
}

allocate(salesOrders, purchaseOrders);