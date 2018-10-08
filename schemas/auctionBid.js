const Schema = require('mongoose').Schema;

module.exports = new Schema({
    auctionId: { type: Schema.Types.ObjectId, required: true },
    customerId: { type: Schema.Types.ObjectId, required: true },
    price: { type: Number, required: true }
});
