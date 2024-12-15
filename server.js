const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // To parse form data
app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// MongoDB Connection
const mongoURI = "mongodb+srv://admin:Ahmad5568@cluster0.ncheo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error(err));

// Mongoose Schema and Model
const UserSchema = new mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

// Route to Add Data
app.post('/add-data', async (req, res) => {
    try {
        const { fname, lname } = req.body;
        const newUser = new User({ fname, lname });
        await newUser.save();
        res.status(200).json({ message: "User added successfully", user: newUser });
    } catch (err) {
        res.status(500).json({ error: "Failed to add user", details: err });
    }
});

// Route to Fetch Data
app.get('/get-data', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch data", details: err });
    }
});

// Default Route to Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
