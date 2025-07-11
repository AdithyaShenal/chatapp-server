const mongoose = require("mongoose");
const { User } = require("./models/user");

const MONGO_URI = "mongodb://localhost:27017/chatapp"; // change if needed

async function setupIndexes() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB ✅");

    // Create only the full-text index
    await User.collection.createIndex(
      { username: "text", name: "text", email: "text" },
      { name: "UserTextIndex" } // Optional but helpful
    );

    console.log("Text index created successfully ✅");
    const indexes = await User.collection.indexes();
    console.log(indexes);

    process.exit(0);
  } catch (err) {
    console.error("Index setup failed ❌", err.message);
    process.exit(1);
  }
}

setupIndexes();
