const Sauron = artifacts.require("Sauron");
const TokenSale = artifacts.require("TokenSale");

contract("Sauron", (accounts) => {
  it("should create and mint SauronToken", async () => {
    const sauronInstance = await Sauron.deployed();
    await sauronInstance.increaseAllowance(accounts[1], 1000);
    assert.equal(
      await sauronInstance.allowance(accounts[0], accounts[1]),
      1000,
      "Allowance failed"
    );
  });
});

contract("TokenSale", (accounts) => {
  it("Create round", async () => {
    const sauronInstance = await Sauron.deployed();
    await sauronInstance.increaseAllowance(accounts[1], 1000);
    assert.equal(
      await sauronInstance.allowance(accounts[0], accounts[1]),
      1000,
      "Allowance failed"
    );

    const tokenSale = await TokenSale.deployed(sauronInstance.address, {
      from: accounts[1],
    });

    await tokenSale.createRound(3000, 100, 10, 1671033560, 1671133560, {
      from: accounts[1],
      gas: 3000000,
    });

    const roundCreated = await tokenSale.rounds(1);
    console.log(roundCreated.index);
    console.log(web3.utils.toBN("1"));
    assert.equal(
      roundCreated.index,
      web3.utils.toBN("1"),
      "Round should be created with index = 1"
    );
  });
});
