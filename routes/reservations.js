var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

const User = require('../models/User');
const Car = require('../models/Car');
const Reservation = require('../models/Reservation');

const isAuthenticated = require('../middleware/isAuthenticated');
const isOwner = require('../middleware/isOwner');

// Create a Reservation
router.post('/', isAuthenticated, async (req, res, next) => {

    try {
        const { car, startDate, endDate } = req.body;

        let thisCar = await Car.findById(car)
     
        let totalDays = Math.ceil((new Date(endDate) - new Date(startDate)) / 1000 / 60 / 60 / 24)

        let totalPrice = thisCar.pricePerDay * totalDays

        let newReservation = await Reservation.create({
            user: req.user._id,
            car,
            startDate,
            endDate,
            // startDate: ISODate(new Intl.DateTimeFormat('en-PR', {
            //     dateStyle: 'full',
            //     timeStyle: 'long',
            //     timeZone: 'America/Puerto_Rico',
            //   }).format(new Date(startDate))),
            // endDate: ISODate(new Intl.DateTimeFormat('en-PR', {
            //     dateStyle: 'full',
            //     timeStyle: 'long',
            //     timeZone: 'America/Puerto_Rico',
            //   }).format(new Date(endDate))),
            totalCost: totalPrice,
            status: 'pending',   // ????? not sure 
        })

        res.json(newReservation)

    } catch(err) {
        console.log(err)
        res.json(err)
    }

});

// Get all Reservations for a user
router.get('/', isAuthenticated, (req, res, next) => {
    Reservation.find({ user: req.user._id })
        .populate('car')
        .then((foundReservations) => {
            console.log("Found RSVPs --->", foundReservations)
            res.json(foundReservations)
        })
        .catch((err) => {
            console.log(err)
        res.json(err)
        })
});

// Update a Reservation
router.put('/update/:reservationId', isAuthenticated, isOwner, (req, res, next) => {

    const { reservationId } = req.params;

    // Verifying if it has a valid Id.
    if (!mongoose.Types.ObjectId.isValid(reservationId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Reservation.findByIdAndUpdate(reservationId, req.body, {new: true})
        //.populate('cars')  ???? not sure
        .then((updatedReservation) => {
            console.log("Updated RSVP --->", updatedReservation)
            res.json(updatedReservation);
        })
        .catch((err) => {
            console.log(err)
            res.json(err)
        })
});

// Delete RSVP
router.delete('/delete/:reservationId', isAuthenticated, isOwner, (req, res, next) => {

    const { reservationId } = req.params;

    // Verifying if it has a valid Id.
    if (!mongoose.Types.ObjectId.isValid(reservationId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Reservation.findByIdAndDelete(reservationId)
        .then((deletedReservation) => {
            console.log("This is the deleted RSVP --->", deletedReservation)
            res.json(deletedReservation)
        })
        .catch((err) => {
            console.log(err);
            res.json(err);
        });
});

module.exports = router; 