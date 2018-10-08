const { Auction, AuctionBid, connection } = require('../data/db');

const auctionService = () => {
    const getAllAuctions = () => {
        let ret = Auction.find({}, (err, artist) => {
            if (err) { throw new Error(err); }
        });
        return ret;
    };

    const getAuctionById = async (id) => {
        let foundOrNot = true;
        let ret = await Auction.findById(id, (err, artist) => {
            if (err) {
                console.log('Artist not found');
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
        if (auction.auctionWinner === undefined) {
            return -1;
        }
        console.log(Date.now(), auction.endDate)
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
            console.log('Auction add ok');
        });
    };

    const getAuctionBidsWithinAuction = auctionId => {
        // Your implementation goes here
    };

    const placeNewBid = async (auctionId, customerId, price) => {
        let auction = await getAuctionById(auctionId);
        let currentBid = 0;
        await Auction.find({}).exec(function (err, docs) {
           docs.forEach(function (doc) {
                AuctionBid.find({}).exec(function (err, bids) {
                    bids.forEach(function (bid) {
                        if (currentBid <= bid.price && auctionId === doc.id) {
                            currentBid = bid.price
                            console.log(bid.price, "<-auctionbid currentbid->", currentBid)
                        }
                    })
                })
            })
        })
        setTimeout(() => console.log(currentBid), 3000);
        console.log(price, 'price')
        console.log(auction.minimumPrice, 'auction min price')
        console.log(currentBid, 'currentbid') // WHY THE FUCK IS THIS STILL 0 :D 
        if (currentBid > auction.minimumPrice && price > currentBid && auction.auctionWinner !== undefined) {
            AuctionBid.create({
                auctionId: auctionId,
                customerId: customerId,
                price: price
            }, err => {
                if (err) { throw new Error(err); }
                console.log('New Bid add ok (not first bid)');
            });

        } else if (price <= auction.minimumPrice || price <= currentBid) {
            console.log('in else if')
            return -1
        }
        if (auction.auctionWinner === undefined) {
            AuctionBid.create({
                auctionId: auctionId,
                customerId: customerId,
                price: price,
            }, err => {
                if (err) { throw new Error(err); }
                console.log('New Bid add ok(first bid)');
            });
            auction.auctionWinner = customerId;
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
