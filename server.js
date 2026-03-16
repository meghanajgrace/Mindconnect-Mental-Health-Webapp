const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ------------------ DATABASE CONNECTION ------------------
mongoose.connect("mongodb://127.0.0.1:27017/mindconnectDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


// ------------------ LOGIN ------------------
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "dbit" && password === "dbit123") {
    return res.json({ success: true });
  } else {
    return res.json({ success: false });
  }
});


// ------------------ FEED SCHEMA ------------------
const FeedSchema = new mongoose.Schema({
  username: String,
  post: String,
  timestamp: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 }
});
const Feed = mongoose.model("Feed", FeedSchema);

// ADD POST
app.post("/feed/add", async (req, res) => {
  const { username, post } = req.body;
  await Feed.create({ username, post });
  res.json({ message: "Post added!" });
});

// GET POSTS
app.get("/feed/all", async (req, res) => {
  const posts = await Feed.find().sort({ timestamp: -1 });
  res.json(posts);
});

// LIKE POST
app.put("/feed/like/:id", async (req, res) => {
  const post = await Feed.findById(req.params.id);
  post.likes += 1;
  await post.save();
  res.json({ message: "Liked!" });
});

// UPDATE POST
app.put("/feed/update/:id", async (req, res) => {
  const { post } = req.body;
  await Feed.findByIdAndUpdate(req.params.id, { post });
  res.json({ message: "Updated!" });
});

// DELETE POST
app.delete("/feed/delete/:id", async (req, res) => {
  await Feed.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted!" });
});


// ------------------ JOURNAL SCHEMA ------------------
const JournalSchema = new mongoose.Schema({
  entry: String,
  timestamp: { type: Date, default: Date.now }
});
const Journal = mongoose.model("Journal", JournalSchema);

// SAVE JOURNAL ENTRY
app.post("/journal/save", async (req, res) => {
  const { entry } = req.body;

  if (!entry) return res.json({ message: "Empty entry" });

  await Journal.create({ entry });
  res.json({ message: "Journal saved" });
});

// GET ALL JOURNAL ENTRIES
app.get("/journal/all", async (req, res) => {
  const entries = await Journal.find().sort({ timestamp: 1 });
  res.json(entries);
});


// ------------------ APPOINTMENT SCHEMA ------------------
const AppointmentSchema = new mongoose.Schema({
  name: String,
  email: String,
  whatsapp: String,
  date: String,
  time: String,
  reason: String,
  createdAt: { type: Date, default: Date.now }
});
const Appointment = mongoose.model("Appointment", AppointmentSchema);

// APPOINTMENT ROUTE
app.post("/appointment", async (req, res) => {
  const data = req.body;
  await Appointment.create(data);
  res.json({ message: "Appointment saved" });
});


// ------------------ START SERVER ------------------
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
