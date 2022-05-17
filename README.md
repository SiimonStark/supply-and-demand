# supply-and-demand

This is a FIFO problem. We have products arriving based on supply, and then sent to customers based on demand.

- Demand is from customers

- Supply is from the vendors

- Sales Orders are orders created by a customer for us to provide a product

## This is the demand

- 'created': when the sales order was created

- 'quantity': how many items the customer wants

- Purchase Orders are orders created by us to receive a product

  - This is the supply

- 'receiving': when we expect to receive the product

- 'quantity': how many we will be receiving

### We want to supply the products to the customers in the order in which they were requested

 ```text
// Implement the function 'allocate'

// The function should return an Array of elements. Each element should include
 - the ID of the sales order
 - the date the customer should expect to get the item
 ```

// *Additional*

- we only send the product once we have enough for that sales order
- (so if the sales order is for 2, we need to have 2 available before sending)
- the function should support any number of sales orders or purchase orders
- to make it simple we only have one product
- Good understanding of the original business problem
- Solution should work for various input values For example, if the quantity is increased on a single purchase order, the solution should still work
- Reasonably efficient design – no unnecessary processing
- Fault tolerant, Should handle invalid input values
- Clear and readable code – comments are helpful
- Meaningful variable and function names
