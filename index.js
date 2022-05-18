const { salesOrders, purchaseOrders } = require("./orders.js");

class Store {
    constructor(salesOrders = [], purchaseOrders = []) {
        this.sales = salesOrders;
        this.purchases = purchaseOrders;
        this.shippingQueue = [];
        this.totalDemand = this.setTotals('sales');
        this.totalSupply = this.setTotals('purchases');
        this.purchaseOrderHead = 0;
    }
    initiateStore() {
        this.sortOrdersByDate('sales');
        this.sortOrdersByDate('purchases');
        this.demand = this.sales[0].quantity;
        this.supply = this.purchases[0].quantity;
        this.fillQueue();
    }
    fillQueue() {
        this.sales.forEach((sale) => {
            this.demand = sale.quantity;
            this.handleQueue(sale);
        });
    }
    showQueue() {
        console.log('Queue at this time: ')
        console.log(this.shippingQueue);
    }
    handleQueue(sale) {
        let currentPurchaseOrder = this.purchases[this.purchaseOrderHead];
        if (!currentPurchaseOrder) {
            console.log('Message: Demand exceeds supply');
            let queueObject = { saleID: sale.id, deliveryDate: 'TBD: awaiting restock' };
            this.shippingQueue = [...this.shippingQueue, queueObject];
            return;
        }

        // If supply can support the sale, add sale to queue
        //   create queue object with sale_id and expected_delivery
        if (this.supply < this.demand && this.demand > 0) {
            // If there isn't enough supply, add the next purchaseOrder
            this.purchaseOrderHead = this.purchaseOrderHead + 1;
            this.supply = this.supply + this.purchases[this.purchaseOrderHead].quantity;

            this.handleQueue(sale);
            return;
        }

        this.supply = this.supply - this.demand;
        this.demand = 0;
        let deliveryDate = this.setDeliveryDate();

        if (this.supply <= 0) {
            this.purchaseOrderHead = this.purchaseOrderHead + 1;
            if (this.purchases[this.purchaseOrderHead]) {
                this.supply = this.purchases[this.purchaseOrderHead].quantity;
            }
        }

        let queueObject = { saleID: sale.id, deliveryDate };
        this.shippingQueue = [...this.shippingQueue, queueObject];
        return;
    }
    setDeliveryDate(shippingEstimate = 5) {
        let deliveryDate = new Date(this.purchases[this.purchaseOrderHead].receiving);
        let expectedShipping = (deliveryDate.getDate() + 1) + shippingEstimate;

        deliveryDate.setDate(expectedShipping);

        return deliveryDate.toLocaleString().split(',')[0];
    }
    showDeliveryDate(saleID) {
        let foundOrder = this.shippingQueue.find((order) => order.saleID === saleID.toUpperCase());

        if (foundOrder) {
            console.log('We found your order. Expected Delivery = ', foundOrder.deliveryDate);
        } else {
            console.log('Message: Order was not found, please make sure the Sales ID is correct');
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
        currentStore.showQueue();
        console.log('After Sort => ', currentStore) //REMOVE
        return;
    } else {
        console.log('Store exists, updating current store');
        return;
    }
}

allocate(salesOrders, purchaseOrders);

// Add extra function calls below this line
// ----------------------------------------
