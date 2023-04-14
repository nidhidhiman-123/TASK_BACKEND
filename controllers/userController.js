const bcrypt = require("bcrypt");
const userModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "MYSECRETKEY";



exports.newUser = async (req, res) => {
    try {

        const { name, email, password, phoneNumber } = req.body;
        const existingUser = await userModel.findOne({ email: email });
        if (existingUser)
            return res
                .status(400)
                .json({ msg: "Email Already Exists." });
        const hash = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, hash);

        const newUser = new userModel({
            name,
            email,
            password: passwordHash,
            phoneNumber,
        });
        const addUser = await newUser.save();

        const token = jwt.sign(
            { email: addUser.email, id: addUser._id },
            SECRET_KEY
        );
        res.status(201).json({ data: addUser, authToken: token });
    }

    catch (err) {
        res.status(500).json({ error: err.message });
    }

};

