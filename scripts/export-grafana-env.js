const { grafana } = require('../package.json');

if (!process.env.GF_INSTALL_VERSION) {
  console.log(`export GF_INSTALL_VERSION=${grafana.version}`);
}
