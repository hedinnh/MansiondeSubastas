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

    const getAuctionBidsWithinAuction = async auctionId => {
        let foundOrNot = true;
        let ret = await AuctionBid.find({ auctionId: auctionId }, (err, bids) => {
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
        console.log(currentBid, 'currentbid') // WHY THE FUCK IS THIS STILL 0 :D 
        if (currentBid > auction.minimumPrice && price > currentBid && auction.auctionWinner !== undefined) {
            AuctionBid.create({
                auctionId: auctionId,
                customerId: customerId,
                price: price
            }, err => {
                if (err) { throw new Error(err); }
                console.log('New Bid add ok (not first bid)');
                console.log(auction, 'new bid added, not first bid')
            });

        } else if (price <= auction.minimumPrice || price <= currentBid) {
            console.log('in else if, no bid added')
            console.log(auction, ' auction in else if no bid added')
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
            console.log(await getAuctionById(auctionId), ' if auctionwinner is undefined')

            //auction.auctionWinner = customerId;
            await Auction.findOneAndUpdate({ id: auctionId }, { $set: { auctionWinner: customerId } }, function (err, doc) {
                console.log(doc);
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
        placeNewBid
    };
};

module.exports = auctionService();
