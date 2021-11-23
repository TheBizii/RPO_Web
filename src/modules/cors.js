export default (function (req, res, next) {
  res.header("Accept-Encoding", "gzip");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, timeout"
  );
  // add headers if required
  next();
});
