const router = require('express').Router();
const projectDb = require('../helpers/projectModel');

router.get('/:id', validateprojectId, (req, res) => {
    res.status(200).json({
        success: true,
        project: req.project
    });
})


function validateprojectId(req, res, next) {
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

module.exports = router;