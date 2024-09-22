const { log } = require("console");
const express = require("express");
const { default: mongoose } = require("mongoose");
const multer = require('multer');
const { ImageModel } = require("./model/image.model");
const cors = require('cors');
const path = require("path");
const port = 8080;

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("uploads"));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

app.post("/single", upload.single("image"), async (req, res) => {
    try {
        const { path, filename } = req.file;
        const image = new ImageModel({ path, filename });
        await image.save();
        
        // Return the image URL
        const imageUrl = `http://localhost:8080/img/${image._id}`;
        res.send({ msg: "Image Uploaded", imageUrl });
    } catch (error) {
        res.send({ error: "Unable to upload image" });
    }
});

app.get("/img/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const image = await ImageModel.findById(id);
        
        if (!image) return res.send({ msg: "Image Not Found" });

        const imagePath = path.join(__dirname, "uploads", image.filename);
        res.sendFile(imagePath);
    } catch (error) {
        res.send({ error: "Unable to get image" });
    }
});

app.listen(8080, async () => {
    try {
        await mongoose.connect("mongodb+srv://ameerhamzakhan:YYPWGtuh4uDQOMUR@cluster0.34ehqx2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        console.log("DataBase is Connected");
        console.log('server is listening on port 8080');
    } catch (error) {
        console.log("Error in connecting with DB");
    }
});
