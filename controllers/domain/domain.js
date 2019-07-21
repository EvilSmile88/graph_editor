
const domains = [
  {
    name: 'abi',
    groups: ['exam', 'country']
  },
  {
    name: 'school',
    groups: ['party', 'country']
  }
];

// TODO: use valid data instead of mock;
function get(req, res, next) {
  setTimeout(() => {
    res.send(JSON.stringify(domains));
  }, 500)
}


module.exports = {
  get
};