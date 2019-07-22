const domains = [
  {
    name: "abi",
    id: "90291",
    groups: [
      {
        name: "exam",
        parentDomain: "abi",
        id: "10391",
      },
      {
        name: "country",
        parentDomain: "abi",
        id: "10581",
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
      },
      {
        name: "country",
        parentDomain: "abi",
        id: "90710",
      },
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