exports.adminAuth = (req, res, next) => {
  try {
    req.user = { id: 1 };
    console.log("Auth Check");
  } catch (error) {
    console.log("Auth failed");
    return res.status(500).json({
      error: error?.details?.[0]?.message || "Error!",
    });
  } finally {
    next();
  }
};

exports.userAuth = (req, res, next) => {
  try {
    req.user = { id: 1 };
    console.log("Auth Check");
  } catch (error) {
    console.log("Auth failed");
    return res.status(500).json({
      error: error?.details?.[0]?.message || "Error!",
    });
  } finally {
    next();
  }
};
