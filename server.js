const { execSync } = require('node:child_process');

execSync('./bin/grafana-server web', {
  cwd: './grafana',
  env: {
    ...process.env,
    ...getElasticSearchEnvs('MYES'),
    ...getMysqlEnvs('MYRDB'),
    GF_SERVER_HTTP_PORT: process.env.LEANCLOUD_APP_PORT ?? '3000',
    GF_DATABASE_TYPE: 'mysql',
  },
});

function getElasticSearchEnvs(instanceName) {
  const url = new URL(process.env[`ELASTICSEARCH_URL_${instanceName}`]);
  return {
    ES_URL: url.origin,
    ES_USERNAME: url.username,
    ES_PASSWORD: url.password,
  };
}

function getMysqlEnvs(instanceName) {
  const host = process.env[`MYSQL_HOST_${instanceName}`];
  const port = process.env[`MYSQL_PORT_${instanceName}`];
  const user = process.env[`MYSQL_ADMIN_USER_${instanceName}`];
  const password = process.env[`MYSQL_ADMIN_PASSWORD_${instanceName}`];
  return {
    GF_DATABASE_HOST: `${host}:${port}`,
    GF_DATABASE_USER: user,
    GF_DATABASE_PASSWORD: password,
  };
}
