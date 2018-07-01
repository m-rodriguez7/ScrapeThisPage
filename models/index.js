// object that is exported to our server, containing mongo/mongoose models

module.exports = {
    Article: require("./Article"),
    Note: require("./Note")
};