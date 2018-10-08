const { Artist, connection } = require('../data/db');


const artistService = () => {
    const getAllArtists = () => {
        let ret = Artist.find({}, (err, artists) => {
            if (err) { throw new Error(err); }
        });
        return ret;
    };
    const getArtistById = async (id) => {
        let foundOrNot = true;
        let ret = await Artist.findById(id, (err, artist) => {
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

    const createArtist = (input) => {
        Artist.create({
            name: input.name,
            nickname: input.nickname,
            address: input.address,
            memberSince: input.memberSince
        }, err => {
            if (err) { throw new Error(err); }
            console.log('Artist add ok');
        });
    };

    return {
        getAllArtists,
        getArtistById,
        createArtist,
        connection
    };
};

module.exports = artistService();
