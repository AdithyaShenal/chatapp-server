const express = require("express");
const router = express.Router();
const { User } = require("../models/user");

router.get("/", async (req, res, next) => {
  const query = req.query.q?.trim();
  if (!query) return res.send([]);

  const regex = new RegExp(query, "i");

  // 1. Regex match (partial match)
  const regexMatches = await User.find(
    {
      $or: [{ username: regex }, { name: regex }, { email: regex }],
    },
    {
      _id: 1,
      username: 1,
      name: 1,
      email: 1,
    }
  );

  // 2. Full-text search (word relevance match)
  const textMatches = await User.find(
    {
      $text: { $search: query },
    },
    {
      _id: 1,
      username: 1,
      name: 1,
      email: 1,
      score: { $meta: "textScore" },
    }
  ).sort({ score: { $meta: "textScore" } });

  // 3. Merge & remove duplicates by _id
  const seen = new Set();
  const combined = [...regexMatches, ...textMatches].filter((user) => {
    const id = user._id.toString();
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });

  res.send(combined);
});

module.exports = router;
