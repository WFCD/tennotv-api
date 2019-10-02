'use strict';

const router = require('express').Router();
const fetch = require('node-fetch');

const { logger, setHeadersAndJson, baseUrl } = require('../utilities');

router.get('/', async (req, res) => {
  logger.log('silly', `Got ${req.originalUrl} | Option: ${req.method.toLowerCase()}`);
  let opts = ['method=get-content-creator-playlists', 'tenno_tv=true'];

  let url = `${baseUrl}?${opts.join('&')}`;

  try {
    const contentCreators = await fetch(url).then((data) => data.json());

    const playlists = {
      creators: contentCreators,
    };
    opts = ['method=get-categories-playlists', 'tenno_tv=true'];
    url = `${baseUrl}?${opts.join('&')}`;
    playlists.categories = await fetch(url).then((data) => data.json());

    setHeadersAndJson(res, playlists);
  } catch (error) {
    logger.log('error', error);
    res.status(500);
    setHeadersAndJson(res, { message: 'Error fetching dashboard.' });
  }
});

module.exports = router;
