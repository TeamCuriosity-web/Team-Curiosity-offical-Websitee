const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect, admin } = require('../middleware/authMiddleware');




router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});




router.get('/:id/github-stats', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project || !project.repoLink) {
        return res.status(404).json({ message: 'Repo not found' });
    }

    
    const parts = project.repoLink.split('/');
    const repoName = parts[parts.length - 1];
    const owner = parts[parts.length - 2];

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    
    const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contributors`, {
        headers: {
            'Authorization': GITHUB_TOKEN ? `token ${GITHUB_TOKEN}` : '',
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'TeamCuriosity-App'
        }
    });

    if (!response.ok) {
        return res.status(response.status).json({ message: 'GitHub API Error' });
    }

    const data = await response.json();
    
    const contributors = data.map(c => ({
        id: c.id,
        login: c.login,
        avatar_url: c.avatar_url,
        html_url: c.html_url,
        contributions: c.contributions
    }));

    res.json(contributors);
  } catch (err) {
    console.error("GitHub Stats Error:", err);
    res.status(500).json({ message: 'Server Error' });
  }
});




router.get('/:id', async (req, res) => {
  try {
    console.log(`Fetching project with ID: ${req.params.id}`);
    const project = await Project.findById(req.params.id).populate('teamMembers', 'name profileImage email role');
    console.log(`Found project: ${project ? 'YES' : 'NO'}`);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});




router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, description } = req.body;
    
    
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_ORG = "TeamCuriosity-web"; 
    
    if (!GITHUB_TOKEN) {
      return res.status(500).json({ 
        message: 'GITHUB_PROVISION_FAILURE: GITHUB_TOKEN not configured in system architecture.' 
      });
    }

    
    const repoName = title.trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    
    let githubData;
    let githubResponse = await fetch(`https://api.github.com/orgs/${GITHUB_ORG}/repos`, {
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
        has_wiki: true,
        auto_init: true 
      })
    });

    if (githubResponse.status === 404 || githubResponse.status === 403) {
        console.warn(`Org ${GITHUB_ORG} not found or accessible. Attempting personal repo creation...`);
        
        githubResponse = await fetch(`https://api.github.com/user/repos`, {
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
                has_wiki: true,
                auto_init: true
            })
        });
    }

    githubData = await githubResponse.json();

    if (!githubResponse.ok) {
        
        const errorData = await githubData; 
        

         
         if (githubResponse.status === 422) {
             console.warn(`Repo ${repoName} exists. Attempting with unique suffix...`);
             const uniqueRepoName = `${repoName}-${Math.floor(Math.random() * 1000)}`;
             
             
             githubResponse = await fetch(`https://api.github.com/orgs/${GITHUB_ORG}/repos`, {
                 method: 'POST',
                 headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                    'User-Agent': 'TeamCuriosity-Official-App'
                 },
                 body: JSON.stringify({
                     name: uniqueRepoName,
                    description: description || `Repository for ${title}`,
                    private: false,
                    has_issues: true,
                    has_projects: true,
                    has_wiki: true,
                    auto_init: true 
                 })
             });

             
             if (!githubResponse.ok) {
                 githubResponse = await fetch(`https://api.github.com/user/repos`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `token ${GITHUB_TOKEN}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json',
                        'User-Agent': 'TeamCuriosity-Official-App'
                    },
                    body: JSON.stringify({
                        name: uniqueRepoName,
                        description: description || `Repository for ${title}`,
                        private: false,
                        has_issues: true,
                        has_projects: true,
                        has_wiki: true,
                        auto_init: true
                    })
                 });
             }
             
            githubData = await githubResponse.json(); 
        }
        
        
        if (!githubResponse.ok) {
            console.error("GITHUB_API_ERROR:", githubData);
            return res.status(githubResponse.status).json({
                message: `GITHUB_DEPLOYMENT_FAILURE: ${githubData.message} (All provision attempts failed).`,
                errors: githubData.errors
            });
        }
    }

    
    let liveDeploymentLink = '';
    try {
        const repoOwner = githubData.owner.login;
        const finalRepoName = githubData.name;
        const defaultBranch = githubData.default_branch || 'main'; 

        
        const pagesResponse = await fetch(`https://api.github.com/repos/${repoOwner}/${finalRepoName}/pages`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
                'User-Agent': 'TeamCuriosity-Official-App'
            },
            body: JSON.stringify({
                source: {
                    branch: defaultBranch,
                    path: "/"
                }
            })
        });

        if (pagesResponse.ok) {
            const pagesData = await pagesResponse.json();
            liveDeploymentLink = pagesData.html_url; 
        } else {
            
            liveDeploymentLink = `https://${repoOwner}.github.io/${finalRepoName}`;
            console.warn("GitHub Pages API pending/failed. Using constructed link:", liveDeploymentLink);
        }

    } catch (pagesErr) {
        console.error("PAGES_DEPLOYMENT_WARNING:", pagesErr);
        
    }

    
    const projectData = {
        ...req.body,
        repoLink: githubData.html_url,
        liveLink: liveDeploymentLink || req.body.liveLink 
    };

    const newProject = new Project(projectData);
    const project = await newProject.save();
    res.json(project);
  } catch (err) {
    console.error("PROJECT_DEPLOYMENT_ERROR:", err);
    res.status(500).json({ message: `INTERNAL_SYSTEM_ERROR: Deployment protocol interrupted. Details: ${err.message}` });
  }
});




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




router.post('/:id/join', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    
    if (project.teamMembers.includes(req.user._id)) {
      return res.status(400).json({ message: 'User already a member' });
    }

    project.teamMembers.push(req.user._id);
    await project.save();
    
    
    
    
    
    res.json(project);
  } catch (err) {
    console.error("Join Project Error:", err);
    res.status(500).json({ message: 'Server Error' });
  }
});




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
