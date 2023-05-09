// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Notary is Ownable {
    struct NotarizedDigest {
        uint256 timestamp;
        bytes data;
    }

    mapping(bytes32 => NotarizedDigest) private notarizedDigests;

    function store(bytes32 digest) public onlyOwner {
        require(notarizedDigests[digest].timestamp == 0, "Digest already notarized");
        notarizedDigests[digest] = NotarizedDigest(block.timestamp, "");
    }

    function storeWithData(bytes32 digest, bytes calldata metadata) external {
        require(notarizedDigests[digest].timestamp == 0, "Digest already notarized");
        notarizedDigests[digest] = NotarizedDigest(block.timestamp, metadata);
    }

    function isNotarized(bytes32 digest) public view returns (bool, uint256, bytes memory) {
        NotarizedDigest memory data = notarizedDigests[digest];
        if (data.timestamp == 0) {
            return (false, 0, "");
        } else {
            return (true, data.timestamp, data.data);
        }
    }
}
