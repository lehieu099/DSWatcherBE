module.exports = app => {
    const user = require("../controllers/user.controller.js");

    var router = require("express").Router();

    //create a new User
    router.post("/", user.create);

    // Retrieve all User
    router.get("/", user.findAll);

    //Retrieve all active user
    router.get("/status", user.findAllActiveStatus);

    // filter
    router.get("/filter", user.filter);

    // Retrieve a single User with id
    router.get("/:id", user.findOne);

    // Retrieve user by username
    router.get("/username", user.findByUsername);
    
    // Update a User with id
    router.put("/:id", user.update);

    // Delete a User with id 
    router.delete("/:id", user.delete);

    app.use('/api/users', router);
};