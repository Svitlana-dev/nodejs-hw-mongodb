// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, _next) {
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    status,
    message: err.message || 'Something went wrong',
    data: err.message,
  });
}
