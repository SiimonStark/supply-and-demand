const { salesOrders, purchaseOrders } = require("./orders.js");

class Store {
    constructor(salesOrders = [], purchaseOrders = []) {
        this.sales = salesOrders;
        this.purchases = purchaseOrders;
        this.queue = [];
        this.totalDemand = this.setTotals('sales');
        this.totalSupply = this.setTotals('purchases');
        this.demand = salesOrders[0].quantity || 0;
        this.supply = purchaseOrders[0].quantity || 0;
        this.head = 0;
        this.tail = 0;
    }
    initiateStore() {
        this.sortOrdersByDate('sales');
        this.sortOrdersByDate('purchases');
        this.fillQueue();
    }
    fillQueue() {
        this.sales.forEach((sale, index) => {
            console.log({ sale, index })
            if (sale.quantity < this.supply) {
                this.handleQueue(sale);
            }
        });
        console.log(this.showQueue());
    }
    showQueue() {
        console.log('Queue at this time: ')
        console.log(this.queue);
    }
    handleQueue(sale, currentSupply) {
        let currentPurchaseOrder = this.purchases[0];
        if (!currentPurchaseOrder) {
            console.log('Message: Demand exceeds supply');
            return;
        }

        // Todo: Refactor using 'this' values
        console.log('Annoying ## ', { supply: this.supply }) //REMOVE
        let demand = sale.quantity;
        let supply;
        if (currentSupply) {
            supply = currentPurchaseOrder.quantity + currentSupply;
        } else {
            supply = currentPurchaseOrder.quantity;
        }

        console.log('new loop =========') //REMOVE
        console.log({ currentPurchaseOrder }) //REMOVE
        console.log('supply ', supply, ' <= demand ', demand) //REMOVE

        if (supply <= demand) {
            this.purchases = this.purchases.slice(1);
            demand = demand - supply;
            console.log('after compute = ', { demand, supply }) //REMOVE
            if (demand > 0) {
                console.log('Need to run again ♾') //REMOVE
                this.handleQueue(sale, supply);
                return;
            }
        } else {
            this.purchases[0].quantity = currentPurchaseOrder.quantity - demand;

            let deliveryDate = new Date(this.purchases[0].receiving);
            let shippingEstimate = 5;
            let expectedShipping = (deliveryDate.getDate() + 1) + shippingEstimate;
            deliveryDate.setDate(expectedShipping);
            const formattedDeliveryDate = deliveryDate.toLocaleString();

            let queueObject = {
                saleID: sale.id, deliveryDate: formattedDeliveryDate
            }
            this.queue = [...this.queue, queueObject];
            console.log('before exiting loop ', { queueObject, demand: 0, supply: this.purchases[0].quantity }); //REMOVE
            console.log('exit loop') //REMOVE
            return;
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
        if (this.totalDemand > this.totalSupply) {
            console.log(`Message: A new purchase order for ${this.totalDemand - this.totalSupply} items needs to be made`);
        } else {
            console.log(`Message: Supply is ahead by ${this.totalSupply - this.totalDemand}`);
        }
    }
    setTotals(type) {
        return this[type].reduce((total, order) => {
            return total += order.quantity;
        }, 0);
        // this.demand = this.sales.reduce((total, order) => { //REMOVE
        //     return total += order.quantity; //REMOVE
        // }, 0); //REMOVE
        // this.supply = this.purchases.reduce((total, order) => { //REMOVE
        //     return total += order.quantity; //REMOVE
        // }, 0); //REMOVE
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