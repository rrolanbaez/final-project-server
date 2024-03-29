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
    role: {
      type: String,
      enum: ['host', 'client'],   //not sure
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);

// Maybe add a role (client or host) or profile img ??