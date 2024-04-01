const { model, Schema } = require('mongoose');

const reservationSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId, 
            ref: 'User', 
            required: true
        },
        car: {
            type: Schema.Types.ObjectId, 
            ref: 'Car', 
            required: true
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        status : {
            type: String,
            enum: ['pending', 'confirmed', 'completed', 'cancelled'],  // not sure if status
            required: true,
            default: 'pending'
        },
        totalCost : {
            type: Number,
            required: true
        }

    },
    {
        timestamps: true
    }
);

module.exports = model("Reservation", reservationSchema);