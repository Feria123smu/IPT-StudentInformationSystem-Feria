const mongoose = require("mongoose");

const Student = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    first: { type: String, required: true },
    middle: { type: String },
    last: { type: String, required: true },
    course: { type: String, required: true },
    year: { type: String, required: true },
    imageUrl: { type: String },
}, {
    collection: "student-data"
});

module.exports = mongoose.model("Student", Student);
