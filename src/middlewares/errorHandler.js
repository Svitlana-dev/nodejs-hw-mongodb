/* eslint-disable no-unused-vars */
export default function errorHandler(err, req, res, _next) {
  let status =
    err.status || err.statusCode || (err.name === 'MulterError' ? 400 : 500);
  let message = err.message || 'Something went wrong';
  let details;

  if (err.name === 'MulterError') {
    message = 'Invalid file upload';
    details = { code: err.code, field: err.field };
  }

  if (err.isJoi) {
    status = 400;
    message = 'Validation error';
    details = err.details?.map((d) => d.message);
  }

  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation error';
    details = Object.values(err.errors || {}).map((e) => e.message);
  }

  if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid ID format';
    details = { value: err.value, path: err.path };
  }

  if (err.code === 11000) {
    status = 409;
    message = 'Duplicate key';
    details = err.keyValue;
  }

  if (err.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Invalid token';
  }
  if (err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Token expired';
  }

  if (typeof err.http_code === 'number') {
    status = err.http_code;
  }

  if (process.env.NODE_ENV !== 'production') {
    const fileMeta = req.file
      ? {
          fieldname: req.file.fieldname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          hasBuffer: !!req.file.buffer,
        }
      : undefined;

    const bodyPreview =
      req.is('multipart/*') && req.body
        ? Object.fromEntries(
            Object.entries(req.body).map(([k, v]) => [k, String(v)]),
          )
        : req.body;

    console.error('🔥 ERROR HANDLER', {
      status,
      message,
      name: err.name,
      code: err.code,
      stack: err.stack,
      bodyKeys: Object.keys(req.body || {}),
      body: bodyPreview,
      file: fileMeta,
      path: req.path,
      method: req.method,
    });
  }

  res.status(status).json({
    status,
    message,
    ...(details && { details }),
  });
}
