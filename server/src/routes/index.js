// Import components
const authRouter = require('./auth');
const userRouter = require('./user');
const postRouter = require('./post');
const appRouter = require('./app');

// Define function
function route(app) {
    app.use('/v1/post', postRouter);

    app.use('/v1/user', userRouter);

    app.use('/v1/auth', authRouter);

    app.use('/v1', appRouter);
}

module.exports = route;
