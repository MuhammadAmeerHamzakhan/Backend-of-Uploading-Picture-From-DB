const mongoose = require("mongoose")
const imageSchema = mongoose.Schema({
    path: {type: String, required: true },
    filename: {type: String, required: true },
})

const ImageModel = mongoose.model("image", imageSchema)

module.exports = {ImageModel}