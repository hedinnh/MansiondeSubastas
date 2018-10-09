const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();


const artistService = require('./services/artistService');
const artService = require('./services/artService');
const customerService = require('./services/customerService');
const auctionService = require('./services/auctionService');

router.get('/arts', async (req, res) => {
    let ret = await artService.getAllArts();
    return res.status(200).send(ret);
});

router.get('/arts/:id', async (req, res) => {
    const { id } = req.params;
    let art = await artService.getArtById(id);
    if (art === -1) { return res.status(404).send(); }
    return res.status(200).send(art).json();
});

router.post('/arts', async (req, res) => {
    const { body } = req;
    artService.createArt(body);
    return res.status(201).send();
});

router.get('/artists', async (req, res) => {
    let ret = await artistService.getAllArtists();
    return res.status(200).send(ret);
});

router.get('/artist/:id', async (req, res) => {
    const { id } = req.params;
    let artist = await artistService.getArtistById(id);
    if (artist === -1) { return res.status(404).send(); }
    return res.status(200).send(artist).json();
});

router.post('/artists', (req, res) => {
    const { body } = req;
    artistService.createArtist(body);
    return res.status(201).send();
});

router.get('/customers', async (req, res) => {
    let ret = await customerService.getAllCustomers();
    return res.status(200).send(ret);
});

router.get('/customers/:id', async (req, res) => {
    const { id } = req.params;
    let customer = await customerService.getCustomerById(id);
    if (customer === -1) { return res.status(404).send(); }
    return res.status(200).send(customer).json();

});

router.post('/customers', (req, res) => {
    const { body } = req;
    customerService.createCustomer(body);
    return res.status(201).send();
});

router.get('/auctions', async (req, res) => {
    let ret = await auctionService.getAllAuctions();
    return res.status(200).send(ret);
});

router.get('/auctions/temp/:id', async (req, res) => {
    const { id } = req.params;
    let ret = await auctionService.getAuctionBidsWithinAuction(id);
    return res.status(200).send(ret);
});

router.get('/auctions/:id', async (req, res) => {
    const { id } = req.params;
    let auction = await auctionService.getAuctionById(id);
    if (auction === -1) { return res.status(404).send(); }
    return res.status(200).send(auction).json();
});


router.post('/auctions', async (req, res) => {
    const { body } = req;
    auctionService.createAuction(body);
    return res.status(201).send();
});

router.post('/auctions/:id/bids', async (req, res) => {
    const { body } = req;
    const { id } = req.params;
    const price  = body.price;
    const customerId = body.customerId;
    let ret = await auctionService.placeNewBid(id, customerId, price);
    if(ret === -1) {
        return res.status(412).send();
    }
    return res.status(201).send();
});

router.get('/auctions/:id/winner', async (req, res) => {
    const { id } = req.params;
    let ret = await auctionService.getAuctionWinner(id);
    if(ret === -1) {
        return res.status(200).send('This auction has no bids');
    } else if(ret === 1) {
        return res.status(409).send();
    } else if(ret === 2) {
        return res.status(200).send(ret);
    }
});

app.use(bodyParser.json());
app.use('/api', router);

app.listen(3000, () => {
    console.log('app listening on port 3000');
});