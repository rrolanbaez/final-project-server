var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

const User = require("../models/User");
const Car = require("../models/Car");
const Reservation = require("../models/Reservation");

const isAuthenticated = require("../middleware/isAuthenticated");
const isOwner = require("../middleware/isOwner");

// Create a Reservation
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const { car, startDate, endDate } = req.body;

    let thisCar = await Car.findById(car);

    let totalDays = Math.ceil(
      (new Date(endDate) - new Date(startDate)) / 1000 / 60 / 60 / 24
    );

    let totalPrice = thisCar.pricePerDay * totalDays;

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
      //status: 'pending',   // ????? not sure
    });

    res.json(newReservation);
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

// Get all Reservations for a user
router.get("/", isAuthenticated, (req, res, next) => {
  Reservation.find({ user: req.user._id })
    .populate("car")
    .then((foundReservations) => {
      
      res.json(foundReservations);
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
});

// Update a Reservation
// router.put('/edit/:reservationId', isAuthenticated, isOwner, (req, res, next) => {

//     const { reservationId } = req.params;
//     console.log(req.body)
//     // Verifying if it has a valid Id.
//     if (!mongoose.Types.ObjectId.isValid(reservationId)) {
//         res.status(400).json({ message: 'Specified reservation id is not valid' });
//         return;
//     }

//     Reservation.findByIdAndUpdate(reservationId,{startDate : req.body.startDate, endDate: req.body.endDate}, {new: true})
//         //.populate('cars')  //???? not sure
//         .then((updatedReservation) => {
//             console.log("Updated RSVP --->", updatedReservation)
//             res.json(updatedReservation);
//         })
//         .catch((err) => {
//             console.log(err)
//             res.json(err)
//         })
// });

router.put(
  "/edit/:reservationId",
  isAuthenticated,
  
  async (req, res, next) => {
    const { reservationId } = req.params;
    try {
      const reservation = await  Reservation.findById(reservationId);
      console.log(reservation)
      if (!reservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }
      if (reservation.user.toString() !== req.user._id) {
        return res.status(401).json({ message: "not authorized" });
      }

      reservation.startDate = req.body.startDate;
      reservation.endDate = req.body.endDate;

      await reservation.save();

      return res
        .status(200)
        .json({ message: "Updated reservation succesfuly", reservation });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
);

// Delete RSVP
router.delete(
  "/delete/:reservationId",
  isAuthenticated,
  
  (req, res, next) => {
    const { reservationId } = req.params;

    // Verifying if it has a valid Id.
    if (!mongoose.Types.ObjectId.isValid(reservationId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    Reservation.findById(reservationId)
      .then((reservation) => {
        if (reservation.user.toString() !== req.user._id) {
            return res.status(401).json({ message: "not authorized" });
          }
        return reservation.deleteOne()
        // res.json(deletedReservation);
      }).then((deleted) => {
        res.status(200).json({message: "Deleted Succesfuly"})
      })
      .catch((err) => {
        console.log(err);
        res.json(err);
      });
  }
);

module.exports = router;
