const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const tourRouter = require("./routes/tourRoutes.js");
const userRouter = require("./routes/userRoutes.js");
const errorHandler = require("./controllers/errorController");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const app = express();

//global middlewares

//set security http headers
app.use(helmet());

//development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//limit requests from the same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP. please try again in an hour!",
});

app.use("/api", limiter);

//body parser, reading data from the body into req.body
app.use(express.json({ limit: "10kb" }));

//data sanitization against NoSql query injection
app.use(mongoSanitize());

//data sanitization agains XSS
app.use(xss());

//prevent parametar polution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

//serving static files
app.use(express.static(`${__dirname}/public`));

//test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

/*
app.get('/api/v1/tours', getAllTours);
app.get('/api/v1/tours/:id', getTour);
app.post('/api/v1/tours', createTour);
app.patch('/api/v1/tours/:id', updateTour);
app.delete('/api/v1/tours/:id', deleteTour);
*/

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  //const err = `can't find ${req.originalUrl} on the server!`;
  //err.status = 'fail';
  //err.statusCode = 404;
  next(new AppError(`can't find ${req.originalUrl} on the server!`, 404));
});

app.use(errorHandler);

module.exports = app;
