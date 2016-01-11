require('angular');

angular.module('webApp').controller('votedDelegatesController', ['$scope', '$rootScope', '$http', "userService", "$interval", "$timeout", "$filter", "ngTableParams", "delegateService", "voteModal", "viewFactory",
    function ($rootScope, $scope, $http, userService, $interval, $timeout, $filter, ngTableParams, delegateService, voteModal, viewFactory) {
        $scope.view = viewFactory;
        $scope.view.inLoading = true;
        $scope.view.loadingText = "Loading delegates";
        $scope.view.page = {title: 'Forging', previos: null};
        $scope.view.bar = {forgingMenu: true};
        $scope.allVotes = 100
        * 1000
        * 1000
        * 1000
        * 1000
        * 100;

        $scope.count = 0;

        $scope.address = userService.address;
        $scope.loading = true;
        $scope.showVotes = false;

        $scope.getApproval = function (vote) {
            return (vote / $scope.allVotes ) * 100;
        };

        $scope.voteList = {
            list: {},
            length: 0,
            recalcLength: function () {
                var size = 0, key;
                for (key in this.list) {
                    if (this.list.hasOwnProperty(key)) size++;
                }
                this.length = size;
            },
            inList: function (publicKey) {
                return !!this.list[publicKey];
            },
            vote: function (publicKey, username, $event, stop) {
                if (stop) {
                    $event.stopPropagation();
                }
                if (this.inList(publicKey)) {
                    delete this.list[publicKey];
                }
                else {
                    this.list[publicKey] = username;
                }
                this.recalcLength();
                if (this.length == 0) {
                    $scope.moreDropdownSeelction.isopen = false;
                }
            },
            toggle: function () {
                $scope.showVotes = !$scope.showVotes;
            }
        };

        $scope.vote = function (publicKey) {
            if ($scope.voteList.length < 1) {
                return;
            }
            $scope.showVotes = false;
            $scope.voteModal = voteModal.activate({
                totalBalance: $scope.unconfirmedBalance,
                voteList: $scope.voteList.list,
                adding: false,
                destroy: function (keepVotes) {
                if (keepVotes) {
                    $scope.voteList.recalcLength();
                    return;
                }
                    $scope.voteList.list = {};
                    $scope.voteList.recalcLength();
                    $scope.unconfirmedTransactions.getList();
                }
            });
        };

        $scope.balance = userService._unconfirmedBalance;

        //Unconfirmed transactions
        $scope.unconfirmedTransactions = {
            list: [],
            getList: function () {
                $http.get("/api/transactions/unconfirmed/", {params: {senderPublicKey: userService.publicKey}})
                    .then(function (response) {
                        $scope.unconfirmedTransactions.list = [];
                        response.data.transactions.forEach(function (transaction) {
                            $scope.unconfirmedTransactions.list = $scope.unconfirmedTransactions.list.concat(transaction.asset.votes);

                        });
                    });

            },
            inList: function (publicKey) {
                return this.list.indexOf('-' + publicKey) != -1;
            }
        };
        $scope.unconfirmedTransactions.getList();
        //end Unconfirmed transactions


        //My deletates
        $scope.tableMyDelegates = new ngTableParams({
            page: 1,            // show first page
            count: 25,
            sorting: {
                rate: 'asc'     // initial sorting
            }
        }, {
            counts: [],
            total: 0,
            getData: function ($defer, params) {
                delegateService.getMyDelegates($defer, params, $scope.filter, userService.address, function () {
                    $scope.count = params.total();
                    $scope.loading = false;
                    $scope.view.inLoading = false;
                    $timeout(function () {
                        $scope.unconfirmedTransactions.getList();

                    }, 1000);
                });
            }
        });

        $scope.tableMyDelegates.settings().$scope = $scope;

        $scope.$watch("filter.$", function () {
            $scope.tableMyDelegates.reload();
        });

        $scope.updateMyDelegates = function () {
            $scope.tableMyDelegates.reload();
        };
        //end My delegates


        $scope.updateView = $interval(function () {
            delegateService.cachedVotedDelegates.time = delegateService.cachedVotedDelegates.time - 20000;
            $scope.updateMyDelegates();
        }, 1000 * 10);

        $scope.$on('updateControllerData', function (event, data) {
            if (data.indexOf('main.votes') != -1) {
                $scope.updateMyDelegates();
            }
        });

        $scope.$on('$destroy', function () {
            $interval.cancel($scope.updateView);
            $scope.updateView = null;
        });
    }]);