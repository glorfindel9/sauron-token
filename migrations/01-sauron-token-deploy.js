const Sauron = artifacts.require("Sauron");
const TokenSale = artifacts.require("TokenSale");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(Sauron).then(function () {
    return deployer.deploy(TokenSale, Sauron.address, { from: accounts[1] });
  });
};
