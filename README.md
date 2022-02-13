<h1 align="center">Welcome to jsonqr 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.1.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

## Install

```sh
yarn install
```

## Usage

```js
// const JsonQr = require('jsonqr').default;
import JsonQr from 'jsonqr';

const myParser = JsonQr(); // create a new instance

const node = {
  eyeColor: 'brown',
  name: 'Vega Cruz',
  gender: 'male',
  company: 'EYERIS',
  email: 'vegacruz@eyeris.com',
  phone: '+1 (811) 559-3552',
  address: '942 Vanderbilt Avenue, Babb, Federated States Of Micronesia, 3522',
  latitude: -7.494446,
  longitude: -95.514343,
  tags: ['laboris', 'ullamco', 'non', 'exercitation', 'et', 'anim', 'ex'],
  schools: [
    { name: 'Karacaoglan', id: '234556' },
    { name: 'Kurtoglu', id: '9638588' },
    { name: 'Yilangolu', id: '9638583538' },
  ],
};

const schema = `
    ShoolType{
        id;
    }
    @{
        eyeColor;
        name;
        phone;
        shools: SchoolType;
    }
`;

myParser.parse(node, schema).then(result=>{
  console.log(result);
})
```

result

```json
{
  "eyeColor": "brown",
  "name": "Vega Cruz",
  "phone": "+1 (811) 559-3552",
  "schools": [{ "id": "234556" }, { "id": "9638588" }, { "id": "9638583538" }]
}
```
### Register Helper
```js
myParser.registerHelper('slice', ({ node, args, next }) => {
  try {
    if (Array.isArray(node)) {
      return next(node.slice(parseInt(args[0]), parseInt(args[1])));
    }
  } catch (error) {}
  return next(node);
});

const node = {
  eyeColor: 'brown',
  name: 'Vega Cruz',
  gender: 'male',
  company: 'EYERIS',
  email: 'vegacruz@eyeris.com',
  phone: '+1 (811) 559-3552',
  address: '942 Vanderbilt Avenue, Babb, Federated States Of Micronesia, 3522',
  latitude: -7.494446,
  longitude: -95.514343,
  tags: ['laboris', 'ullamco', 'non', 'exercitation', 'et', 'anim', 'ex'],
  schools: [
    { name: 'Karacaoglan', id: '234556' },
    { name: 'Kurtoglu', id: '9638588' },
    { name: 'Yilangolu', id: '9638583538' },
  ],
};

const schema = `
    @{
        name;
        tags:  @slice(2,4);
    }
`;

myParser.parse(node, schema).then(result=>{
  console.log(result);
})
```

result

```json
{
    "name": "Vega Cruz",
    "tags": ["non", "exercitation"]
}
```

## Run tests

```sh
yarn run test
```

## Author

[👤 **yasintz**]('https://github.com/yasintz')

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
