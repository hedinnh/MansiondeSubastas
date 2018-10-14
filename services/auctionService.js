const { Auction, Customer, AuctionBid, connection } = require('../data/db');

const auctionService = () => {
    const getAllAuctions = () => {
        let ret = Auction.find({}, (err, artist) => {
            if (err) { throw new Error(err); }
        });
        return ret;
    };

    const getAuctionById = async (id) => {
        let foundOrNot = true;
        let ret = await Auction.findById(id, (err) => {
            if (err) {
                console.log('Auction not found');
                foundOrNot = false;
            }
        }).catch(err => [err]);
        if (!foundOrNot) {
            return -1;
        }
        return ret;
    };

    const getAuctionWinner = async auctionId => {
        let auction = await getAuctionById(auctionId);
        if (auction === -1) { return 0 };
        if (auction.auctionWinner === undefined) {
            return -1;
        }
        if (auction.endDate < Date.now()) {
            return 1;
        }
        return auction.auctionWinner;
    };

    const createAuction = (auction) => {
        Auction.create({
            artId: auction.artId,
            minimumPrice: auction.minimumPrice,
            endDate: auction.endDate
        }, err => {
            if (err) { throw new Error(err); }
        });
    };

    const getAuctionBidsWithinAuction = async auctionId => {
        let foundOrNot = true;
        let ret = await AuctionBid.find({ auctionId: auctionId }, (err) => {
            if (err) {
                foundOrNot = false;
            }
        }).catch(err => [err]);
        if (!foundOrNot) {
            return -1;
        }
        return ret;
    };

    const placeNewBid = async (auctionId, customerId, price) => {
        let auction = await getAuctionById(auctionId);
        let bids = await getAuctionBidsWithinAuction(auctionId);
        if (auction === -1) { return -2 };
        let currentBid = 0;
        for (const bid of bids) {
            if (currentBid <= bid.price && auctionId === auction.id) {
                currentBid = bid.price
            }
        }

        if (currentBid > auction.minimumPrice && price > currentBid && auction.auctionWinner !== undefined) {
            AuctionBid.create({
                auctionId: auctionId,
                customerId: customerId,
                price: price
            }, err => {
                if (err) { throw new Error(err); }
                Auction.findById(auctionId, async function (err, doc) {
                    if (err) { console.log(err); }
                    doc.auctionWinner = customerId;
                    doc.save();
                });
            });

        } else if (price <= auction.minimumPrice || price <= currentBid) {
            return -1;
        }
        if (auction.auctionWinner === undefined) {
            AuctionBid.create({
                auctionId: auctionId,
                customerId: customerId,
                price: price,
            }, err => {
                if (err) { throw new Error(err); }
                Auction.findById(auctionId, async function (err, doc) {
                    if (err) { console.log(err); }
                    doc.auctionWinner = customerId;
                    doc.save();
                });
            });
        }
    };

    return {
        getAllAuctions,
        getAuctionById,
        getAuctionWinner,
        createAuction,
        getAuctionBidsWithinAuction,
        placeNewBid
    };
};

module.exports = auctionService();
