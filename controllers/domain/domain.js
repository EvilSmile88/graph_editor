const domains = [
  {
    name: "abi",
    id: "90291",
    groups: [
      {
        name: "school",
        parentDomain: "abi",
        id: "10391",
        color: "#bf892a",
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


module.exports = {
  get,
};