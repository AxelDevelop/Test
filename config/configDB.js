const mongoDB = 'mongodb+srv://Admin:1234@cluster0.fukdn.mongodb.net/?retryWrites=true&w=majority'
const mongoose = require('mongoose');


function connectDB () {
    try {
        mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            console.log('Succesfull Database Connection');
        })
    } catch (error) {
        console.log(error);
    }
} 

module.exports = {
    connectDB: connectDB(), 
}