// Middleware to validate request body against a Zod schema
const validate = (schema) => {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated; // Replace body with validated data
      next();
    } catch (err) {
      if (err.issues) {
        // Zod validation error
        return res.status(400).json({
          message: "Validation failed",
          errors: err.issues.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        });
      }
      return res.status(400).json({ message: "Invalid request data" });
    }
  };
};

module.exports = { validate };
