const Store = class {
    constructor(salesOrders = [], purchaseOrders = []) { //If params not passed, default to empyt arrays
        this.sales = salesOrders;
        this.purchases = purchaseOrders;
        this.shippingQueue = [];
        this.totalDemand = this.setTotals('sales');
        this.totalSupply = this.setTotals('purchases');
        this.purchaseOrderHead = 0;
    }
    initiateStore() {
        this.sortOrdersByDate('sales'); // Based on provided data, dates do not align (FIFO)
        this.sortOrdersByDate('purchases'); // Based on provided data, dates do not align (FIFO)
        this.demand = this.sales[0].quantity;
        this.supply = this.purchases[0].quantity;
        this.fillQueue(); // Iterates through both arrays
    }
    fillQueue() {
        this.shippingQueue = []; // Reset incase of adding New or updated
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
        // Create copy of current order
        let currentPurchaseOrder = this.purchases[this.purchaseOrderHead];
        if (!currentPurchaseOrder) {
            console.log('Message: Demand exceeds supply');
            let queueObject = { saleID: sale.id, deliveryDate: 'TBD: awaiting restock' };
            this.shippingQueue = [...this.shippingQueue, queueObject];
            return;
        }

        // If supply cant support the sale, recurrsively call func
        if (this.supply < this.demand && this.demand > 0) {
            // Add the next purchaseOrder to supply
            this.purchaseOrderHead = this.purchaseOrderHead + 1;
            this.supply = this.supply + this.purchases[this.purchaseOrderHead].quantity;

            this.handleQueue(sale);
            return;
        }

        // Pass first conditions ? prepare values and push to queue
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
        let expectedShipping = (deliveryDate.getDate() + 1) + shippingEstimate; // Weird I had to add and extra +1

        deliveryDate.setDate(expectedShipping);

        return deliveryDate.toLocaleString().split(',')[0]; // Customer only needs mm/dd/yyyy
    }
    showDeliveryDate(saleID) {
        let foundOrder = this.shippingQueue.find((order) => order.saleID === saleID.toUpperCase());

        if (foundOrder) {
            console.log('Message: We found your order. Expected Delivery = ', foundOrder.deliveryDate);
        } else {
            console.log('Message: Order was not found, please make sure the Sales ID is correct');
        }
    }
    updateOrder(type, orderInfo) {
        if (!orderInfo) {
            console.log('Error Message: No orderInfo provided.Expected format = {"id": string,"receiving/created": yyyy-mm-dd,"quantity": integer},')
        }
        let foundIndex = this[type].findIndex((order) => order.id === orderInfo.id);
        if (!foundIndex) {
            console.log(`Message: No existing order with id of ${orderInfo.id}`);
        }
        this[type][foundIndex] = orderInfo;

        console.log('Message: Order updated ✅')

        this.supply = this.purchases[this.purchaseOrderHead];
        this.purchaseOrderHead = 0;

        this.fillQueue();
    }
    addOrders(type, newOrders) {
        this[type] = [...this[type], ...newOrders];

        this.purchaseOrderHead = 0;
        this.supply = this.purchases[this.purchaseOrderHead];

        this.fillQueue();
    }
    sortOrdersByDate(orderType) {
        // Different order types have different keys for date
        let orderDateKey = orderType === 'sales' ? 'created' : 'receiving';

        // Don't need to run, if not enough
        if (this[orderType].length <= 1) {
            console.log(`Message: Not enough ${orderType} orders to sort`);
            return;
        }

        // slice a copy, run sort, assign to state
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
    evaluateInventory() { // "Nice to have" a quick check
        // Check totals are up to date
        this.setTotals('sales');
        this.setTotals('purchases');

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


module.exports = { Store };