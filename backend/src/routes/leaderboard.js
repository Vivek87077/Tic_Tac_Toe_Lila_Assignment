import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Get leaderboard with rankings
router.get("/", async (req, res) => {
  try {
    const users = await User.find({})
      .sort({ points: -1, wins: -1, maxWinStreak: -1 })
      .limit(100)
      .select(
        "nickname wins losses draws points winStreak maxWinStreak gamesPlayed createdAt lastPlayed"
      );

    // Add ranking to each user
    const rankedUsers = users.map((user, index) => ({
      rank: index + 1,
      ...user.toObject(),
      winRate:
        user.gamesPlayed > 0
          ? parseFloat(((user.wins / user.gamesPlayed) * 100).toFixed(1))
          : 0,
    }));

    res.json(rankedUsers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user profile
router.get("/profile/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const profile = {
      ...user.toObject(),
      winRate:
        user.gamesPlayed > 0
          ? parseFloat(((user.wins / user.gamesPlayed) * 100).toFixed(1))
          : 0,
      rank: await getUserRank(user._id),
    };

    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get top players by different criteria
router.get("/top/:criteria", async (req, res) => {
  try {
    const { criteria } = req.params;
    let sortCriteria = {};

    switch (criteria) {
      case "wins":
        sortCriteria = { wins: -1 };
        break;
      case "winStreak":
        sortCriteria = { maxWinStreak: -1 };
        break;
      case "winRate":
        // This requires aggregation for accurate win rate sorting
        const users = await User.find({ gamesPlayed: { $gt: 0 } });
        const sortedUsers = users
          .map((user) => ({
            ...user.toObject(),
            winRate: parseFloat(
              ((user.wins / user.gamesPlayed) * 100).toFixed(1)
            ),
          }))
          .sort((a, b) => b.winRate - a.winRate)
          .slice(0, 50);
        return res.json(sortedUsers);
      default:
        sortCriteria = { points: -1 };
    }

    const users = await User.find({})
      .sort(sortCriteria)
      .limit(50)
      .select(
        "nickname wins losses draws points winStreak maxWinStreak gamesPlayed"
      );

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function getUserRank(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    const higherRankedCount = await User.countDocuments({
      $or: [
        { points: { $gt: user.points } },
        { points: user.points, wins: { $gt: user.wins } },
        {
          points: user.points,
          wins: user.wins,
          maxWinStreak: { $gt: user.maxWinStreak },
        },
      ],
    });

    return higherRankedCount + 1;
  } catch (err) {
    console.error("Error calculating user rank:", err);
    return null;
  }
}

export default router;
