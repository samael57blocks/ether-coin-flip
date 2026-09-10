// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {EtherCoinFlip} from "../src/EtherCoinFlip.sol";

contract CoinFlipTest is Test {
    EtherCoinFlip public coinFlip;

    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");
    address public charlie = makeAddr("charlie");

    function setUp() public {
        coinFlip = new EtherCoinFlip();
    }

    // ─── newCoinFlip Tests ────────────────────────────────────────────

    function test_newCoinFlip_success() public {
        vm.deal(alice, 1 ether);
        vm.prank(alice);

        uint256 coinFlipId = coinFlip.newCoinFlip{value: 0.01 ether}();

        assertEq(coinFlipId, 0, "First coin flip ID should be 0");

        (
            uint256 id,
            address betStarter,
            uint256 startingWager,
            ,
            ,
            ,
            ,
            ,
            bool isActive
        ) = coinFlip.EtherCoinFlipStructs(0);
        assertEq(id, 0);
        assertEq(betStarter, alice);
        assertEq(startingWager, 0.01 ether);
        assertTrue(isActive, "Coin flip should be active");
        assertEq(address(coinFlip).balance, 0.01 ether);
    }

    function test_newCoinFlip_multiple() public {
        vm.deal(alice, 1 ether);
        vm.deal(bob, 1 ether);

        vm.prank(alice);
        uint256 id0 = coinFlip.newCoinFlip{value: 0.01 ether}();

        vm.prank(bob);
        uint256 id1 = coinFlip.newCoinFlip{value: 0.05 ether}();

        assertEq(id0, 0);
        assertEq(id1, 1);
        assertEq(coinFlip.coinFlipCount(), 2);
    }

    function test_newCoinFlip_reverts_zero_wager() public {
        vm.deal(alice, 1 ether);
        vm.prank(alice);

        vm.expectRevert("Wager must be greater than 0");
        coinFlip.newCoinFlip{value: 0}();
    }

    // ─── endCoinFlip Tests ────────────────────────────────────────────

    function test_endCoinFlip_success() public {
        // Setup
        vm.deal(alice, 1 ether);
        vm.deal(bob, 1 ether);

        // Alice starts a coin flip
        vm.prank(alice);
        uint256 coinFlipId = coinFlip.newCoinFlip{value: 0.01 ether}();

        // Bob ends it with matching wager
        vm.prank(bob);
        coinFlip.endCoinFlip{value: 0.01 ether}(coinFlipId);

        // Coin flip should be resolved
        (
            ,
            ,
            ,
            address betEnder,
            uint256 endingWager,
            uint256 etherTotal,
            address winner,
            address loser,
            bool isActive
        ) = coinFlip.EtherCoinFlipStructs(coinFlipId);
        assertFalse(isActive, "Coin flip should be inactive after resolution");
        assertEq(betEnder, bob);
        assertEq(endingWager, 0.01 ether);
        assertEq(etherTotal, 0.02 ether);

        // Winner and loser are valid
        bool aliceWon = winner == alice;
        bool bobWon = winner == bob;
        assertTrue(aliceWon || bobWon, "Either alice or bob should be winner");
        assertTrue(loser != winner, "Winner and loser should be different");

        // Verify funds distributed correctly:
        // Total system ETH should be conserved (2 ether started, 2 ether after)
        assertEq(alice.balance + bob.balance, 2 ether, "Total ETH conserved");
        // Winner gets the full pot (their wager back + opponent's wager)
        if (aliceWon) {
            assertEq(alice.balance, 1.01 ether, "Winner gets pot");
            assertEq(bob.balance, 0.99 ether, "Loser keeps remainder");
        } else {
            assertEq(bob.balance, 1.01 ether, "Winner gets pot");
            assertEq(alice.balance, 0.99 ether, "Loser keeps remainder");
        }
        // Contract should be empty
        assertEq(address(coinFlip).balance, 0);
    }

    // ─── Access Control Tests ─────────────────────────────────────────

    function test_endCoinFlip_revert_self_bet() public {
        vm.deal(alice, 1 ether);
        vm.prank(alice);
        uint256 coinFlipId = coinFlip.newCoinFlip{value: 0.01 ether}();

        vm.prank(alice);
        vm.expectRevert("Cannot bet against yourself");
        coinFlip.endCoinFlip{value: 0.01 ether}(coinFlipId);
    }

    function test_endCoinFlip_revert_not_active() public {
        vm.deal(alice, 1 ether);
        vm.deal(bob, 1 ether);

        vm.prank(alice);
        uint256 coinFlipId = coinFlip.newCoinFlip{value: 0.01 ether}();

        vm.prank(bob);
        coinFlip.endCoinFlip{value: 0.01 ether}(coinFlipId);

        // Try to end the same coin flip again
        vm.deal(charlie, 1 ether);
        vm.prank(charlie);
        vm.expectRevert("Coin flip is not active");
        coinFlip.endCoinFlip{value: 0.01 ether}(coinFlipId);
    }

    function test_endCoinFlip_revert_wrong_wager() public {
        vm.deal(alice, 1 ether);
        vm.prank(alice);
        uint256 coinFlipId = coinFlip.newCoinFlip{value: 0.01 ether}();

        vm.deal(bob, 1 ether);
        vm.prank(bob);
        vm.expectRevert("Wager must match the starting wager");
        coinFlip.endCoinFlip{value: 0.005 ether}(coinFlipId);
    }

    function test_endCoinFlip_revert_excess_wager() public {
        vm.deal(alice, 1 ether);
        vm.prank(alice);
        uint256 coinFlipId = coinFlip.newCoinFlip{value: 0.01 ether}();

        vm.deal(bob, 1 ether);
        vm.prank(bob);
        vm.expectRevert("Wager must match the starting wager");
        coinFlip.endCoinFlip{value: 0.02 ether}(coinFlipId);
    }

    function test_endCoinFlip_revert_zero_wager() public {
        vm.deal(alice, 1 ether);
        vm.prank(alice);
        uint256 coinFlipId = coinFlip.newCoinFlip{value: 0.01 ether}();

        vm.deal(bob, 1 ether);
        vm.prank(bob);
        vm.expectRevert("Wager must be greater than 0");
        coinFlip.endCoinFlip{value: 0}(coinFlipId);
    }

    // ─── Wager Math Tests ─────────────────────────────────────────────

    function test_wager_math_large_amount() public {
        vm.deal(alice, 10 ether);
        vm.deal(bob, 10 ether);

        vm.prank(alice);
        uint256 coinFlipId = coinFlip.newCoinFlip{value: 1 ether}();

        vm.prank(bob);
        coinFlip.endCoinFlip{value: 1 ether}(coinFlipId);

        (, , , , , uint256 etherTotal, , , ) = coinFlip.EtherCoinFlipStructs(coinFlipId);
        assertEq(etherTotal, 2 ether);
        assertEq(address(coinFlip).balance, 0, "Contract should be empty after resolution");
    }

    function test_getActiveCoinFlips() public {
        vm.deal(alice, 1 ether);
        vm.deal(bob, 1 ether);

        // Initially empty
        EtherCoinFlip.EtherCoinFlipStruct[] memory active0 = coinFlip.getActiveCoinFlips();
        assertEq(active0.length, 0);

        // Create one
        vm.prank(alice);
        coinFlip.newCoinFlip{value: 0.01 ether}();

        EtherCoinFlip.EtherCoinFlipStruct[] memory active1 = coinFlip.getActiveCoinFlips();
        assertEq(active1.length, 1);
        assertEq(active1[0].ID, 0);

        // Create another
        vm.prank(bob);
        coinFlip.newCoinFlip{value: 0.05 ether}();

        EtherCoinFlip.EtherCoinFlipStruct[] memory active2 = coinFlip.getActiveCoinFlips();
        assertEq(active2.length, 2);

        // End one
        vm.prank(alice);
        coinFlip.endCoinFlip{value: 0.05 ether}(1);

        EtherCoinFlip.EtherCoinFlipStruct[] memory active3 = coinFlip.getActiveCoinFlips();
        assertEq(active3.length, 1);
        assertEq(active3[0].ID, 0);
    }

    // ─── Edge Cases ───────────────────────────────────────────────────

    function test_coinFlipCount_increments() public {
        vm.deal(alice, 1 ether);

        assertEq(coinFlip.coinFlipCount(), 0);

        vm.prank(alice);
        coinFlip.newCoinFlip{value: 0.01 ether}();
        assertEq(coinFlip.coinFlipCount(), 1);

        vm.prank(alice);
        coinFlip.newCoinFlip{value: 0.02 ether}();
        assertEq(coinFlip.coinFlipCount(), 2);
    }

    function test_contract_balance_after_full_cycle() public {
        vm.deal(alice, 1 ether);
        vm.deal(bob, 1 ether);

        assertEq(address(coinFlip).balance, 0);

        vm.prank(alice);
        coinFlip.newCoinFlip{value: 0.1 ether}();
        assertEq(address(coinFlip).balance, 0.1 ether);

        vm.prank(bob);
        coinFlip.endCoinFlip{value: 0.1 ether}(0);
        assertEq(address(coinFlip).balance, 0, "Contract should be empty");
    }
}
