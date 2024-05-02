
/**
 * Log client API interactions to console
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
const logger = (req, res, next) => {
  console.log('Logger: ', req.method, req.path);
  next();
};

export default logger;
