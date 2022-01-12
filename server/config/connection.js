const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Alice:PasswordMongo1!@cluster0.mp04l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority' || 'mongodb://localhost/googlebooks', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

module.exports = mongoose.connection;
