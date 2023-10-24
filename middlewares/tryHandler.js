const tryHandler = (clb) => {
  return async (req, res, next) => {
    try {
      await clb(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

module.exports = tryHandler