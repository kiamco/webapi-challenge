const router = require('express').Router();
const projectDb = require('../helpers/projectModel');

router.get('/action/:id', (req, res) => {
    const {
        id
    } = req.params;

    projectDb.getProjectActions(id)
        .then(project => {
            if (project) {
                res.status(200).json({ succes: true, project })
            } else {
                res.status(400).json({
                    message: "invalid project id"
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
})

router.get('/:id', validateProjectId, (req, res) => {
    res.status(200).json({
        success: true,
        project: req.project
    });
})

router.post('/', validatePost, (req, res) => {
    projectDb.insert(req.body)
        .then(project => {
            res.status(201).json({
                success: true,
                project
            });
        })
        .catch(err => res.status(500).json({
            success: "fail",
            err
        }))
})

router.put('/:id', [validateProjectId, validatePost], (req, res) => {
    projectDb.update(req.params.id, req.body)
        .then(project => {
            res.status(201).json({
                success: true,
                project
            });
        })
        .catch(err => res.status(500).json({
            success: "fail",
            err
        }))
})

router.delete("/:id", validateProjectId, (req, res) => {
    projectDb.remove(req.params.id)
        .then(project => {
            res.status(201).json({
                success: true,
                project
            });
        })
        .catch(err => res.status(500).json({
            success: "fail",
            err
        }))
})




function validateProjectId(req, res, next) {
    const {
        id
    } = req.params;

    projectDb.get(id)
        .then(project => {
            if (project) {
                req.project = project;
                next();
            } else {
                res.status(400).json({
                    message: "invalid project id"
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
};

function validatePost(req, res, next) {
    const requiredBody = req.body
    console.log(req.body);
    if (Object.keys(req.body).length === 0) {
        res.status(400).json({
            message: "you aint got no body"
        });
    } else if (!requiredBody.name) {
        res.status(400).json({
            message: "missing require field name"
        });
    } else if (!requiredBody.description) {
        res.status(400).json({
            message: "missing require field description"
        });
    } else {
        next();
    }

};

module.exports = router;