const { Schema, model } = require("mongoose");

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
   
  },
  body: {
    type: String,
    required: true,
  },
  coverImageURL: {
    type: String,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "user", // make sure your user model is named "User"
    required: true,
  }
}, { timestamps: true }); // adds createdAt and updatedAt fields

const Blog  = model("blog", blogSchema);
module.exports =Blog;