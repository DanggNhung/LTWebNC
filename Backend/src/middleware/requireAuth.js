/**
 * Middleware kiểm tra người dùng đã đăng nhập chưa.
 * Trả về 401 nếu chưa có session hoặc session đã hết hạn.
 */
function requireAuth(req, res, next) {
  if (!req.session?.user) {
    return res.status(401).json({
      error: {
        message: "Bạn cần đăng nhập để thực hiện thao tác này",
        statusCode: 401
      }
    });
  }

  next();
}

/**
 * Middleware kiểm tra người dùng có vai trò Quản trị viên.
 * Phải dùng sau requireAuth.
 */
function requireAdmin(req, res, next) {
  if (req.session?.user?.role !== "Quản trị viên") {
    return res.status(403).json({
      error: {
        message: "Bạn không có quyền thực hiện thao tác này",
        statusCode: 403
      }
    });
  }

  next();
}

module.exports = { requireAdmin, requireAuth };
