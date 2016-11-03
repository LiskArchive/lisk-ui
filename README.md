# Lisk UI

Lisk is a next generation crypto-currency and blockchain application platform, written entirely in JavaScript. For more information please refer to our website: https://lisk.io/.

This repository contains the [AngularJS](https://angularjs.org/) based user-interface submodule of the Lisk client.

## Installation

Install frontend dependencies (will run the `bower install` after the npm instalation):

```
npm install
```

Install bower components (optional and already happening in `npm install`):

```
npm run bower-install
```

Build the user-interface:

```
npm run grunt-release
```

You can set the following cookies (e.g. using [EditThisCookies](http://www.editthiscookie.com/)) for more comfortable local development:
- `passphrase` - passphrase to sign you in  
- `goto` - name of state to go to. See [possible state names](https://github.com/LiskHQ/lisk-ui/blob/development/js/app.js#L25-L100).


## Authors

- Vera Nekrasova <vera.limita@gmail.com>
- Boris Povod <boris@crypti.me>
- Oliver Beddows <oliver@lisk.io>
- Max Kordek <max@lisk.io>

## License

The MIT License (MIT)  

Copyright (c) 2016 Lisk  
Copyright (c) 2014-2015 Crypti  

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:  

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
