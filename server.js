'use strict';

/* eslint-disable import/no-unresolved */
const express = require('express');
const helmet = require('helmet');
const { logger } = require('./utilities');

const app = express();
app.use(helmet());
app.use(express.json());
app.use(require('./controllers'));

// oh no, nothing
app.use((req, res) => {
  res.status(404).json({ error: 'No such route.', code: 404 }).end();
});

const port = process.env.PORT || 3001;
const host = process.env.HOSTNAME || process.env.HOST || process.env.IP || 'localhost';
app.listen(port, host);

logger.verbose(`Started listening on ${host}:${port}`);
