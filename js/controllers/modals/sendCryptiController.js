require('angular');

angular.module('webApp').controller('sendCryptiController', ["$scope", "sendCryptiModal", "$http", "userService", "$timeout", "$filter",
    function ($scope, sendCryptiModal, $http, userService, $timeout, $filter) {
    $scope.sending = false;
    $scope.passmode = false;
    $scope.accountValid = true;
    $scope.errorMessage = "";
    $scope.checkSecondPass = false;
    $scope.onlyNumbers = /^-?\d*(\.\d+)?$/;
    $scope.secondPassphrase = userService.secondPassphrase;
    $scope.address = userService.address;
    $scope.focus = $scope.to ? 'amount' : 'to';
    $scope.presendError = false;

    $scope.submit = function () {
        console.log('submited');
    };

    $scope.rememberedPassword = userService.rememberPassword ? userService.rememberedPassword : false;

    Number.prototype.roundTo = function (digitsCount) {
        var digitsCount = typeof digitsCount !== 'undefined' ? digitsCount : 2;
        var s = String(this);
        if (s.indexOf('e') < 0) {
            var e = s.indexOf('.');
            if (e == -1) return this;
            var c = s.length - e - 1;
            if (c < digitsCount) digitsCount = c;
            var e1 = e + 1 + digitsCount;
            var d = Number(s.substr(0, e) + s.substr(e + 1, digitsCount));
            if (s[e1] > 4) d += 1;
            d /= Math.pow(10, digitsCount);
            return d.valueOf();
        } else {
            return this.toFixed(digitsCount);
        }
    }

    Math.roundTo = function (number, digitsCount) {
        number = Number(number);
        return number.roundTo(digitsCount).valueOf();
    }

    $scope.passcheck = function (fromSecondPass) {
        if (fromSecondPass) {
            $scope.checkSecondPass = false;
            $scope.passmode = $scope.rememberedPassword ? false : true;
            if ($scope.passmode) {
                $scope.focus = 'secretPhrase';
            }
            $scope.secondPhrase = '';
            $scope.secretPhrase = '';
            return;
        }
        if ($scope.rememberedPassword) {
            var isAddress = /^[0-9]+[C|c]$/g;
            var allowSymbols = /^[a-z0-9!@$&_.]+$/g;
            var correctAddress = isAddress.test($scope.to);
            if ($scope.to.trim() == '') {
                $scope.errorMessage = 'Empty recipient'
                $scope.presendError = true;
            } else {
                if (correctAddress || allowSymbols.test($scope.to.toLowerCase())) {
                    if ($scope.isCorrectValue($scope.amount)) {
                      if (correctAddress) {
                          $scope.presendError = false;
                          $scope.errorMessage = ''
                          $scope.sendXCR($scope.rememberedPassword);
                      }
                        else{
                        $http.get("/api/accounts/username/get?username=" + encodeURIComponent($scope.to)).then(function (response) {
                            if (response.data.success || correctAddress) {
                                $scope.presendError = false;
                                $scope.errorMessage = ''
                                $scope.sendXCR($scope.rememberedPassword);
                            }
                            else {
                                $scope.errorMessage = response.data.error;
                                $scope.presendError = true;
                            }
                        });}

                    }
                    else {
                        $scope.presendError = true;
                    }
                }
                else {
                    $scope.errorMessage = 'Incorrect recipient name or address'
                    $scope.presendError = true;
                }
            }


        }
        else {


            var isAddress = /^[0-9]+[C|c]$/g;
            var allowSymbols = /^[a-z0-9!@$&_.]+$/g;
            var correctAddress = isAddress.test($scope.to);
            if ($scope.to.trim() == '') {
                $scope.errorMessage = 'Empty recipient'
                $scope.presendError = true;
            } else {
                if (correctAddress || allowSymbols.test($scope.to.toLowerCase())) {
                    if ($scope.isCorrectValue($scope.amount)) {
                        if (correctAddress){
                            $scope.presendError = false;
                            $scope.errorMessage = ''
                            $scope.passmode = !$scope.passmode;
                            $scope.focus = 'secretPhrase';
                            $scope.secretPhrase = '';
                        }
                        else {
                        $http.get("/api/accounts/username/get?username=" + $scope.to).then(function (response) {
                            if (response.data.success || correctAddress) {
                                $scope.presendError = false;
                                $scope.errorMessage = ''
                                $scope.passmode = !$scope.passmode;
                                $scope.focus = 'secretPhrase';
                                $scope.secretPhrase = '';
                            }
                            else {
                                $scope.errorMessage = response.data.error;
                                $scope.presendError = true;
                            }
                        });}

                    }
                    else {
                        $scope.presendError = true;
                    }
                }
                else {
                    $scope.errorMessage = 'Incorrect recipient name or address'
                    $scope.presendError = true;
                }
            }
        }
    }

    $scope.close = function () {
        if ($scope.destroy) {
            $scope.destroy();
        }
        sendCryptiModal.deactivate();
    }


    $scope.moreThanEightDigits = function (number) {
        if (number.indexOf(".") < 0) {
            return false;
        }
        else {
            if (number.split('.')[1].length > 8) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    $scope.recalculateFee = function ($event) {
        if (!$scope.amount || isNaN(parseFloat($scope.amount))) {
            $scope.fee = "";
        } else {
            if ($scope.amount.indexOf('.') >= 0) {
                var strs = $scope.amount.split('.');
                $scope.maxlength = strs[0].length + 9;
            }
            // calculate fee.


            var fee = parseInt($scope.amount * 100000000 / 100 * $scope.currentFee) / 100000000;
            //($scope.amount / 100 * $scope.currentFee).roundTo(8);

            if ($scope.amount == 0) {
                fee = 0;
            } else if (parseFloat(fee) == 0) {
                fee = "0.00000001";
                $scope.fee = fee;
            } else {
                $scope.fee = fee.toFixed(8);
            }
        }

        /*
         if (!$scope.amount) {
         $scope.fee = "";
         return;
         }

         if($scope.moreThanEightDigits(parseFloat($scope.amount))){
         console.log('fee');
         $scope.amount = parseFloat($scope.amount).roundTo(8).toString();
         console.log($scope.amount);
         }
         if($scope.currentFee){
         var fee = $scope.amount * $scope.currentFee * 0.01;
         }


         $scope.fee = fee.roundTo(8);
         */
    }


    $scope.accountChanged = function (e) {
        var string = $scope.to;

        if (!string) {
            return;
        }


        if (string[string.length - 1] == "C") {
            var isnum = /^\d+$/.test(string.substring(0, string.length - 1));
            if (isnum && string.length - 1 >= 1 && string.length - 1 <= 20) {
                $scope.accountValid = true;
            }
            else {
                $scope.accountValid = false;
            }
        }
        else {
            $scope.accountValid = false;
        }
    }

    $scope.moreThanEightDigits = function (number) {
        if (number.toString().indexOf(".") < 0) {
            return false;
        }
        else {
            if (number.toString().split('.')[1].length > 8) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    $scope.getCurrentFee = function () {
        $http.get("/api/blocks/getFee")
            .then(function (resp) {
                $scope.currentFee = resp.data.fee;
            });
    }



    $scope.convertXCR = function (currency) {
        currency = String(currency);

        var parts = currency.split(".");

        var amount = parts[0];

        //no fractional part
        if (parts.length == 1) {
            var fraction = "00000000";
        } else if (parts.length == 2) {
            if (parts[1].length <= 8) {
                var fraction = parts[1];
            } else {
                var fraction = parts[1].substring(0, 8);
            }
        } else {
            $scope.errorMessage = "Wrong XCR value";
            throw "Invalid input";
        }

        for (var i = fraction.length; i < 8; i++) {
            fraction += "0";
        }

        var result = amount + "" + fraction;

        //in case there's a comma or something else in there.. at this point there should only be numbers
        if (!/^\d+$/.test(result)) {
            $scope.errorMessage = "Wrong XCR value";
            throw "Invalid input.";
        }

        //remove leading zeroes
        result = result.replace(/^0+/, "");

        if (result === "") {
            result = "0";
        }

        return parseInt(result);
    }

    $scope.isCorrectValue = function(currency){
        currency = String(currency);

        var parts = currency.split(".");

        var amount = parts[0];

        //no fractional part
        if (parts.length == 1) {
            var fraction = "00000000";
        } else if (parts.length == 2) {
            if (parts[1].length <= 8) {
                var fraction = parts[1];
            } else {
                var fraction = parts[1].substring(0, 8);
            }
        } else {
            $scope.errorMessage = "Wrong XCR value";
            return false;
        }

        for (var i = fraction.length; i < 8; i++) {
            fraction += "0";
        }

        var result = amount + "" + fraction;

        //in case there's a comma or something else in there.. at this point there should only be numbers
        if (!/^\d+$/.test(result)) {
            $scope.errorMessage = "Wrong XCR value";
         return false;
        }

        return true;
    }

    $scope.clearRecipient = function () {
        $scope.to = '';
    }

    $scope.sendXCR = function (secretPhrase, withSecond) {
        if ($scope.secondPassphrase && !withSecond) {
            $scope.checkSecondPass = true;
            $scope.focus = 'secondPhrase';
            return;
        }
        $scope.errorMessage = "";
        if (($scope.amount + '').indexOf('.') != -1) {
            $scope.lengthError = $scope.amount.split('.')[1].length > 8;
            $scope.errorMessage = $scope.lengthError ? "More than 8 numbers in decimal part" : '';
        }

        if ($scope.lengthError) {
            return;
        }

        /*$scope.amountError = $scope.convertXCR($scope.fee) + $scope.convertXCR($scope.amount) > userService._unconfirmedBalance;
         $scope.errorMessage = $scope.amountError ? "Not enough XCR" : "";*/

        var data = {
            secret: secretPhrase,
            amount: $scope.convertXCR($scope.amount),
            recipientId: $scope.to,
            publicKey: userService.publicKey
        };

        if ($scope.secondPassphrase) {
            data.secondSecret = $scope.secondPhrase;
            if ($scope.rememberedPassword) {
                data.secret = $scope.rememberedPassword;
            }
        }

        if (!$scope.lengthError && !$scope.sending) {
            $scope.sending = true;
            $http.put("/api/transactions", data).then(function (resp) {
                $scope.sending = false;
                if (resp.data.error) {
                    $scope.errorMessage = resp.data.error;
                }
                else {
                    if ($scope.destroy) {
                        $scope.destroy();
                    }
                    sendCryptiModal.deactivate();
                }
            });

        }
    }
    $scope.getCurrentFee();
}]);