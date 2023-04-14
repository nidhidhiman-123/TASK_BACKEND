const jwt = require("jsonwebtoken");
const SECRET_KEY = "MYSECRETKEY";
const bcrypt = require("bcrypt");
const userModel = require("../model/user.model");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email: email });

    if (!user) {
      return res
        .status(400)
        .json({ msg: "User not found" });
    }


    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) return res.status(400).json({ msg: "Invalid Logins." });

    const userToken = jwt.sign({ email: user.email, id: user._id }, SECRET_KEY);
    if (res.status(201)) {
      return res.json({ success: true, authToken: userToken, user: user });
    } else {
      return res.json({ error: "error" });
    }
  }

  catch (err) {
    res.status(500).json({ error: err.message });
  }


}

