require('angular');
require('angular-ui-router');
require('angular-modal');
require('angular-resource');
require('angular-filter');
require('browserify-angular-animate');
require('ng-clip');
//require('../bower_components//angular-animate/angular-animate.js')
require('../bower_components/angular-chart.js/dist/angular-chart.js');
require('../bower_components/angular-socket-io/socket.js');
//require('../bower_components/angular-materialize/src/angular-materialize.js');
require('../node_modules/ng-table/dist/ng-table.js');

webApp = angular.module('webApp', ['ui.router', 'btford.modal', 'ngTable', 'ngAnimate',  'chart.js', 'btford.socket-io', 'ui.bootstrap', 'ngClipboard', 'angular.filter']);

webApp.config(["ngClipProvider",
    "$locationProvider",
    "$stateProvider",
    "$urlRouterProvider",
    function (ngClipProvider, $locationProvider, $stateProvider, $urlRouterProvider) {
        ngClipProvider.setPath("../node_modules/zeroclipboard/dist/ZeroClipboard.swf");

        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise("/");

        // Now set up the states
        $stateProvider
            .state('main', {
                abstract: true,
                templateUrl: "/partials/app-template.html",
                controller: "templateController"
            })
            .state('main.dashboard', {
                url: "/dashboard",
                templateUrl: "/partials/account.html",
                controller: "accountController"
            })
            .state('main.multi', {
                url: "/wallets",
                templateUrl: "/partials/multi.html",
                controller: "walletsController"
            })
            .state('main.dappstore', {
                url: "/dappstore",
                templateUrl: "/partials/dapps.html",
                controller: "dappsController"
            })
            .state('main.dappsCategory', {
                url: "/dappstore/:categoryId",
                templateUrl: "/partials/dapps-category.html",
                controller: "dappsCategoryController"
            })
            .state('main.dappentry', {
                url: "/dapp/:dappId",
                templateUrl: "/partials/dapp-entry.html",
                controller: "dappController"
            })
            .state('main.multiPendings', {
                url: "/wallets/pendings",
                templateUrl: "/partials/wallet-pendings.html",
                controller: "walletPendingsController"
            })
            .state('main.walletTransactions', {
                url: "/wallets/:walletId",
                templateUrl: "/partials/wallet-transactions.html",
                controller: "walletTransactionsController"
            })
            .state('main.settings', {
                url: "/settings",
                templateUrl: "/partials/settings.html",
                controller: "settingsController"
            })
            .state('main.transactions', {
                url: "/transactions",
                templateUrl: "/partials/transactions.html",
                controller: "transactionsController"
            })
            .state('main.delegates', {
                url: "/delegates",
                templateUrl: "/partials/delegates.html",
                controller: "delegatesController"
            })
            .state('main.votes', {
                url: "/delegates/votes",
                templateUrl: "/partials/votes.html",
                controller: "votedDelegatesController"
            })
            .state('main.forging', {
                url: "/forging",
                templateUrl: "/partials/forging.html",
                controller: "forgingController"
            })
            .state('main.blockchain', {
                url: "/blockchain",
                templateUrl: "/partials/blockchain.html",
                controller: "blockchainController"
            })
            .state('main.contacts', {
                url: "/contacts",
                templateUrl: "/partials/contacts.html",
                controller: "contactsController"
            })
            .state('main.pending', {
                url: "/pending",
                templateUrl: "/partials/pendings.html",
                controller: "pendingsController"
            })
            .state('passphrase', {
                url: "/",
                templateUrl: "/partials/passphrase.html",
                controller: "passphraseController"
            });
    }
]);




