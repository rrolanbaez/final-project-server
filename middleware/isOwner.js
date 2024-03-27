const Car = require("../models/Car");

const isOwner = (req, res, next) => {
  const { carId } = req.params;

  Car.findById(carId)
    .then((foundCar) => {
      if (foundCar.owner.toString() === req.user._id) {
        next();
      } else {
        res.status(402).json({ message: "Not authorized" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.json(err);
    });
};

module.exports = isOwner;
