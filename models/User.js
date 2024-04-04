const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String, 
      default: "https://www.iconpacks.net/icons/2/free-user-icon-3297-thumb.png"
    },
    role: {
      type: String,
      enum: ['host', 'client'],   
      required: true,
    },
    favoriteCars: [{ type: Schema.Types.ObjectId, ref: "Car"}],
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
