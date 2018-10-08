const { Customer, connection } = require('../data/db');

const customerService = () => {
    const getAllCustomers = () => {
        let ret = Customer.find({}, (err, customer) => {
            if (err) { throw new Error(err); }
        });
        return ret;
    };

    const getCustomerById = async (id) => {
        let foundOrNot = true;
        let ret = await Customer.findById(id, (err, customer) => {
            if(err) {
                console.log('Customer not found');
                foundOrNot = false;
            }
        }).catch(err => [err]);
        if(!foundOrNot) {
            return -1
        }
        return ret;
    };

    const getCustomerAuctionBids = (customerId) => {
        // Your implementation goes here
    };

    const createCustomer = (customer) => {
        Customer.create({
            name: customer.name,
            username: customer.username,
            email: customer.email,
            address: customer.email
        }, err => {
            if (err) { throw new Error(err); }
            console.log('Customer add ok');
        })
    };

    return {
        getAllCustomers,
        getCustomerById,
        getCustomerAuctionBids,
        createCustomer
    };
};

module.exports = customerService();
