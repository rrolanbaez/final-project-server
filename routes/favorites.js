var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

const Car = require("../models/Car");
const User = require("../models/User");
const isAuthenticated = require("../middleware/isAuthenticated");

router.post('/:carId', isAuthenticated, async (req, res, next) => {
    const userId = req.user._id;
    const { carId } = req.params;

    console.log("These are the IDs====>", userId, carId)

    try {
        let thisUser = await User.findByIdAndUpdate(userId, { $push: {favoriteCars: carId} }, {new: true});
        console.log("This is the user ====>", thisUser)
        res.status(200).json({ message: "Car added to favs"});
    } catch (err){
        res.status(500).json({ message: "Internal server error"});
    }
});

router.delete("/:carId", isAuthenticated, async (req, res, next) => {
    const userId = req.user._id;
    const { carId } = req.params;

    try {
        await User.findByIdAndUpdate(userId, {$pull: { favoriteCars: carId } }, {new: true});
        res.status(200).json({ message: "Car removed from favs"});
    } catch (err){
        res.status(500).json({ message: "internal server error"})
    }
})

// get all favs
router.get('/', isAuthenticated, async (req, res, next) => {
    const userId = req.user._id;

    console.log("this is the user Id", userId)

    try {
        let thisUser = await User.findById(req.user._id)
        console.log("This is the actual user", thisUser)
        res.status(200).json(thisUser.favoriteCars)
    } catch (err) {
        res.status(500).json({ message: "Internal server error"})
    }
})

router.get('/populated', isAuthenticated, async (req, res, next) => {
    const userId = req.user._id;

    console.log("this is the user Id", userId)

    try {
        let thisUser = await User.findById(req.user._id)
        let populatedFavorites = await thisUser.populate({path: "favoriteCars"})
        console.log("This is the actual user", thisUser)
        res.status(200).json(populatedFavorites.favoriteCars)
    } catch (err) {
        res.status(500).json({ message: "Internal server error"})
    }
})

module.exports = router; 