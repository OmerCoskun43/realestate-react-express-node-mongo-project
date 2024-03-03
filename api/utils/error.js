module.exports = {
  notFound: (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
  },
  errorHandler: (statusCode, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
  },
};
