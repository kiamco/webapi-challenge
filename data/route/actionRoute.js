const router = require('express').Router();
const actionDb = require('../helpers/actionModel');

router.get('/:id', validateActionId, (req, res) => {
    res.status(200).json({
        success: true,
        action: req.action
    });
})

router.post('/', validatePost, (req, res) => {
    actionDb.insert(req.body)
        .then(action => {
            res.status(201).json({
                success: true,
                action
            });
        })
        .catch(err => res.status(500).json({
            success: "fail",
            err
        }))
})

router.put('/:id', [validateActionId, validatePost], (req, res) => {
    actionDb.update(req.params.id, req.body)
        .then(action => {
            res.status(201).json({
                success: true,
                action
            });
        })
        .catch(err => res.status(500).json({
            success: "fail",
            err
        }))
})

router.delete("/:id", validateActionId, (req, res) => {
    actionDb.remove(req.params.id)
        .then(action => {
            res.status(201).json({
                success: true,
                action
            });
        })
        .catch(err => res.status(500).json({
            success: "fail",
            err
        }))
})

function validateActionId(req, res, next) {
    const {
        id
    } = req.params;

    actionDb.get(id)
        .then(action => {
            if (action) {
                req.action = action;
                next();
            } else {
                res.status(400).json({
                    message: "invalid action id"
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
    } else if (!requiredBody.project_id) {
        res.status(400).json({
            message: "missing require field id"
        });
    } else if (!requiredBody.description) {
        res.status(400).json({
            message: "missing require field description"
        });
    } else if (!requiredBody.notes) {
        res.status(400).json({
            message: "missing require field notes"
        });
    } else {
        next();
    }

};
module.exports = router;