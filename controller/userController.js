const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../model/userModel");

//AllUSer

const allUsers = async (req, res) => {
    try {
        const usersData = await userModel.find();

        if (usersData.length === 0) {
            return res.status(400).send({
                status: false,
                message: "No user found",
            });
        }

        return res.status(200).send({
            status: true,
            count: usersData.length,
            data: usersData,
        });
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "server side error.",
            error: error.message,
        });
    }
};

//SIGNUP

const signUp = async (req, res) => {
    try {
        const bodyData = req.body;

        const hashedPassword = await bcrypt.hash(bodyData.password, 10);

        bodyData.password = hashedPassword;

        const userdata = await userModel.create(bodyData);

        return res.status(201).send({
            status: true,
            message: "User created successfully",
            data: userdata,
        });
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: "server side error.",
            error: error.message,
        });
    }
};

//LogIn

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email)
            return res.status(400).send({
                status: false,
                message: "email is required",
            });

        if (!password)
            return res.status(400).send({
                status: false,
                message: "password is required",
            });

        const userData = await userModel.findOne({ email: email });
        if (!userData)
            return res.status(404).send({
                status: false,
                message: "This email is not Registered.",
            });

        let checkPassword = await bcrypt.compare(password, userData.password);
        if (!checkPassword) {
            return res.status(401).send({
                status: false,
                message: "Incorrect Password.",
            });
        }

        const userId = userData._id;
        const token = jwt.sign(
            { id: userId.toString() },
            process.env.JWT_SECRET || "strongpassword",
            {
                expiresIn: "24h",
            }
        );

        const data = {
            userId: userId,
            token: token,
        };

        return res.status(200).send({
            status: true,
            message: "User login successfull",
            data: data,
        });
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message,
        });
    }
};

module.exports = { signUp, login, allUsers };
