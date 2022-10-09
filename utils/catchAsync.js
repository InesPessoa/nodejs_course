module.exports = (fn) => {
  const catchError = (req, res, next) => {
    fn(req, res, next).catch(next);
  };
  return catchError;
};
