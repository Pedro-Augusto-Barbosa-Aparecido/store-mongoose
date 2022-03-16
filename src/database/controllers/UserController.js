const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const authConfig = require("../../config/auth.json");
const User = require("../models/User");
const mailer = require("../../modules/mailer");

const userRouter = express.Router();

function generateToken (params) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 259200
    });

}

userRouter.post("/register", async (req, res) => {
    try {
        const { email } = req.body;

        if (await User.findOne({ email: email })) {
            return res.status(500).send({ error: "Email already exist!" });

        }

        const password = await bcrypt.hash(req.body.password, 10);
        const user = await User.create({ ...req.body, password: password, full_name: `${req.body.first_name} ${req.body.last_name}` });

        user.password = undefined;

        return res.status(201).send({
           username: user.full_name,
           email,
           token: generateToken({ id: user._id })

        });

    } catch (err) {
        return res.status(500).send({ error: "Cant register new user!" });

    }

});

// userRouter.get("/login", async (req, res) => {
//     try {
//         const { email } = req.body.email;
//         const user = await User.findOne({ email: email }).select("+password");
        
//         if (!user) {
//             return res.status(404).send({ "error": "Not found User" });

//         }

//         if ((user.lastLogin))

//     } catch (err) {
//         return res.status(500).send({ "error": "Can't do Login!" });

//     }

// });

userRouter.get("/get_user/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);



        return res.status(200).send({
            result: user,
            total: 1

        });

    } catch (err) {
        return res.status(400).send({ error: "Uund!" });

    }

});

userRouter.post("/authenticate", async (req, res) => {
    const { email, password } = req.body;
    const user = await  User.findOne({ email }).select("+password");

    if (!user) {
        return res.status(400).send({ error: "User not found" });

    }

    if (!await bcrypt.compare(password, user.password)) {
        return res.status(500).send({ error: "Invalid password" });

    }

    user.password = undefined;

    return res.status(200).send({
        token: generateToken({ id: user.id })

    });

});

userRouter.get("/forgot_password", async (req, res) => {

    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            res.status(400).send({ error: "Teste!" });

        }

        const token = crypto.randomBytes(20).toString("hex");

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now

            }

        });

        mailer.sendMail({
            to: email,
            from: "pedro007augustobarbosa@gmail.com",
            template: "auth/forgot_password",
            context: { token, username: user.full_name }

        }, (err) => {
            if (err) {
                return res.status(500).send("Can not send email");

            }

            return res.send()

        });

    } catch (err) {
        res.status(500).send({ error: "Error on forgot password, try again!" });

    }

});

userRouter.post("/reset_password", async (req, res) => {
    const { email, token, password } = req.body;

    try {
        const user = await User.findOne({ email })
            .select("+passwordResetToken passwordResetExpires");

        if (!user) {
            return res.status(400).send({ error: "User not found" });

        }

        if (token !== user.passwordResetToken) {
            return res.status(500).send({ error: "Token invalid." });

        }

        const now = new Date();

        if (now > user.passwordResetExpires) {
            return res.status(500).send({ error: "Token expired." });

        }

        user.password = await bcrypt.hash(password, 10);
        await user.save();

        res.send({ success: true });

    } catch (err) {
        res.status(500).send({ error: "Cannot reset password, try again!" });

    }

});

module.exports = app => app.use("/user", userRouter);
