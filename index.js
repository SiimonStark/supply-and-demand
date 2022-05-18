const { salesOrders, purchaseOrders } = require("./orders.js");
const { Store } = require("./Store.js");

let firstStore; // declare globally to be set later

function allocate(salesOrders, purchaseOrders) {
    if (!salesOrders || !purchaseOrders) {
        console.log('Error Message: Please provide salesOrder & purchaseOrder values to allocate()');
    }

    firstStore = new Store(salesOrders, purchaseOrders);

    firstStore.initiateStore(); // Set default values and sort arrays by date
    firstStore.showQueue();

    return firstStore.shippingQueue;
}

allocate(salesOrders, purchaseOrders);

// ** Add extra function calls below this line
// ** ----------------------------------------

// let ordersToAdd = [
//     {
//         'id': 'P6',
//         'receiving': '2020-03-06',
//         'quantity': 1
//     },
//     {
//         'id': 'P7',
//         'receiving': '2020-03-30',
//         'quantity': 1
//     }
// ]

// currentStore.addOrders('purchases', ordersToAdd);

// currentStore.updateOrder('purchases', {
//     'id': 'P2',
//     'receiving': new Date(),
//     'quantity': 1
// });