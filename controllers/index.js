'use strict';

const router = require('express').Router();

router.use('/dashboard', require('./dashboard'));
router.use('/videos', require('./videos'));
router.use('/history', require('./history'));
router.use('/', require('./videos'));

module.exports = router;
