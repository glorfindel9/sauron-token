const Sauron = artifacts.require("Sauron");
const TokenSale = artifacts.require("TokenSale");

contract("TokenSale", (accounts) => {
  let sauronInstance;
  let tokenSaleInstance;
  it("Create token and mint", async () => {
    sauronInstance = await Sauron.deployed({
      from: accounts[0],
    });
    tokenSaleInstance = await TokenSale.deployed(sauronInstance.address, {
      from: accounts[0],
    });
  });

  it("Allowance for TokenSale", async () => {
    await sauronInstance.increaseAllowance(sauronInstance.address, 10, {
      from: accounts[0],
    });
    assert.equal(
      await sauronInstance.allowance(accounts[0], sauronInstance.address),
      10,
      "Allowance failed"
    );
  });

  it("Create round", async () => {
    const startDate = Math.floor(Date.now() / 1000);
    const endDate = startDate + 10000;
    await tokenSaleInstance.createRound(3000, 100, 10, startDate, endDate, {
      from: accounts[0],
      gas: 3000000,
    });

    const round = await tokenSaleInstance.rounds(1);
    assert.equal(
      round.index,
      web3.utils.toBN("1"),
      "Round index should be is 1"
    );
  });

  it("Set round is active", async () => {
    await tokenSaleInstance.setRoundActive(1);
    const tokenActive = await tokenSaleInstance.activeRound();
    console.log(tokenActive);
    assert.equal(
      tokenActive.index,
      web3.utils.toBN("1"),
      "Round index should be is 1"
    );
  });
});
