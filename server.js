'use strict';

/* eslint-disable import/no-unresolved */
const express = require('express');
const helmet = require('helmet');
const fetch = require('node-fetch');

const { transports, createLogger, format } = require('winston');

const {
  combine, label, printf, colorize,
} = format;
/* eslint-enable import/no-unresolved */

const base = 'http://xenogelion.com/Hidden/content_creator_scraper.php';

/* Routes */
const TennoTv = require('./routes/TennoTv');

const transport = new transports.Console({ colorize: true });
const logFormat = printf(info => `[${info.label}] ${info.level}: ${info.message}`);
const logger = createLogger({
  format: combine(
    colorize(),
    label({ label: 'API' }),
    logFormat,
  ),
  transports: [transport],
});
logger.level = process.env.LOG_LEVEL || 'error';

const setHeadersAndJson = (res, json) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range');
  res.setHeader('Access-Control-Expose-Headers', 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range');
  res.json(json);
};

const deps = {
  logger,
  setHeadersAndJson,
};

const routes = {
  tennotv: new TennoTv('/', deps),
};

const app = express();
app.use(helmet());
app.use(express.json());

app.all('/', async (req, res) => {
  await routes.tennotv.handle(req, res, req.method.toLowerCase());
});

app.get('/dashboard', async (req, res) => {
  logger.log('silly', `Got ${req.originalUrl} | Option: ${req.method.toLowerCase()}`);
  let opts = ['method=get-content-creator-playlists'];

  let url = `${base}?${opts.join('&')}`;
  
  try {
    logger.log('debug', url);
    const contentCreators = await fetch(url).then(data => data.json());
    
    const playlists = {
      creators: contentCreators,
    };
    opts = ['method=get-categories-playlists', 'tenno_tv=true'];
    url = `${base}?${opts.join('&')}`;
    playlists.categories = await fetch(url).then(data => data.json());
    
    setHeadersAndJson(res, playlists);
  } catch (error) {
    logger.log('error', error);
    res.status(500);
    setHeadersAndJson(res, { message: 'Error fetching dashboard.' });
  }
});

// oh no, nothing
app.use((req, res) => {
  res.status(404).end();
});

module.exports = app;
