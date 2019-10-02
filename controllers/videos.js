'use strict';

const router = require('express').Router();
const fetch = require('node-fetch');
const {
  logger, setHeadersAndJson, baseUrl, token,
} = require('../utilities');

const getList = async (req, res) => {
  const contentCreators = typeof req.query.content_creator_ids !== 'undefined'
    ? (req.query.content_creator_ids || '').split(',')
    : [];
  const method = req.query.initial_video ? 'get-specific-video-with-list' : 'get-videos-list';
  const excluded = req.query.excluded_video_ids ? `excluded_video_ids=${req.query.excluded_video_ids || ''}` : '';
  const creators = contentCreators.length ? `content_creator_ids=${req.query.content_creator_ids}` : '';
  const initialVid = req.query.initial_video ? `video_id=${req.query.initial_video}` : '';

  const opts = [
    `method=${method}`,
    `included_tags=${req.query.included_tags || ''}`,
    excluded,
    `user_token=${req.query.token}`,
    initialVid,
    creators,
    contentCreators.length ? 'include_excluded=1' : '',
    'tenno_tv=true',
  ].filter(opt => opt);

  const url = `${baseUrl}?${opts.join('&')}`;
  try {
    const snekRes = await fetch(url).then(data => data.json());
    const videos = [];
    if (snekRes[0] instanceof Array) {
      videos.push(snekRes[0][0]);
      snekRes.splice(0, 1);
      videos.push(...snekRes);
    } else {
      videos.push(...snekRes);
    }
    setHeadersAndJson(res, videos);
  } catch (e) {
    logger.error(e);
    res.status(500);
    setHeadersAndJson(res, { message: 'Error fetching next videos.' });
  }
};
const getWatched = async (req, res) => {
  const opts = [
    'method=get-history-list',
    `user_token=${req.params.token}`,
    'tenno_tv=true',
  ];
  const url = `${baseUrl}?${opts.join('&')}`;
  try {
    setHeadersAndJson(res, await fetch(url).then(data => data.json()));
  } catch (e) {
    logger.error(e);
    res.status(500);
    setHeadersAndJson(res, { message: 'Error fetching watcher history.' });
  }
};
const getContentCreatorsList = async (req, res) => {
  const opts = [
    'method=get-content-creators',
    `secret_token=${token}`,
    'tenno_tv=true',
  ];
  const url = `${baseUrl}?${opts.join('&')}`;
  try {
    const snekRes = await fetch(url).then(data => data.json());
    setHeadersAndJson(res, snekRes);
  } catch (e) {
    logger.error('e');
    res.status(500);
    setHeadersAndJson(res, { message: 'Error fetching content creators list.' });
  }
};

router.get('/watched', getWatched);
router.get('/creators', getContentCreatorsList);
router.get('/', getList);

module.exports = router;
