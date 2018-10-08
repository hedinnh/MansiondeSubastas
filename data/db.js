const mongoose = require('mongoose');
const artSchema = require('../schemas/art');
const artistSchema = require('../schemas/artist');
const auctionSchema = require('../schemas/auction');
const auctionBidSchema = require('../schemas/auctionBid');
const customerSchema = require('../schemas/customer');

const connection = mongoose.createConnection('mongodb://hedinn:b00mb00m.123@ds029585.mlab.com:29585/mansion', { useNewUrlParser: true }, () => {
    console.log('Connected to mongo db server');
});

module.exports = {
    Art: connection.model('Art', artSchema),
    Artist: connection.model('Artist', artistSchema),
    Auction: connection.model('Auction', auctionSchema),
    AuctionBid: connection.model('AuctionBid', auctionBidSchema),
    Customer: connection.model('Customer', customerSchema),
    connection
};
