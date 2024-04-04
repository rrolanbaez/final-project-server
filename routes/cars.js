var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

const Car = require("../models/Car");

const isAuthenticated = require("../middleware/isAuthenticated");
const isOwner = require("../middleware/isOwner");

// Creating a car
router.post("/", isAuthenticated, (req, res, next) => {
  const {
    make,
    model,
    year,
    pricePerDay,
    location,
    features,
    basics,
    images,
    description,
  } = req.body;

  Car.create({
    make,
    model,
    year,
    pricePerDay,
    location,
    features,
    basics,
    images,
    description,
    owner: req.user._id,
  })
    .then((createdCar) => {
      console.log("This is the created car --->", createdCar);
      res.json(createdCar);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

// Get all cars
router.get("/", (req, res, next) => {
  Car.find()
    .then((foundCars) => {
      // console.log("Found Cars ===>", foundCars);
      res.json(foundCars);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

// Ger car details
router.get("/details/:carId", (req, res, next) => {
  const { carId } = req.params;

  // Verify if it has a valid ID
  if (!mongoose.Types.ObjectId.isValid(carId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Car.findById(carId)
    // .populate('taks') ---> I dont think populte applies in this case?? Example from project-management-server
    .then((foundCar) => {
      console.log("Found Car ==>", foundCar);
      res.json(foundCar);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

// Update car info
router.put("/update/:carId", isAuthenticated, isOwner, (req, res, next) => {
  const { carId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(carId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Car.findByIdAndUpdate(carId, req.body, { new: true })

    .then((updatedCar) => {
      console.log("Updated car ==>", updatedCar);
      res.json(updatedCar);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

// Delete car
router.delete("/delete/:carId", isAuthenticated, isOwner, (req, res, next) => {
  const { carId } = req.params;

  // Verify if it has a valid ID
  if (!mongoose.Types.ObjectId.isValid(carId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Car.findByIdAndDelete(carId)
    .then((deletedCar) => {
      console.log("This is the deleted car ==>", deletedCar);
      res.json(deletedCar);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

module.exports = router;
