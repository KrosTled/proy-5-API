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

const validateJwt = expressJwt({secret: process.env.SECRET, algorithms: ['HS256'] });
const signToken = (_id) => jwt.sign({_id}, process.env.SECRET)

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
                    res.status(200).send({token: signed})
                }else{
                    res.status(403).send('Usuario y/o contraseña inválida')
                }
            }
        }catch(err){
            res.status(500).send(err.message)
        }
    },
    register: async (req, res) => {
            const {body} = req
            try{
                const isUser = await User.findOne({ username: body.username})
                if(isUser){
                    return res.status(403).send('Usuario ya existe.')
                }else{
                    const salt = await bcrypt.genSalt();
                    const hashed = await bcrypt.hash(body.password, salt)
                    const user = await User.create({username: body.username, password:hashed, salt:salt, services: {"1": false, "2": false, "3": false, "4": false}})
                    const signed = signToken(user._id)
                    res.send({token: signed})
                }
            }catch(err){
                res.status(500).send(err.message)
            }
        }
    
}

module.exports = {Auth, estaAutenticada}