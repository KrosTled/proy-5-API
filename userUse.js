const mongoose = require('mongoose');
const User = require('./mongo.js');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { expressjwt: expressJwt } = require('express-jwt');
require('dotenv').config(); 

mongoose.connect(process.env.DBUSERS);

const app = express()

app.use(express.json())

const validateJwt = expressJwt({secret: process.env.JWTENCRYPT, algorithms: [process.env.JWTENCRYPTALG] });
const signToken = (_id) => jwt.sign({_id}, process.env.JWTENCRYPT)

// app.post('/register', async (req, res) => {
//     const {body} = req
//     console.log({body})
//     try{
//         const isUser = await User.findOne({ username: body.username})
//         if(isUser){
//             return res.status(403).send('Usuario ya existe.')
//         }
//         const salt = await bcrypt.genSalt();
//         const hashed = await bcrypt.hash(body.password, salt)
//         const user = User.create({username: body.username, password:hashed, salt:salt})
//         const signed = signToken(user._id)
//         res.send(signed)
//     }catch(err){
//         console.log(err)
//         res.status(500),send(err.message)
//     }
// })

// app.post('/login', async (req, res) => {
//     const {body} = req
//     try{
//         const user = await User.findOne({ username: body.username})
//         if(!user){
//             res.status(403).send('Usuario y/o contraseña inválida')
//         }else{
//             const isMatch = await bcrypt.compare(body.password, user.password)
//             if(isMatch){
//                 const signed = signToken(user._id)
//                 res.status(200).send(signed)
//             }else{
//                 res.status(403).send('Usuario y/o contraseña inválida')
//             }
//         }
//     }catch(err){
//         console.log(err)
//         res.status(500),send(err.message)
//     }
// })

const findAndAssignUser = async (req, res, next) =>{
    try {
        const user = await User.findById(req.auth._id)
        if(!user){
            return res.status(403).end()
        }
        req.auth = user
        next()
    }catch(err){
        next(err)
    }
}

const estaAutenticada = express.Router().use(validateJwt, findAndAssignUser)


const Auth = {
    login: async (req,res) => {
        const {body} = req
        try{
            const user = await User.findOne({ username: body.username})
            if(!user){
                res.status(403).send('Usuario y/o contraseña inválida')
            }else{
                const isMatch = await bcrypt.compare(body.password, user.password)
                if(isMatch){
                    const signed = signToken(user._id)
                    res.status(200).send(signed)
                }else{
                    res.status(403).send('Usuario y/o contraseña inválida')
                }
            }
        }catch(err){
            res.status(500),send(err.message)
        }
    },
    register: async (req,res) => {
        async (req, res) => {
            const {body} = req
            try{
                const isUser = await User.findOne({ username: body.username})
                if(isUser){
                    return res.status(403).send('Usuario ya existe.')
                }else{
                    const salt = await bcrypt.genSalt();
                    const hashed = await bcrypt.hash(body.password, salt)
                    const user = User.create({username: body.username, password:hashed, salt:salt})
                    const signed = signToken(user._id)
                    res.send(signed)
                }
            }catch(err){
                res.status(500),send(err.message)
            }
        }
    }
}

module.exports = {Auth, estaAutenticada}