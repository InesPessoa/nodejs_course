const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    let doc;
    try {
      doc = await Model.findByIdAndDelete(req.params.id);
    } catch (err) {
      doc = null;
    }
    if (!doc) {
      return next(new AppError("No doc found with that ID", 404));
    }
    res.status(204).json({
      status: "sucess",
      data: null,
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: doc,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    let doc;
    try {
      doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
    } catch (err) {
      doc = null;
    }
    if (!doc) {
      return next(new AppError("No doc found with that ID", 404));
    }
    res.status(200).json({
      status: "sucess",
      data: doc,
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let doc;
    try {
      console.log("id", req.params.id);
      let query = Model.findById(req.params.id);
      if (popOptions) query = query.populate(popOptions);
      doc = await query;
    } catch (err) {
      console.log("error");
      console.log(err);
      doc = null;
    }
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    res.status(200).json({
      status: "sucess",
      data: doc,
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filters = { tourId: req.params.tourId };
    const apiFeaturs = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await apiFeaturs.query; //.explain

    res.status(200).json({
      status: "sucess",
      requestedAt: req.requestTime,
      data: docs,
    });
  });
