const { grafana } = require('../package.json');

console.log(`export GF_INSTALL_VERSION=${grafana.version}`);
