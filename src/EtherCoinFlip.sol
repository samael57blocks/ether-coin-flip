// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

contract EtherCoinFlip {
    struct EtherCoinFlipStruct {
        uint256 ID;
        address payable betStarter;
        uint256 startingWager;
        address payable betEnder;
        uint256 endingWager;
        uint256 etherTotal;
        address payable winner;
        address payable loser;
        bool isActive;
    }

    mapping(uint256 => EtherCoinFlipStruct) public EtherCoinFlipStructs;
    uint256 public coinFlipCount;

    event StartedCoinFlip(
        uint256 indexed theCoinFlipID,
        address indexed theBetStarter,
        uint256 theStartingWager,
        bool isActive
    );

    event FinishedCoinFlip(
        uint256 indexed theCoinFlipID,
        address indexed winner,
        address indexed loser,
        bool isActive
    );

    modifier validWager() {
        require(msg.value > 0, "Wager must be greater than 0");
        _;
    }

    function newCoinFlip() public payable validWager returns (uint256 coinFlipID) {
        coinFlipID = coinFlipCount;

        EtherCoinFlipStructs[coinFlipID] = EtherCoinFlipStruct({
            ID: coinFlipID,
            betStarter: payable(msg.sender),
            startingWager: msg.value,
            betEnder: payable(address(0)),
            endingWager: 0,
            etherTotal: msg.value,
            winner: payable(address(0)),
            loser: payable(address(0)),
            isActive: true
        });

        coinFlipCount++;

        emit StartedCoinFlip(coinFlipID, msg.sender, msg.value, true);
    }

    function endCoinFlip(uint256 coinFlipID) public payable validWager {
        EtherCoinFlipStruct storage coinFlip = EtherCoinFlipStructs[coinFlipID];

        require(coinFlip.isActive, "Coin flip is not active");
        require(coinFlip.betStarter != msg.sender, "Cannot bet against yourself");
        require(
            coinFlip.startingWager == msg.value,
            "Wager must match the starting wager"
        );

        coinFlip.betEnder = payable(msg.sender);
        coinFlip.endingWager = msg.value;
        coinFlip.etherTotal = coinFlip.startingWager + coinFlip.endingWager;

        // Pseudo-random winner selection (block hash + coin flip ID)
        bool starterWins = uint256(keccak256(abi.encodePacked(blockhash(block.number - 1), coinFlipID))) % 2 == 0;

        if (starterWins) {
            coinFlip.winner = coinFlip.betStarter;
            coinFlip.loser = coinFlip.betEnder;
        } else {
            coinFlip.winner = coinFlip.betEnder;
            coinFlip.loser = coinFlip.betStarter;
        }

        coinFlip.isActive = false;

        emit FinishedCoinFlip(coinFlipID, coinFlip.winner, coinFlip.loser, false);

        // Transfer winnings to winner
        (bool sent,) = coinFlip.winner.call{value: coinFlip.etherTotal}("");
        require(sent, "Failed to send Ether to winner");
    }

    function getActiveCoinFlips() public view returns (EtherCoinFlipStruct[] memory) {
        uint256 activeCount = 0;

        for (uint256 i = 0; i < coinFlipCount; i++) {
            if (EtherCoinFlipStructs[i].isActive) {
                activeCount++;
            }
        }

        EtherCoinFlipStruct[] memory activeFlips = new EtherCoinFlipStruct[](activeCount);
        uint256 index = 0;

        for (uint256 i = 0; i < coinFlipCount; i++) {
            if (EtherCoinFlipStructs[i].isActive) {
                activeFlips[index] = EtherCoinFlipStructs[i];
                index++;
            }
        }

        return activeFlips;
    }
}
