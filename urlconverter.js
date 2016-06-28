var url = require("url");
var moment = require("moment-timezone");

module.exports = URLConverter;

function URLConverter(path) {
  this.path = path;
}

URLConverter.prototype.convert = function() {
  var urlParts = url.parse(this.path, true);
  if (urlParts.pathname == '/banners/vlp' && undefined != urlParts.query) {
    if(undefined != urlParts.query.area_id) {
      var queryForAreaIdFilter = '{"$or":[{"area_id":"' + urlParts.query.area_id + '"},{"pan_india":"1"}]}';
      var queryForDateValidation = this.validateDate();
      this.path = urlParts.pathname + '?filter={"$and":[' + queryForAreaIdFilter + ',' + queryForDateValidation + ']}';
    }
  }
  return this.path;
}

URLConverter.prototype.validateDate = function() {
  var currentDate = moment(Date.now()).tz('Asia/Kolkata').format('YYYY-MM-DD');
  var queryForDateValidation = '{"from_timestamp":{"$lte":"' + currentDate + '"}},' +
      '{"to_timestamp":{"$gte":"' + currentDate + '"}}';
  return queryForDateValidation;
}
