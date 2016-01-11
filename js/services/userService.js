require('angular');

angular.module('webApp').service('userService', function () {
    this.rememberPassword = false;
    this.rememberedPassword = '';

    this.setData = function (address, publicKey, balance, unconfirmedBalance, effectiveBalance) {
		this.address = address;
		this.publicKey = publicKey;
		this.balance = balance / 100000000;
		this.unconfirmedBalance = unconfirmedBalance / 100000000;
		this.effectiveBalance = effectiveBalance / 100000000;
		this._balance = balance;
		this._unconfirmedBalance = unconfirmedBalance;
	}

    this.setSessionPassword = function(pass){
        this.rememberPassword = true;
        this.rememberedPassword = pass;
    }

	this.setForging = function (forging) {
		this.forging = forging;
	}

	this.setMultisignature = function (multisignature,cb) {
		this.multisignature = multisignature;
		cb(multisignature);
	}

	this.setDelegate = function (delegate) {
		this.delegate = delegate;
	}

    this.setDelegateTime = function(transactions){
        this.delegate.time = transactions[0].timestamp;
    }

	this.setDelegateProcess = function (delegate) {
		this.delegateInRegistration = delegate;
	}

	this.setSecondPassphrase = function (secondPassPhrase) {
		this.secondPassphrase = secondPassPhrase;
	}
});