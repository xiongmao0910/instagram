// Import library
const mongoose = require("mongoose");

// Define function
async function connect(uri) {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true });

        console.log("Connect to db successfully!!");
    } catch (error) {
        console.log("Connect to database failed!!");
        console.log(error);
    }
}

module.exports = {
    connect,
};
