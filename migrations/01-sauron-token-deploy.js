const Sauron = artifacts.require("Sauron");
const TokenSale = artifacts.require("TokenSale");

module.exports = function (deployer) {
  deployer.deploy(Sauron).then(function () {
    return deployer.deploy(TokenSale, Sauron.address);
  });
};
