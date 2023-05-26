const jwt = require("jsonwebtoken");
const SECRET_KEY = "MYSECRETKEY";
const bcrypt = require("bcrypt");
const userModel = require("../model/user.model");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");

const videoModel = require("../model/video.model");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'videos/'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
});

const handleMultipartData = multer({ storage, limit: { filesize: 1000000 * 5 } }).single('video');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(400).json({ msg: "Invalid login credentials." });
    }

    const userToken = jwt.sign({ email: user.email, id: user._id }, SECRET_KEY);
    return res.status(201).json({ success: true, authToken: userToken, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

exports.video = async (req, res) => {
  handleMultipartData(req, res, async (err) => {
    if (err) {
      console.error("Video upload failed:", err);
      return res.status(500).json({ success: false, message: "Video upload failed." });
    }

    const { path: filePath, filename } = req.file;
    const outputName = filename.replace(/\.[^/.]+$/, ".m3u8");

    ffmpeg(filePath)
      .output(`videos/${outputName}`)
      .on("end", async () => {
        try {
          const videoUpload = await videoModel.create({ video: outputName });
          res.status(201).json({ success: true, message: "Video uploaded and converted successfully.", video: videoUpload });
        } catch (error) {
          console.error("Error saving video to MongoDB:", error);
          res.status(500).json({ success: false, message: "Video upload failed." });
        }
      })
      .on("error", (error) => {
        console.error("FFmpeg conversion error:", error);
        res.status(500).json({ success: false, message: "Video conversion failed." });
      })
      .run();
  });
}
