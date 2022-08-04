const { grafana } = require('../package.json');

if (process.env.GF_INSTALL_VERSION) {
  console.log(`echo "Install Grafana ${process.env.GF_INSTALL_VERSION}"`);
} else {
  console.log(`echo "Install Grafana ${grafana.version}"`);
  console.log(`export GF_INSTALL_VERSION=${grafana.version}`);
}
