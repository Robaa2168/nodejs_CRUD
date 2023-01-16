
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/authentication.model");

exports.logout = function (req, res) {
    res.clearCookie("token");
    res.redirect("/auth/loginhtml");
};

exports.loginhtml = function (req, res) {
    
    res.render('../views/login.ejs');
};

exports.signuphtml = function (req, res) {
    res.render('../views/signup.ejs');
};


exports.signup = function (req, res){
    const { name, email, password, phone } = req.body;

    User.findOne({ email })
        .then((user) => {
            if (user) {
                return res.status(400).json({ message: "Email already in use" });
            }

            bcrypt.hash(password, 10)
                .then((hashedPassword) => {
                    const newUser = new User({
                        name,
                        email,
                        phone,
                        password: hashedPassword
                    });

                    newUser.save()
                        .then((user) => {
                            jwt.sign({ id: user._id }, "secret_key", (err, token) => {
                                res.json({
                                    token,
                                    user: {
                                        id: user._id,
                                        name: user.name,
                                        email: user.email,
                                        phone: user.phone
                                    }
                                });
                                res.redirect("/auth/login");
                            });
                        })
                        .catch((error) => {
                            res.status(500).json({ message: error });
                        });
                })
                .catch((error) => {
                    res.status(500).json({ message: error });
                });
        })
        .catch((error) => {
            res.status(500).json({ message: error });
        });
};




exports.login = function (req, res){ 
    const { email, password } = req.body;
    User.findOne({ email }).then((user) => {
        if (!user) {
            return res.render('../views/login.ejs', { error: "User not found" });
        }
        bcrypt.compare(password, user.password).then((isMatch) => {
            if (isMatch) {
                jwt.sign({ id: user._id }, "secret_key", (err, token) => {
                   
                    // setting the token in cookie
                    res.cookie('token',token);
                    res.redirect("/products/all");
                });
            } else {
                return res.render('../views/login.ejs', { error: "Incorrect password" });
            }
        });
    });
};




