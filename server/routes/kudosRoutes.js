const express = require("express");
const router = express.Router();
const Kudos = require("../models/Kudos");

router.post("/kudos", async (req, res) => {
    const { sender, recipient, badge, reason } = req.body;
    try {
        const newKudos = new Kudos({ sender, recipient, badge, reason });
        await newKudos.save();
        res.status(201).json(newKudos);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/analytics", async (req, res) => {
    try {
        const kudos = await Kudos.find();
        res.json(kudos);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
