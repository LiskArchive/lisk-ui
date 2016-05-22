require('angular');

angular.module('liskApp').controller('addDappModalController', ["$scope", "$http", "addDappModal", "userService", "viewFactory", 'gettextCatalog', function ($scope, $http, addDappModal, userService, viewFactory, gettextCatalog) {

    $scope.view = viewFactory;
    $scope.view.loadingText = gettextCatalog.getString('Saving new application');
    $scope.secondPassphrase = userService.secondPassphrase;
    $scope.rememberedPassphrase = userService.rememberPassphrase ? userService.rememberedPassphrase : false;
    $scope.passmode = false;
    $scope.errorMessage = "";
    $scope.checkSecondPass = false;
    $scope.fee = 50000000000;

    $scope.close = function () {
        addDappModal.deactivate();
    }

    $scope.passcheck = function (fromSecondPass) {
        $scope.errorMessage = "";
        if (fromSecondPass) {
            $scope.checkSecondPass = false;
            $scope.passmode = $scope.rememberedPassphrase ? false : true;
            $scope.secondPhrase = '';
            $scope.secretPhrase = '';
            return;
        }
        if ($scope.rememberedPassphrase) {
            $scope.sendData($scope.rememberedPassphrase);
        } else {
            $scope.passmode = !$scope.passmode;
            if ($scope.passmode) {
                $scope.focus = 'secretPhrase';
            }
            $scope.secretPhrase = '';
        }
    }

    $scope.newDapp = {
        name: "",
        description: "",
        category: 4, // Miscellaneous
        type: 0,
        tags: "",
        link: "",
        icon: ""
    };

    $scope.sendData = function (pass, withSecond) {
        var data = {
            name: $scope.newDapp.name,
            description: $scope.newDapp.description,
            category: $scope.newDapp.category,
            type: $scope.newDapp.type,
            tags: $scope.newDapp.tags,
        }

        if ($scope.newDapp.icon.trim() != '') {
            data.icon = $scope.newDapp.icon.trim();
        }

        if ($scope.newDapp.link.trim() != '') {
            data.link = $scope.newDapp.link.trim();
        }

        $scope.errorMessage = "";
        if ($scope.secondPassphrase && !withSecond) {
            $scope.checkSecondPass = true;
            $scope.focus = 'secondPhrase';
            return;
        }
        pass = pass || $scope.secretPhrase;

        $scope.view.inLoading = true;

        data.secret = pass;
        data.category = $scope.newDapp.category || 0;

        if ($scope.secondPassphrase) {
            data.secondSecret = $scope.secondPhrase;
            if ($scope.rememberedPassphrase) {
                data.secret = $scope.rememberedPassphrase;
            }
        }

        $http.put('/api/dapps', data).then(function (response) {
            $scope.view.inLoading = false;
            if (response.data.error) {
                $scope.errorMessage = response.data.error;
            } else {
                if ($scope.destroy) {
                    $scope.destroy();
                }
                addDappModal.deactivate();
            }
        });
    }

    $scope.step = 1;
    $scope.form = { dapp_data: {}, storage_data: {} };

    $scope.goToStep2 = function () {
        $scope.step = 2;
    }

    $scope.goToStep3 = function () {
        if ($scope.form.dapp_data.$invalid) {
            $scope.form.dapp_data.submitted = true;
            $scope.step = 2;
        } else {
            $scope.step = 3;
            $scope.form.dapp_data.submitted = false;
        }
    }

    $scope.goToStep4 = function () {
        if ($scope.form.storage_data.$invalid) {
            $scope.form.storage_data.submitted = true;
            $scope.step = 3;
        } else {
            $scope.step = 4;
            $scope.form.storage_data.submitted = false;
        }
    }

}]);
