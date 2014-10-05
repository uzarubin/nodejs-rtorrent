var log = require('../log/log');
var feeds = require('../feeds/feeds');

module.exports = angular
	.module('feeds.edit', [
		'ui.router',
		log.name,
		feeds.name
	])
	.config(function($stateProvider) {
		$stateProvider.state('home.feeds.edit', {
			url: '/:id/edit',
			views: {
				'modal@': {
					templateUrl: 'feeds.edit/feeds.edit.tpl.html',
					controller: 'FeedsEditCtrl as feedsEditCtrl'
				}
			},
			isModal: true,
			data: {
				rule: ['isLoggedIn']
			},
			resolve: {
				feed: function (Feeds, $stateParams) {
					return Feeds.getFeed($stateParams.id);
				}
			}
		});
	});

require('./feeds.edit-controller');