require('angular');

angular.module('webApp').controller('transactionsController', ['$scope', '$rootScope', '$http', "userService", "$interval", "sendCryptiModal", "secondPassphraseModal", "delegateService", 'viewFactory', 'transactionsService', 'ngTableParams', 'transactionInfo', '$timeout', 'userInfo',
    function ($rootScope, $scope, $http, userService, $interval, sendCryptiModal, secondPassphraseModal, delegateService, viewFactory, transactionsService, ngTableParams, transactionInfo, $timeout, userInfo) {
        $scope.view = viewFactory;
        $scope.view.inLoading = true;
        $scope.view.loadingText = "Loading transactions";
        $scope.view.page = {title: 'Transactions', previos: 'main.dashboard'};
        $scope.view.bar = {showTransactionsSearchBar: true};
        $scope.showAllColumns = true;
        $scope.showFullTime = false;
        $scope.transactionsView = transactionsService;
        $scope.searchTransactions = transactionsService;
        $scope.countForgingBlocks = 0;
        $scope.unconfirmedTransactions = [];
        $scope.userInfo = function (userId) {
            $scope.modal = userInfo.activate({userId: userId});
        }

        $scope.transactionInfo = function (block) {
            $scope.modal = transactionInfo.activate({block: block});
        }

        //Transactions
        $scope.tableTransactions = new ngTableParams({
            page: 1,
            count: 25,
            sorting: {
                b_height: 'desc'
            }
        }, {
            total: 0,
            counts: [],
            getData: function ($defer, params) {
                $scope.loading = true;
                transactionsService.getTransactions($defer, params, $scope.filter, $scope.transactionsView.searchForTransaction,
                    function (error) {
                        $scope.searchTransactions.inSearch = false;
                        $scope.countForgingBlocks = params.total();
                        $scope.loading = false;
                        $http.get('/api/transactions/unconfirmed', {
                            params: {
                                senderPublicKey: userService.publicKey,
                                address: userService.address
                            }
                        })
                            .then(function (resp) {
                                var unconfirmedTransactions = resp.data.transactions;
                                $scope.view.inLoading = false;
                                $timeout(function () {
                                    $scope.unconfirmedTransactions = unconfirmedTransactions;
                                    $scope.$apply();
                                }, 1);

                            });
                    });
            }
        });

        $scope.tableTransactions.settings().$scope = $scope;

        $scope.$watch("filter.$", function () {
            $scope.tableTransactions.reload();
        });

        //end Transactions


        $scope.updateTransactions = function () {
            $scope.tableTransactions.reload();
        }

        $scope.$on('$destroy', function () {

        });

        $scope.$on('updateControllerData', function (event, data) {
            if (data.indexOf('main.transactions') != -1) {
                $scope.updateTransactions();
            }
        });

        //Search transactions watcher
        var tempSearchTransactionID = '',
            searchTransactionIDTimeout;
        $scope.$watch('searchTransactions.searchForTransaction', function (val) {
            if (searchTransactionIDTimeout) $timeout.cancel(searchTransactionIDTimeout);
            if (val.trim() != '') {
                $scope.searchTransactions.inSearch = true;
            }
            else {
                $scope.searchTransactions.inSearch = false;
                if (tempSearchTransactionID != val) {
                    tempSearchTransactionID = val;
                    $scope.updateTransactions();
                    return;
                }
            }
            tempSearchTransactionID = val;
            searchTransactionIDTimeout = $timeout(function () {
                $scope.searchTransactions.searchForTransaction = tempSearchTransactionID;
                $scope.updateTransactions();
            }, 2000); // delay 2000 ms
        })

        $scope.updateTransactions();

    }]);