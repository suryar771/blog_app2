const { Schema,model } = require('mongoose');
const { error } = require('node:console');
const { createHmac,randomBytes } = require('node:crypto');
const { createTokenForUser } = require('../services/authentication');


const userSchema = new Schema({
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
   // required: true
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

userSchema.static('matchPasswordAndGenerateToken',async function(email,password){
    const user = await this.findOne({email});
    console.log(user);
    if(!user) throw new Error('user not found');
    const salt = user.salt;
    const hashedPassword = user.password;
    const userProvidedHash = createHmac('sha256',salt).update(password)
    .digest("hex");
    if(hashedPassword !== userProvidedHash) throw new error('Incorrect password');
    const token = createTokenForUser(user);
    return token;




});



const User =  model('user',userSchema);

module.exports = User;