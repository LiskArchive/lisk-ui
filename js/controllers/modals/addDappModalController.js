require('angular');

angular.module('liskApp').controller('addDappModalController', ["$scope", "$http", "addDappModal", "userService", "viewFactory", 'gettextCatalog', function ($scope, $http, addDappModal, userService, viewFactory, gettextCatalog) {

    $scope.view = viewFactory;
    $scope.view.loadingText = gettextCatalog.getString('Saving new dapp');
    $scope.secondPassphrase = userService.secondPassphrase;
    $scope.rememberedPassphrase = userService.rememberPassphrase ? userService.rememberedPassphrase : false;
    $scope.passmode = false;
    $scope.errorMessage = "";
    $scope.checkSecondPass = false;

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
        category: 0,
        type: 0,
        tags: "",
        git: "",
        icon: ""
    };

    $scope.sendData = function (pass, withSecond) {
        var data = {
            name: $scope.newDapp.name,
            description: $scope.newDapp.description,
            category: $scope.newDapp.category,
            type: $scope.newDapp.type,
            tags: $scope.newDapp.tags
        }

        if ($scope.newDapp.icon.trim() == '') {
        } else {
            data.icon = $scope.newDapp.icon.trim();
        }

        if ($scope.newDapp.git.trim() == '') {
        } else {
            data.git = $scope.newDapp.git.trim();
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
    $scope.goToStep4 = function () {
        $scope.errorMessage = "";
        $scope.step = 4;
        $scope.errorAppLink = false;
    }

    $scope.goToStep3 = function (invalid) {
        if ($scope.dapp_data_form.$valid) {
            $scope.dapp_data_form.submitted = false;
            $scope.step = 3;
        } else {
            $scope.dapp_data_form.submitted = true;
        }
    }

    $scope.goToStep5 = function () {
        $scope.errorAppLink = $scope.newDapp.git.trim() == '';
        if (!$scope.errorAppLink) {
            $scope.step = 5;
        }
    };

    $scope.goToStep2 = function () {
        $scope.step = 2;
    }

    $scope.step = 1;

    $scope.getRepositoryText = function () {
        return $scope.newDapp.git;
    }

    $scope.getRepositoryName = function () {
        return 'GitHub';
    }

    $scope.getRepositoryHeaderText = function () {
        return gettextCatalog.getString('Please set the GitHub repository link below.');
    }

    $scope.getRepositoryHelpText = function () {
        return gettextCatalog.getString('Please make sure you copy the complete repository link from GitHub. It ends in .git.');
    }

    $scope.selectRepository = function (name) {
        $scope.repository = name;
    }

}]);
