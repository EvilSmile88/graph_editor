const uuid = require('uuid/v1');

let domains = [
  {
    name: "abi",
    id: "90291",
    groups: [
      {
        name: "school",
        parentDomain: "abi",
        id: "10391",
        color: "#ffffff",
      },
      {
        name: "country",
        parentDomain: "abi",
        id: "10581",
        color: "#bf2c5c",
      },
    ],
  },
  {
    name: "school",
    id: "42271",
    groups: [
      {
        name: "party",
        parentDomain: "abi",
        id: "90818",
        color: "#47a0bf",
      },
      {
        name: "country",
        parentDomain: "abi",
        id: "90710",
        color: "#91bfbb",
      },
    ],
  },
  {
    name: "home",
    id: "47810",
    groups: [
    ],
  },
];

// TODO: use valid data instead of mock;
function get(req, res, next) {
  setTimeout(() => {
    res.send(JSON.stringify(domains));
  }, 500);
}

// TODO: use valid data instead of mock;
function addGroup(req, res, next) {
  const { body } = req;
  domains = domains.map(domain => {
    if (domain.id === body.domainId) {
      const newGroup = {
        parentDomain: domain.name,
        id: uuid(),
        ...req.body.group
      };
      domain.groups.push(newGroup);
      setTimeout(() => {
        res.send(JSON.stringify(domain));
      }, 1000);
    }
    return domain;
  })
}


module.exports = {
  get,
  addGroup
};