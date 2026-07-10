function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    error: {
      message: error.message || "Lỗi máy chủ",
      statusCode
    }
  });
}

module.exports = errorHandler;
