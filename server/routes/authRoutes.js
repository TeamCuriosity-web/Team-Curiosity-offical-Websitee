const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const InviteLink = require('../models/InviteLink');


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};




router.post('/register', async (req, res) => {
  console.log("Register Request Body:", req.body);
  const { 
    name, email, password, inviteToken,
    avatar, college, branch, section, programmingLanguages,
    github, linkedin
  } = req.body;

  try {
    const userCount = await User.countDocuments({});
    
    
    
    
    

    let isApproved = false;
    let role = 'member';

    if (userCount === 0) {
        isApproved = true;
        role = 'admin'; 
    } else {
        if (inviteToken) {
            const invite = await InviteLink.findOne({ token: inviteToken, isValid: true });
            
            if (!invite) {
                return res.status(400).json({ message: 'Invalid or Expired Invite Token' });
            }
            
            if (invite.expiresAt && invite.expiresAt < Date.now()) {
                return res.status(400).json({ message: 'Invite Token Expired' });
            }

            
            isApproved = true;
            
            
            invite.isValid = false;
            await invite.save();
        } else {
            
            isApproved = false;
        }
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      avatar,
      college,
      branch,
      section,
      programmingLanguages,
      github,
      linkedin,
      isApproved,
      profileImage: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`
    });

    
    if (inviteToken) {
       await InviteLink.findOneAndUpdate({ token: inviteToken }, { usedBy: user._id });
    }

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved, 
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




router.post('/login', async (req, res) => {
  const { email, password, inviteToken } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      
      
      if (inviteToken && !user.isApproved) {
           const invite = await InviteLink.findOne({ token: inviteToken, isValid: true });
           if (invite) {
                if (!invite.expiresAt || invite.expiresAt > Date.now()) {
                    user.isApproved = true;
                    await user.save();
                    
                    
                    invite.isValid = false;
                    invite.usedBy = user._id;
                    await invite.save();
                }
           }
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        token: generateToken(user._id),
        profileImage: user.profileImage,
        college: user.college,
        branch: user.branch,
        section: user.section,
        programmingLanguages: user.programmingLanguages,
        github: user.github,
        linkedin: user.linkedin,
        bio: user.bio,
        avatar: user.avatar
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




router.put('/updatedetails', async (req, res) => {
    
    
    
    
    
    
    
    
    
    
    
    
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.college = req.body.college || user.college;
            user.branch = req.body.branch || user.branch;
            user.section = req.body.section || user.section;
            user.github = req.body.github || user.github;
            user.linkedin = req.body.linkedin || user.linkedin;
            user.bio = req.body.bio || user.bio;
            
            if (req.body.programmingLanguages) {
                 user.programmingLanguages = req.body.programmingLanguages; 
            }
            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                token: generateToken(updatedUser._id),
                isApproved: updatedUser.isApproved,
                profileImage: updatedUser.profileImage,
                college: updatedUser.college,
                branch: updatedUser.branch,
                section: updatedUser.section,
                programmingLanguages: updatedUser.programmingLanguages,
                github: updatedUser.github,
                linkedin: updatedUser.linkedin,
                bio: updatedUser.bio,
                avatar: updatedUser.avatar
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
});




router.get('/me', async (req, res) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (user) {
             res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isApproved: user.isApproved, 
                token: generateToken(user._id), 
                profileImage: user.profileImage,
                college: user.college,
                branch: user.branch,
                section: user.section,
                programmingLanguages: user.programmingLanguages,
                github: user.github,
                linkedin: user.linkedin,
                bio: user.bio,
                avatar: user.avatar
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
});

module.exports = router;
