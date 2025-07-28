const { Schema,model } = require('mongoose');
const { createHmac,randomBytes } = require('node:crypto');


const userSchema = new Schema({
  name: {
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
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profileImageUrl: {
    type: String,
    default: '/img/default.jpg'  // or provide a default placeholder image URL
  },
  role:{
    type : String,
    enum :["USER","ADMIN"],
    default: "USER",

  },

}, {
  timestamps: true  // adds createdAt and updatedAt automatically
});
userSchema.pre("save",function (next){
    const user = this;
    if(!user.isModified("password")) return;
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256',salt).update(user.password)
    .digest("hex");
    this.salt = salt;
    this.password = hashedPassword;
    next();

});



const User =  model('user',userSchema);

module.exports = User;