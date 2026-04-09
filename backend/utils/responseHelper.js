/**
 * Standard API response helpers.
 * Every endpoint must use these to match the frontend ApiResponse<T> type.
 */

function ok(res, data, message = 'Success', status = 200) {
  return res.status(status).json({
    success: true,
    data,
    message,
  });
}

function fail(res, message = 'Something went wrong.', status = 400) {
  return res.status(status).json({
    success: false,
    message,
  });
}

module.exports = { ok, fail };
