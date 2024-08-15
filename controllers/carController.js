const { getCarById, searchCars } = require('../models/postgresQueries');
const { getCarByIdMongo, searchCarsMongo } = require('../models/mongoQueries');

exports.getCar = async (req, res) => {
    const { id, db } = req.query;
    let car;

    if (!id || !db) {
    return res.status(400).send('Car ID and Database are required')
    }
    try{
        if (db === 'postgres') {
            car = await getCarById(id);
        } else if (db === 'mongo') {
            car = await getCarByIdMongo(id);
    } else {
        return.res.status(400).send('Invalid Database selection');
    }
    if(!car){
    return res.status(400).send('Car not found');
    }
    res.render('carDetail', { car });
    } catch (err){
    console.error(err);
    res.status(500).send('Error retrieving car details');
    }
};

exports.search = async (req, res) => {
    const { query, db } = req.query;
    let cars;

    if (!query || !db) {
        return res.status(400).send('Search query and database selection are required');
    }

    try {
        if (db === 'postgres') {
            cars = await searchCars(query);
        } else if (db === 'mongo') {
            cars = await searchCarsMongo(query);
        } else {
            return res.status(400).send('Invalid database selection');
        }

        if (cars.length === 0) {
            return res.status(404).send('No cars found');
        }

        res.render('carList', { cars });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error performing search');
    }
};