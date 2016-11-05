const {send, json} = require('micro');
const {graphql} = require('graphql');
const hello = require('./hello');
const {parse} = require('url');
const fs = require('fs');

const serve = (res, path, type = 'text/html') => {
  res.setHeader('Content-Type', type);
  return fs.createReadStream(path).pipe(res);
}

const graph = async (req, res) => {
  if (req.method !== 'POST') {
    return send(res, 405, 'Method Not Allowed');
  }

  const body = await json(req);
  const response = await graphql(hello, body.query);

  if (response.errors) {
    return send(res, 400, response);
  }

  send(res, 200, response);
}

module.exports = async (req, res) => {
  const {pathname} = parse(req.url);
  switch(pathname) {
    case '/': return serve(res, './index.html');
    case '/bundle.js': return serve(res, './bundle.js', 'application/javascript');
    case '/graph': return await graph(req, res);
    default: send(res, 200, 'OK')
  }
}
