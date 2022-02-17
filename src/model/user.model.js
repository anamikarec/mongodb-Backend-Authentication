const mongoose = require("mongoose");
// for hashing bcrypt lib will be used
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 8 },
  },
  { timestamps: { created_at: () => Date.now() } }
);


userSchema.pre("save", function(next){
    if(!this.isModified("password")) return next();
    
    bcrypt.hash(this.password,8, (err,hash) => {
        if(err) return next(err);
        this.password = hash;
        next();
    })
})

userSchema.methods.checkPassword = function(password) {
  const passwordHash = this.password;
  console.log(this.password,passwordHash)
  return new Promise((resolve, reject) => {
    bcrypt.compare(password,passwordHash,(err,same) => {
      if(err) 
        return reject(err);
      resolve(same);
    })
  })
}
const User = mongoose.model("User", userSchema);

module.exports = User;
