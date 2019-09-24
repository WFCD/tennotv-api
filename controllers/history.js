'use strict';

const router = require('express').Router();
const fetch = require('node-fetch');
const {
  logger, setHeadersAndJson, baseUrl, token,
} = require('../utilities');

const add = async (req, res) => {
  const { body } = req;
  if (!body.token && !req.query.token) {
    res.status(403);
    setHeadersAndJson(res, { message: 'No user token provided.' });
    return;
  }

  if (!body.video_id && !req.query.video_id) {
    res.status(403);
    setHeadersAndJson(res, { message: 'No video id provided.' });
    return;
  }
  const opts = [
    'method=add-watcher-history',
    `user_token=${body.token || req.query.token}`,
    `video_id=${body.video_id || req.query.video_id}`,
    `secret_token=${token}`,
    'tenno_tv=true',
  ];
  const url = `${baseUrl}?${opts.join('&')}`;
  try {
    logger.debug(url);
    const snekRes = await fetch(url).then((data) => data.json());
    setHeadersAndJson(res, snekRes);
  } catch (e) {
    logger.error(e.type === 'Buffer' ? e.string : e.toString());
    res.status(500);
    setHeadersAndJson(res, { message: 'Error adding to watcher history.' });
  }
};
const deleteH = async (req, res) => {
  const opts = [
    'method=delete-watched-videos-list',
    `user_token=${req.query.token}`,
    `secret_token=${token}`,
    'tenno_tv=true',
  ];
  const url = `${baseUrl}?${opts.join('&')}`;
  try {
    logger.debug(url);
    const snekRes = await fetch(url).then((data) => data.json());
    setHeadersAndJson(res, snekRes);
  } catch (e) {
    logger.error(e);
    res.status(500);
    setHeadersAndJson(res, { message: 'Error deleting from watcher history.' });
  }
};

router.post('/add', add);
router.delete('/delete', deleteH);

module.exports = router;
