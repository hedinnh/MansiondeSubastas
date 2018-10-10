const { Auction, Customer, AuctionBid, connection } = require('../data/db');

const customerService = require('.customerService');

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
        console.log(auction);
        if (auction.auctionWinner === undefined) {
            return -1;
        }
        //console.log(Date.now(), auction.endDate)
        if (auction.endDate < Date.now()) {
            return 1;
        }
        //customerService.get
        return auction.auctionWinner;
    };

    const createAuction = (auction) => {
        Auction.create({
            artId: auction.artId,
            minimumPrice: auction.minimumPrice,
            endDate: auction.endDate
        }, err => {
            if (err) { throw new Error(err); }
            console.log('Auction add ok');
        });
    };

    const getAuctionBidsWithinAuction = async auctionId => {
        let foundOrNot = true;
        let ret = await AuctionBid.find({ auctionId: auctionId }, (err) => {
            if (err) {
                console.log('No bid found');
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
                console.log('New Bid add ok (not first bid)');
                // Auction.findOneAndUpdate(auctionId, { $set: { auctionWinner: customerId } }, {new: true},async function (err, doc) {
                //     if (err) { console.log(err); }
                //     doc.auctionWinner = customerId;
                //     doc.save();
                //     console.log(doc.auctionWinner)
                //     console.log(doc, 'doc here')
                // });
                Auction.findById(auctionId, async function (err, doc) {
                    if (err) { console.log(err); }
                    doc.auctionWinner = customerId;
                    doc.save();
                });
            });

        } else if (price <= auction.minimumPrice || price <= currentBid) {
            console.log('in else if, no bid added')
            return -1;
        }
        if (auction.auctionWinner === undefined) {
            AuctionBid.create({
                auctionId: auctionId,
                customerId: customerId,
                price: price,
            }, err => {
                if (err) { throw new Error(err); }
                console.log('New Bid add ok(first bid)');
                // Auction.findOneAndUpdate(auctionId, { $set: { auctionWinner: customerId } }, function (err, doc) {
                //     console.log(doc)
                // });
                Auction.findById(auctionId, async function (err, doc) {
                    if (err) { console.log(err); }
                    doc.auctionWinner = customerId;
                    doc.save();
                });
            });
 
            console.log(await getAuctionById(auctionId), ' if auctionwinner is undefined')
        }

    };

    return {
        getAllAuctions,
        getAuctionById,
        getAuctionWinner,
        createAuction,
        getAuctionBidsWithinAuction,
        placeNewBid,
        getCustomerBids
    };
};

module.exports = auctionService();
