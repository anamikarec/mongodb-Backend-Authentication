// const jwt = require('jsonwebtoken');
// const User = require('../model/user.model');

// const verifyToken = (token) => {
//     return new Promise((resolve, reject) => {
//         jwt.verify(token, process.env.JWT_SECRET_KEY,(err,payload) =>{
//             // console.log("payload",payload);
//             if(err) return reject(err);

//             return resolve(payload);
//         })
//     })
// }

// const protect = async (req,res,next) => {
//     // first we need to get the token from the
//     const bearer = req.headers.authorization;
//     if(!bearer || !bearer.startsWith("Bearer ")) {
//         return res.status(401).json({
//             status:"failed",
//             messgae : "Your email or password is incorrect"
//         })
//     }
//     // we need to verify the token
//     const token = bearer.split("Bearer ")[1].trim();
//     // console.log(token);

//     // retrieve the oken and if user exists, then good else bad token
//     let payload;
//     try{
//         payload = await verifyToken(token);
//     }
//     catch(e){
//         return res.status(401).json({
//             status:"failed",
//             messgae : "Your email or password is incorrect"
//         })
//     }

//     let user;
//     try{
//         user = User.findById(payload.id).lean().exec();
//     }
//     catch(e){
//         return res.status(500).json({
//             status:"failed",
//             messgae : "Something went wrong!"
//         })
//     }
//     if(!user){
//         return res.status(401).json({
//             status:"failed",
//             messgae : "Your email or password is incorrect"
//         })
//     }
//     req.user = user;
//     next();
// }

// module.exports = protect;


// first we need to get the token from signin
// then we need to verify the token
// retrieve the user andif user is logged in
const jwt = require('jsonwebtoken');

const User = require('../model/user.model');

const verifyToken = (token) => {
   return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
            if(err) return reject(err);
            return resolve(payload);
        })
    })
}

const protect = async (req, res, next) => {
    const bearer = req.headers.authorization;
    if(!bearer || !bearer.startsWith('Bearer ')){
        return res.status(401).json({
            status: 'failed',
            message: 'Your email or password is incorrect try again'
        });
    };
    const token = bearer.split('Bearer ')[1].trim();
    console.log(token);

    let payload;
    try {
        payload = await verifyToken(token);
        console.log(payload,"payload");
    } catch (error) {
        return res.status(401).json({
            status: 'failed',
            message: 'Your email or password is incorrect try again'
        });
    }

    let user;
    try {
        console.log("payload",payload);
        user = User.findById(payload.id).lean().exec();
    } catch (error) {
        return res.status(500).json({status: 'failed', message:"Something went wrong in finding user by ID"})
    }
    if(!user){
        return res.status(401).json({
            status: 'failed',
            message: 'Your email or password is incorrect try again'
        });
    }

    req.user = user;
    next();
};


module.exports = protect;