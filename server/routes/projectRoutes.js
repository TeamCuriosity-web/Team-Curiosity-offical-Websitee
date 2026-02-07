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
// @desc    Create a project
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const newProject = new Project(req.body);
    const project = await newProject.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
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
