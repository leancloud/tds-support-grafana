const { exec } = require('node:child_process');
const { Server } = require('node:http');
const httpProxy = require('http-proxy');

process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);

exec('./bin/grafana-server web', {
  cwd: './grafana-8.5.9',
  env: {
    ...process.env,
    ...(() => {
      const es = new URL(process.env.ELASTICSEARCH_URL_MYES);
      return {
        ES_URL: es.origin,
        ES_USERNAME: es.username,
        ES_PASSWORD: es.password,
      };
    })(),
  },
});

const proxy = httpProxy.createProxyServer({
  target: 'http://localhost:4000',
});

const server = new Server((req, res) => {
  const heathCheckPath = new RegExp('^/__engine/\\d+(.\\d+)?/ping$');
  if (heathCheckPath.test(req.url)) {
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        runtime: 'grafana',
        version: '8.5.9',
      })
    );
    return;
  }

  proxy.web(req, res);
});

const port = parseInt(process.env.LEANCLOUD_APP_PORT ?? '3000');

server.listen(port);
