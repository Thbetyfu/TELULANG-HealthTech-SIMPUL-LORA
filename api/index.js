const appModule = require('../SIMPUL/BE/dist/app');
const app = appModule.default || appModule;

module.exports = (req, res) => {
  return app(req, res);
};
