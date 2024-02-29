exports.reqValidator = (schema) => {
  return (req, res, next) => {
    try {
      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          error: error?.details?.[0]?.message || "Invalid request body!",
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: error?.details?.[0]?.message || "Invalid request body!",
      });
    } finally {
      next();
    }
  };
};
