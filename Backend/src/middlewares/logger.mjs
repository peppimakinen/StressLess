
// Log client API interactions to console
const logger = (req, res, next) => {
  console.log('Logger: ', req.method, req.path);
  next();
};

export default logger;
