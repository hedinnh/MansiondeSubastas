const { Art, connection } = require('../data/db')

const artService = () => {
    const getAllArts = () => {
        let ret = Art.find({}, (err) => {
            if (err) { throw new Error(err); }
        });
        return ret;
    };

    const getArtById = async (id) => {
        let foundOrNot = true;
        let ret = await Art.findById(id, (err) => {
            if (err) {
                console.log('Art not found');
                foundOrNot = false;
            }
        }).catch(err => [err]);
        if (!foundOrNot) {
            return -1;
        }
        return ret;
    };

    const createArt = (art) => {
        console.log(art);
        
        Art.create({
            images: art.images,
            title: art.title,
            artistId: art.artistId,
            description: art.description,
            date: art.date,
            isAuctionItem: art.isAuctionItem
        }, err => {
            if (err) { throw new Error(err); }
            console.log('Art add ok');
        })
    };

    return {
        getAllArts,
        getArtById,
        createArt
    };
};

module.exports = artService();
