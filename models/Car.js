const { model, Schema } = require("mongoose");

const carSchema = new Schema(
  {
    make: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    pricePerDay: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    features: [{
        type: String,      //what features does each car has?:  GPS, bluetooth, aux, backup camara, auto transmission, keyless entry, usb charger/input, sunroof, etc ?
    }],
    basics: [{
        type: String,      // how many doors?, seats?, gas/premium/electric? mpg?
    }],
    images: [{
        type: String,      // ????? not sure if imgs are strings
    }],
    description: {
        type: String,
    },
    availability: {
        type: Boolean,     // available or not? 
        default: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = model("Car", carSchema);