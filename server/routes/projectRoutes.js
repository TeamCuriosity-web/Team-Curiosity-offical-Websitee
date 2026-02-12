const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/projects
// @desc    Get all projects
// @access  Public
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    console.log(`Fetching project with ID: ${req.params.id}`);
    const project = await Project.findById(req.params.id);
    console.log(`Found project: ${project ? 'YES' : 'NO'}`);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/projects
// @desc    Create a project (With GitHub Auto-Repo Creation)
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, description } = req.body;
    
    // 1. GitHub Repository Provisioning Protocol
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_ORG = "TeamCuriosity-web"; // Target Organization
    
    if (!GITHUB_TOKEN) {
      return res.status(500).json({ 
        message: 'GITHUB_PROVISION_FAILURE: GITHUB_TOKEN not configured in system architecture.' 
      });
    }

    const repoName = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const githubResponse = await fetch(`https://api.github.com/orgs/${GITHUB_ORG}/repos`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'TeamCuriosity-Official-App'
      },
      body: JSON.stringify({
        name: repoName,
        description: description || `Repository for ${title}`,
        private: false,
        has_issues: true,
        has_projects: true,
        has_wiki: true
      })
    });

    const githubData = await githubResponse.json();

    if (!githubResponse.ok) {
        console.error("GITHUB_API_ERROR:", githubData);
        return res.status(githubResponse.status).json({
            message: `GITHUB_DEPLOYMENT_FAILURE: ${githubData.message}`,
            errors: githubData.errors
        });
    }

    // 2. Local Database Synchronization
    const projectData = {
        ...req.body,
        repoLink: githubData.html_url
    };

    const newProject = new Project(projectData);
    const project = await newProject.save();
    res.json(project);
  } catch (err) {
    console.error("PROJECT_DEPLOYMENT_ERROR:", err);
    res.status(500).json({ message: 'INTERNAL_SYSTEM_ERROR: Deployment protocol interrupted.' });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update a project
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    Object.assign(project, req.body);
    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (err) {
    console.error("Project Update Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/projects/:id/join
// @desc    Join a project
// @access  Private
router.post('/:id/join', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Check if user is already a member
    if (project.teamMembers.includes(req.user._id)) {
      return res.status(400).json({ message: 'User already a member' });
    }

    project.teamMembers.push(req.user._id);
    await project.save();
    
    // Populate team members to return updated list with details if needed, 
    // but for now just returning project is fine, or we can populate to be safe for frontend display updates
    // await project.populate('teamMembers', 'name avatar profileImage'); 
    
    res.json(project);
  } catch (err) {
    console.error("Join Project Error:", err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete a project
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
