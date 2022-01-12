const router = require("express").Router();

const Location = require("../models/Location");

//create Loacation
router.post("/", async (req, res) =>
{
    const newLocation = new Location(req.body);
    try{
        const savedLocation = await newLocation.save();
        res.status(200).json(savedLocation);
    }
    catch(err)
    {
        res.status(500).json(err);
    }

})

//get all locations
router.get("/", async (req, res) =>
{
    try
    {
        const locations = await Location.find();
        res.status(200).json(locations);
    }
    catch(err)
    {
        res.status(500).json(er)
    }

})

module.exports = router