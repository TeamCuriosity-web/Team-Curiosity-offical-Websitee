const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Simple in-memory cache: { username: { count: number, timestamp: number } }
const commitCache = {};
const CACHE_DURATION = 3600 * 1000; // 1 hour

// Helper to fetch GitHub commits
async function fetchGithubCommits(username) {
  const now = Date.now();
  if (commitCache[username] && (now - commitCache[username].timestamp < CACHE_DURATION)) {
    return commitCache[username].count;
  }

  try {
    const headers = { 
      'Accept': 'application/vnd.github.cloak-preview+json', // Commit search preview header
      'User-Agent': 'Team-Leaderboard-App'
    };
    
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    // Using search API to get total commits across all public repos
    const response = await fetch(`https://api.github.com/search/commits?q=author:${username}&sort=author-date&order=desc&per_page=1`, { headers });
    
    if (response.status === 429) {
        console.warn(`GitHub Rate Limit Exceeded for ${username}`);
        return commitCache[username]?.count || 0;
    }

    if (!response.ok) {
        // If search fails (e.g. 422 validation failed or user not found), default to 0
        return 0;
    }

    const data = await response.json();
    const count = data.total_count || 0;
    
    commitCache[username] = { count, timestamp: now };
    return count;
    
  } catch (error) {
    console.error(`Error fetching commits for ${username}:`, error);
    return commitCache[username]?.count || 0;
  }
}

// @route   GET /api/team
// @desc    Get all team members with GitHub commit stats
// @access  Public
router.get('/', async (req, res) => {
  try {
    const team = await User.find().select('-password -__v').sort({ joinedAt: 1 });
    
    // Enrich with GitHub commit counts
    // We run this in parallel but it might be slow if no cache and many users. 
    // Ideally this should be a background job or separate endpoint, but for now we integrate it as requested.
    const teamWithStats = await Promise.all(team.map(async (member) => {
        const memberObj = member.toObject();
        
        if (member.github) {
             // Extract username from URL if necessary
             // Handle cases like "https://github.com/username/" or "username"
             let username = member.github;
             if (username.includes('github.com')) {
                const parts = username.split('github.com/');
                if (parts[1]) {
                    username = parts[1].replace('/', '');
                }
             }
             
             memberObj.githubUsername = username;
             memberObj.commitCount = await fetchGithubCommits(username);
        } else {
             memberObj.commitCount = 0;
        }
        return memberObj;
    }));

    res.json(teamWithStats);
  } catch (err) {
    console.error("Team fetch error:", err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
