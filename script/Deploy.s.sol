// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {EtherCoinFlip} from "../src/EtherCoinFlip.sol";

contract DeployCoinFlip is Script {
    function run() public returns (EtherCoinFlip) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);
        EtherCoinFlip coinFlip = new EtherCoinFlip();
        vm.stopBroadcast();

        return coinFlip;
    }
}
