const { expect } = require("chai");

describe("Notary", function () {
  let notary;

  beforeEach(async function () {
    const Notary = await ethers.getContractFactory("Notary");
    notary = await Notary.deploy();
    await notary.deployed();
  });

  it("should store a digest", async function () {
    const digest = "0x1234567890123456789012345678901234567890123456789012345678901234";
    await notary.store(digest);
    const [exists, timestamp, data] = await notary.isNotarized(digest);
    expect(exists).to.be.true;
    expect(timestamp.toNumber()).to.be.a("number");
    expect(data).to.equal("0x");
  });

  it("should not store a duplicate digest", async function () {
    const digest = "0x1234567890123456789012345678901234567890123456789012345678901234";
    await notary.store(digest);
    await expect(notary.store(digest)).to.be.revertedWith("Digest already notarized");
  });

  it("should return false for a non-existent digest", async function () {
    const digest = "0x1234567890123456789012345678901234567890123456789012345678901234";
    const [exists, timestamp, data] = await notary.isNotarized(digest);
    expect(exists).to.be.false;
    expect(timestamp.toNumber()).to.equal(0);
  });
});