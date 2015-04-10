var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var employeesSchema = new Schema({
    name: String,
    surname: String,
    email: String,
    Password: String
});

var employeesModel = mongoose.model('Employees', employeesSchema);

module.exports = employeesModel;
