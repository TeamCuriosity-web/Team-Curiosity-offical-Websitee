const express = require('express');
const router = express.Router();
const User = require('../models/User');


const commitCache = {};
const CACHE_DURATION = 3600 * 1000; 


async function fetchGithubStats(username) {
  const now = Date.now();
  if (commitCache[username] && (now - commitCache[username].timestamp < CACHE_DURATION)) {
    return commitCache[username];
  }

  try {
    const headers = { 
      'Accept': 'application/vnd.github.cloak-preview+json', 
      'User-Agent': 'Team-Leaderboard-App'
    };
    
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    
    const response = await fetch(`https:
    
    if (response.status === 429) {
        console.warn(`GitHub Rate Limit Exceeded for ${username}`);
        return commitCache[username] || { count: 0, lastCommit: null };
    }

    if (!response.ok) {
        
        return { count: 0, lastCommit: null };
    }

    const data = await response.json();
    const count = data.total_count || 0;
    
    
    let lastCommit = null;
    if (data.items && data.items.length > 0) {
        lastCommit = data.items[0].commit.author.date;
    }
    
    const stats = { count, lastCommit };
    commitCache[username] = { ...stats, timestamp: now };
    return stats;
    
  } catch (error) {
    console.error(`Error fetching commits for ${username}:`, error);
    return commitCache[username] || { count: 0, lastCommit: null };
  }
}




router.get('/', async (req, res) => {
  try {
    const team = await User.find().select('-password -__v').sort({ joinedAt: 1 });
    
    
    const teamWithStats = await Promise.all(team.map(async (member) => {
        const memberObj = member.toObject();
        
        if (member.github) {
             
             let username = member.github;
             if (username.includes('github.com')) {
                const parts = username.split('github.com/');
                if (parts[1]) {
                    username = parts[1].replace('/', '');
                }
             }
             
             memberObj.githubUsername = username;
             const stats = await fetchGithubStats(username);
             memberObj.commitCount = stats.count;
             memberObj.lastCommit = stats.lastCommit;

        } else {
             memberObj.commitCount = 0;
             memberObj.lastCommit = null;
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
