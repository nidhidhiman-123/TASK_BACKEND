const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { DATABASE_URL } = require('./config');
const router = require('./routes');
const app = express();
const PORT = 5000

app.use(cors())
app.use(express.json());
app.use('/', router);

app.use('/videos', express.static('videos'));

app.use(express.urlencoded({ extended: true }))
mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).then(() => app.listen(PORT, () => console.log('listen on port 5000.'))).catch((error) => console.log("error found", error))

