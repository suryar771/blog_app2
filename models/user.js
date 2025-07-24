const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("node:crypto");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Pre-save hook to hash password
userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  // Generate a random salt
  const salt = randomBytes(16).toString("hex");
  user.salt = salt;

  // Hash the password using HMAC-SHA256
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  user.password = hashedPassword;

  next();
});

const User = model("user", userSchema);
module.exports = User;