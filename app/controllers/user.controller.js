const { Sequelize } = require("../models");
const db = require("../models");

const User = db.users;

const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
    const limit = size ? +size : 5;
    const offset = page ? page * limit : 0;

    return { limit, offset };
}

const getPagingData = (data, page, limit) => {
    const { count: totalUsers, rows: users } = data;
    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(totalUsers / limit);

    return { totalUsers, users, totalPages, currentPage };
}

// create and save a new User 
exports.create = (req, res) => {
    //Validate request 
    if (!req.body.username) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // create a User
    const user = {
        username: req.body.username,
        permission: req.body.permission,
        status: req.body.status,
        email: req.body.email
    };

    // Save User into the database
    User.create(user).then(data => {
        res.send(data);
    })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the User."
            });
        });
};

// Retrieve all Users from database
exports.findAll = (req, res) => {
    var { page, size, username, permission ,status } = req.query;
    // var condition1 = username ? { username: { [Op.like]: `%${username}%` } } : null;
    const { limit, offset } = getPagination(page, size);
    let sortDesc = req.query.sortDirection || 'asc'; // asc / desc

    ////////////////////////////////////
    let usernameCondition = { [Op.like]: `%${username}%` }

    console.log(req.query);
    console.log(req.query.status);
    let whereClause = [];

    if (username !== undefined) {
        whereClause.push({ username: usernameCondition });
    }

    if (status === "false") {
        status = 0;
        whereClause.push({ status: status });
    }
    else if (status === "true") {
        status = 1;
        whereClause.push({ status: status });
    }

    if (permission !== undefined) {
        whereClause.push({ permission: permission });
    }
    /////////////////////////////////////
    User.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [
            ['id', sortDesc]
        ]
    })
        .then(data => {
            console.log(whereClause);
            const response = getPagingData(data, page, limit);
            res.send(response);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};

exports.filter = (req, res) => {
    let statusCondition = req.query.status;
    let username = req.query.username;
    let permission = req.query.permission;
    let whereClause = [];

    let sortDesc = req.query.sortDirection || 'desc'; // asc / desc


    if (statusCondition === "false") {
        statusCondition = 0;
        whereClause.push({ status: statusCondition });
    }
    else if (statusCondition === "true") {
        statusCondition = 1;
        whereClause.push({ status: statusCondition });
    }

    let usernameCondition = { [Op.like]: `%${username}%` }
    console.log(usernameCondition);
    console.log(username);

    if (username !== undefined) {
        whereClause.push({ username: usernameCondition });
    }

    if (permission !== undefined) {
        whereClause.push({ permission: permission });
    }
    console.log(whereClause);

    User.findAll({
        where: whereClause,
        order: [
            ['permission', sortDesc]
        ]
    })
        .then(data => {
            whereClause = [];
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};

// Find a single User with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    User.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find User with id= ${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving User with id= " + id
            });
        });
};

exports.findByUsername = (req, res) => {
    const username = req.params.username;
    var condition = username ? { username: { [Op.like]: `%${username}%` } } : null;

    User.findAll({
        where: condition
    })
        .then(num => {
            if (num == 1) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find User with username= ${username} `
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving User with username = " + username
            });
        });
};

// Update a User by the id in the request
exports.update = (req, res) => {
    let id = req.params.id;

    User.update(req.body,
        {
            where: { id: id }
        })
        .then(num => {
            console.log(req.body);
            if (num == 1) {
                res.send({
                    message: "User was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update User with id= ${id}. Maybe User was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating User with id=" + id
            });
        });
};

// Delete a User with the spqectified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    User.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "User was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete User with id ${id}. Maybe User was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete User with id= " + id
            });
        });
};

// Delete all User from the database
exports.deleteAll = (req, res) => {

};

exports.findAllActiveStatus = (req, res) => {
    let filterStatus = req.params.status;
    User.findAll({
        where: { status: filterStatus },
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
};
