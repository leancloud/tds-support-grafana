const { exec } = require('node:child_process');
const http = require('node:http');
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

/**
 * @type {[RegExp, (req: http.IncomingMessage, res: http.ServerResponse) => void][]}
 */
const routes = [
  [
    /^\/__engine\/(?:1|1\.1)\/ping\/?$/,
    (_, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ runtime: 'grafana', version: '8.5.9' }));
    },
  ],
];

const server = new http.Server((req, res) => {
  for (const route of routes) {
    if (route[0].test(req.url)) {
      route[1](req, res);
      return;
    }
  }
  proxy.web(req, res);
});

const port = parseInt(process.env.LEANCLOUD_APP_PORT ?? '3000');

server.listen(port);
