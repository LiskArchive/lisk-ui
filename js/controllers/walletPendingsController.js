require('angular');

angular.module('webApp').controller('walletPendingsController', ['$scope', '$rootScope', '$http', "userService", "$interval", "sendCryptiModal", "secondPassphraseModal", "delegateService", 'viewFactory', 'transactionsService', 'ngTableParams', 'transactionInfo', '$timeout', 'userInfo',
    function ($rootScope, $scope, $http, userService, $interval, sendCryptiModal, secondPassphraseModal, delegateService, viewFactory, transactionsService, ngTableParams, transactionInfo, $timeout, userInfo) {

        $scope.view = viewFactory;
        $scope.view.inLoading = true;
        $scope.view.loadingText = "Loading transactions";
        $scope.view.page = {title: 'Pending transactions', previos: null};
        $scope.view.bar = {showWalletBar: true};
        $scope.showAllColumns = true;
        $scope.showFullTime = false;
        $scope.transactionsView = transactionsService;
        $scope.searchTransactions = transactionsService;
        $scope.countForgingBlocks = 0;

        var data = [{
            "id": "13463832999163921346",
            "height": "59606",
            "type": 0,
            "timestamp": 8683441,
            "senderPublicKey": "667e390ba5dcb5b79e371654027807459b1ab7becb4e778f73e9eec090205b10",
            "wallet": "17649443584386761059C",
            "senderId": "5802249785291420991C",
            "recipientId": "2334212999465599568C",
            "senderUsername": "test2",
            "recipientUsername": "",
            "amount": 100000000,
            "fee": 100000,
            "signature": "f1c83444fa2ea741d4548533128c9e9b12c184676716730e27016dc7acc35aa8afc3880cd05f5dab46938cdaaf64c7a21f17fb58b07dce6cba3508a78944b409",
            "signSignature": "",
            "confirmations": "68504",
            "asset": {},
            "multi": {'confirmations': 0, "needed": 2},
            "signList": [{"address": "Your sign", value: 2},
                {"address": "17649443584386761059C", value: 1}, {
                    "address": "17649443584386761059C",
                    value: 0
                }]
        }, {
            "id": "5115172454095023293",
            "height": "79337",
            "type": 0,
            "timestamp": 8881015,
            "senderPublicKey": "631b91fa537f74e23addccd30555fbc7729ea267c7e0517cbf1bfcc46354abc3",
            "wallet": "17649443584386761059C",
            "senderId": "5802249785291420991C",
            "recipientId": "17649443584386761059C",
            "senderUsername": "",
            "recipientUsername": "",
            "amount": 120000000000,
            "fee": 120000000,
            "signature": "c761913c5afca78854f65661a2bed2c435e788da92a0ae48cabc1a69f12422c696af56f62b7f27696b6a51c8a80fb2df640a7f4bd1c3997623700a2ec4f6ff09",
            "signSignature": "",
            "confirmations": "48773",
            "asset": {},
            "multi": {'confirmations': 3, "needed": 4},
            "signList": [{"address": "Your sign", value: 2},
                {"address": "17649443584386761059C", value: 1}, {
                    "address": "17649443584386761059C",
                    value: 0
                }]
        }, {
            "id": "3056163072523851956",
            "height": "59603",
            "type": 0,
            "timestamp": 8683414,
            "senderPublicKey": "631b91fa537f74e23addccd30555fbc7729ea267c7e0517cbf1bfcc46354abc3",
            "wallet": "17649443584386761059C",
            "senderId": "5802249785291420991C",
            "recipientId": "5507528978847206288C",
            "senderUsername": "",
            "recipientUsername": "",
            "amount": 2500000000000,
            "fee": 2500000000,
            "signature": "65c7b4b2bcd5c319c6643b1fab891b34ede8f96126402431f1ef7315470e177f2efa666db5bd5438767a99a984c7f2a162569d7a567f7a25e8945f85c84f1b03",
            "signSignature": "",
            "confirmations": "68507",
            "asset": {},
            "multi": {'confirmations': 0, "needed": 3},
            "signList": [{"address": "Your sign", value: 2},
                {"address": "17649443584386761059C", value: 1}, {
                    "address": "17649443584386761059C",
                    value: 0
                }]
        }, {
            "id": "14050782107410762371",
            "height": "43649",
            "type": 5,
            "timestamp": 8522736,
            "senderPublicKey": "631b91fa537f74e23addccd30555fbc7729ea267c7e0517cbf1bfcc46354abc3",
            "wallet": "17649443584386761059C",
            "senderId": "5802249785291420991C",
            "recipientId": "",
            "senderUsername": "",
            "recipientUsername": "",
            "amount": 0,
            "fee": 100000000,
            "signature": "25dd2157d68bd3e68fd8a6491ed6a39022a6a84c100c3fe7f301568ee844db5b6709a54dd43a9ddd275934bfd9becd30713f7016bd40fbdd7f326324b4cdd004",
            "signSignature": "",
            "confirmations": "84461",
            "asset": {},
            "multi": {'confirmations': 1, "needed": 7},
            "signList": [{"address": "Your sign", value: 2},
                {"address": "17649443584386761059C", value: 1}, {
                    "address": "17649443584386761059C",
                    value: 0
                }]
        }, {
            "id": "12933708830367183608",
            "height": "43635",
            "type": 5,
            "timestamp": 8522585,
            "senderPublicKey": "631b91fa537f74e23addccd30555fbc7729ea267c7e0517cbf1bfcc46354abc3",
            "wallet": "17649443584386761059C",
            "senderId": "5802249785291420991C",
            "recipientId": "",
            "senderUsername": "",
            "recipientUsername": "",
            "amount": 0,
            "fee": 100000000,
            "signature": "9bba261f6c9819059aac822d310bda808c18e0137c45d278b4774985c6cbadae6bc0e269f0db9948c84a18f15ed70d205ea2cd3f7367e56a6ebf3ac258856504",
            "signSignature": "",
            "confirmations": "84475",
            "asset": {},
            "multi": {'confirmations': 1, "needed": 2},
            "signList": [{"address": "Your sign", value: 2},
                {"address": "17649443584386761059C", value: 1}, {
                    "address": "17649443584386761059C",
                    value: 0
                }]
        }]

        $scope.userInfo = function (userId) {
            $scope.modal = userInfo.activate({userId: userId});
        }

        $scope.transactionInfo = function (block, signList) {
            $scope.modal = transactionInfo.activate({block: block, signList: signList});
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
                $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                $scope.view.inLoading = false;
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

        $scope.updateTransactions();

    }]);