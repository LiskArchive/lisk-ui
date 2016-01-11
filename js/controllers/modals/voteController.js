require('angular');

angular.module('webApp').controller('voteController', ["$scope", "voteModal", "$http", "userService", "$timeout", function ($scope, voteModal, $http, userService, $timeout) {
    $scope.voting = false;
    $scope.fromServer = '';
    $scope.passmode = false;
    $scope.rememberedPassword = userService.rememberPassword ? userService.rememberedPassword : false;
    $scope.secondPassphrase = userService.secondPassphrase;
    $scope.focus = 'secretPhrase';
    $scope.fee = 0;
    $scope.confirmText = $scope.adding ? 'CONFIRM VOTE' : 'REMOVE VOTE';

    Object.size = function (obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };


    $scope.getFee = function(){
        $http.get("/api/accounts/delegates/fee").then(function (resp) {
            if (resp.data.success) {
                $scope.fee = resp.data.fee;
            }
            else {
                $scope.fee = 0;
            }
        });
    }

    $scope.passcheck = function (fromSecondPass) {
        $scope.fromServer=null;
        if (fromSecondPass) {
            $scope.checkSecondPass = false;
            $scope.passmode = $scope.rememberedPassword ? false : true;
            if ($scope.passmode){
                $scope.focus = 'secretPhrase';
            }
            $scope.secondPhrase = '';
            $scope.secretPhrase = '';
            return;
        }
        if ($scope.rememberedPassword) {
            $scope.vote($scope.rememberedPassword);
        }
        else {
            $scope.passmode = !$scope.passmode;
            if ($scope.passmode) {
                $scope.focus = 'secretPhrase';
            }
            $scope.secretPhrase = '';
        }
    }

    $scope.secondPassphrase = userService.secondPassphrase;

    $scope.getFee();

    $scope.close = function () {
        if ($scope.destroy) {
            $scope.destroy(true);
        }
        voteModal.deactivate();
    }

    $scope.removeVote = function (publicKey) {
        delete $scope.voteList[publicKey];
        if (!Object.size($scope.voteList)){
            $scope.close();
        }
    }

    $scope.vote = function (pass, withSecond) {
        if ($scope.secondPassphrase && !withSecond) {
            $scope.checkSecondPass = true;
            $scope.focus = 'secondPhrase';
            return;
        }
        pass = pass || $scope.secretPhrase;

        var data = {
            secret: pass,
            delegates: Object.keys($scope.voteList).map(function (key) {
                return ($scope.adding ? '+' : '-') + key;
            }),
            publicKey: userService.publicKey
        };

        if ($scope.secondPassphrase) {
            data.secondSecret = $scope.secondPhrase;
            if ($scope.rememberedPassword) {
                data.secret = $scope.rememberedPassword;
            }
        }

        $scope.voting = !$scope.voting;
        $http.put("/api/accounts/delegates", data).then(function (resp) {
            $scope.voting = !$scope.voting;
            if (resp.data.error) {
                $scope.fromServer = resp.data.error;
            }
            else {
                if ($scope.destroy) {
                    $scope.destroy();
                }
                voteModal.deactivate();
            }
        });
    }
}]);