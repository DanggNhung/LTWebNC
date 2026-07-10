function notFound(req, res) {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const isApiRequest = req.originalUrl.startsWith("/api");

  res.status(404).json({
    error: {
      message: isApiRequest
        ? "Không tìm thấy API endpoint"
        : "Backend hiện chỉ cung cấp API JSON, không render giao diện. Hãy mở giao diện React ở Frontend.",
      statusCode: 404,
      path: req.originalUrl,
      frontendUrl,
      apiBaseUrl: "/api",
      examples: ["/api/health", "/api/students", "/api/classes", "/api/subjects", "/api/accounts"]
    }
  });
}

module.exports = notFound;
