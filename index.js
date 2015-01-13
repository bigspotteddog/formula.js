var categories = [
  require('./lib/compatibility'),
  require('./lib/cube'),
  require('./lib/database'),
  require('./lib/date-time'),
  require('./lib/engineering'),
  require('./lib/financial'),
  require('./lib/information'),
  require('./lib/logical'),
  require('./lib/lookup-reference'),
  require('./lib/math-trig'),
  require('./lib/statistical'),
  require('./lib/text'),
  require('./lib/web'),
];

for (var c in categories) {
  var category = categories[c];
  for (var f in category) {
    exports[f] = exports[f] || category[f];
  }
}
