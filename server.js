const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000; // Use environment variable or default to 5000

// Middleware: Allows the server to read JSON data sent from the browser
app.use(express.json());
// Middleware: Allows browser requests (CORS)
app.use(cors());

// --- DATABASE CONFIGURATION ---
// REPLACE THIS STRING with your actual MongoDB Atlas Connection String
// Format: mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority
const MONGO_URI = 'mongodb+srv://demoUser:demoPassword@cluster0.abc123.mongodb.net/dnd-characters?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('MongoDB Connection Error:', err));

// --- SCHEMA & MODEL ---
// This defines what a character looks like in the database
const characterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    class: { type: String, required: true }, // e.g., Wizard, Fighter
    level: { type: Number, default: 1 },
    race: { type: String },
    hp: { type: Number },
    attributes: {
        strength: Number,
        dexterity: Number,
        constitution: Number,
        intelligence: Number,
        wisdom: Number,
        charisma: Number
    }
});

const Character = mongoose.model('Character', characterSchema);

// --- ROUTES (API ENDPOINTS) ---

// 1. GET all characters
app.get('/api/characters', async (req, res) => {
    try {
        const characters = await Character.find();
        res.json(characters);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. POST a new character
app.post('/api/characters', async (req, res) => {
    const character = new Character({
        name: req.body.name,
        class: req.body.class,
        level: req.body.level,
        race: req.body.race,
        hp: req.body.hp,
        attributes: req.body.attributes || { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 }
    });

    try {
        const newCharacter = await character.save();
        res.status(201).json(newCharacter);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
