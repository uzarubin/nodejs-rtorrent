var feeds = require('../models/feeds');
var logger = require('winston');
var auth = require('./auth');
var Q = require('q');

module.exports = function(app) {
	app.get('/feeds', auth.ensureAuthenticated, getFeeds);
	app.get('/feeds/:id', auth.ensureAuthenticated, getFeed);
	app.post('/feeds', auth.ensureAuthenticated, addFeed);
	app.put('/feeds/:id', auth.ensureAuthenticated, updateFeed);
	app.del('/feeds/:id', auth.ensureAuthenticated, deleteFeed);
	app.post('/feeds/test', auth.ensureAuthenticated, testFeed);
	app.post('/feeds/:id/refresh', auth.ensureAuthenticated, refreshFeed);
}

function getFeed(req, res) {
	logger.info('Getting feed', req.params.id);

	feeds.get(req.params.id).then(function(data) {
		logger.info('Successfully retrieved rss feed', data._id);
		res.json(data);
	}, function(err) {
		logger.error(err.message);
		res.status(500).send(err.message);
	});
}

function getFeeds(req, res) {
	feeds.getAll().then(function(data) {
		logger.info('Successfully retrieved rss feeds');
		res.json(data.map(function(feed) {
			return {
				_id: feed._id,
				title: feed.title,
				lastChecked: feed.lastChecked,
				rss: feed.rss,
				regexFilter: feed.regexFilter,
				autoDownload: feed.autoDownload,
				filters: feed.filters,
				torrents: feed.torrents.sort(function(a, b) {
					a = a.date;
					b = b.date;
					return a > b ? -1 : a < b ? 1 : 0;
				})
			};
		}));
	}, function(err) {
		logger.error(err.message);
		res.status(500).send(err.message);
	});
}

function addFeed(req, res) {
	logger.info('Adding feed', req.body.rss);

	feeds.add({
		title: req.body.title,
		rss: req.body.rss,
		autoDownload: req.body.autoDownload,
		regexFilter: req.body.regexFilter,
		filters: req.body.filters
	}).then(function(data) {
		logger.info('Successfully saved feed.');
		res.json(data);
	}, function(err) {
		console.log(err);
		logger.error(err.message);
		res.status(500).send(err.message);
	});
}



function updateFeed(req, res) {
	logger.info('Updating feed', req.params.id);

	feeds.edit({
		_id: req.params.id,
		title: req.body.title,
		autoDownload: req.body.autoDownload,
		regexFilter: req.body.regexFilter,
		filters: req.body.filters
	}).then(function(data) {
		res.json(data);
	}, function(err) {
		logger.error(err.message);
		res.status(500).send(err.message);
	}); 
}

function deleteFeed(req, res) {
	logger.info('Removing feed', req.params.id);
	feeds.deleteFeed(req.params.id).then(function(data) {
		logger.info('Successfully deleted feed');
		res.json(data);
	}, function(err) {
		logger.error(err.message);
		res.status(500).send(err);
	});
}

function refreshFeed (req, res) {
	logger.info('Refreshing feed', req.params.id);
	feeds.refreshFeed(req.params.id).then(function (data) {
		logger.info('Successfully refreshed feed');
		res.json(data);
	}, function (err) {
		logger.error(err.message);
		req.status(500).send(err);
	});
}

function testFeed (req, res) {
	logger.info('Testing Feed');
	// feeds.test()
}