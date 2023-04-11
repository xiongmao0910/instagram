// Import components
const userRouter = require("./user");
const authRouter = require("./auth");

// Define function
function route(app) {
    app.use("/v1/user", userRouter);

    app.use("/v1/auth", authRouter);

    app.use("/", (req, res) => {
        res.json({ msg: "Welcome to homepage" });
    });
}

module.exports = route;
