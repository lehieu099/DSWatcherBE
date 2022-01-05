module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        username:{
            type: Sequelize.STRING
        },
        permission: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.BOOLEAN
        },
        email: {
            type: Sequelize.STRING
        }
    });

    return User;
};