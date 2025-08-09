// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, _next) {
  console.error('🔥 ERROR HANDLER:', {
    message: err.message,
    stack: err.stack,
    status: err.status || err.statusCode || 500,
    body: req.body,
    file: req.file && {
      fieldname: req.file.fieldname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      hasBuffer: !!req.file?.buffer,
    },
  });

  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    status,
    message: err.message || 'Something went wrong',
  });
}
