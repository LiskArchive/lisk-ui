require('angular');

angular.module('webApp').controller('userInfoController', ["$scope", "$http", "userInfo", "userService","sendCryptiModal", function ($scope, $http, userInfo, userService, sendCryptiModal) {

    $scope.userIdOld = '';
    $scope.thisUser = userService;

    $scope.sendCryptiToUser = function () {
        userInfo.deactivate();
        $scope.sendCryptiModal = sendCryptiModal.activate({
            totalBalance: $scope.unconfirmedBalance,
            to: $scope.userId,
            destroy: function () {
            }
        });
    }

    $scope.getAccountDetail = function (userId) {
        if ($scope.userIdOld == userId){
            return;
        }
        $scope.userIdOld = userId;
        $scope.transactions = {view: false, list: [1]};
        $http.get("/api/accounts", {params: {address: userId}})
            .then(function (resp) {
                $scope.account = resp.data.account;
                    $http.get("/api/transactions", {
                        params: {
                            senderPublicKey: $scope.account.publicKey,
                            recipientId: $scope.account.address,
                            limit: 6,
                            orderBy: 't_timestamp:desc'
                        }
                    })
                        .then(function (resp) {
                            var transactions = resp.data.transactions;

                            $http.get('/api/transactions/unconfirmed', {
                                params: {
                                    senderPublicKey: $scope.account.publicKey,
                                    address: $scope.account.address
                                }
                            })
                                .then(function (resp) {
                                    var unconfirmedTransactions = resp.data.transactions;
                                    $scope.transactions.list = unconfirmedTransactions.concat(transactions).slice(0, 6);
                                });
                        });
            });
    }

    $scope.transactions = {view: false, list: [1]};

    $scope.toggleTransactions = function () {
        $scope.transactions.view = !$scope.transactions.view;
    }
    $scope.close = function () {
        userInfo.deactivate();
    }

    $scope.getAccountDetail($scope.userId);
}]);