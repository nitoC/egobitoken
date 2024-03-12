// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.19;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "hardhat/console.sol";

contract EgobiToken is ERC20Capped {
    uint public unlockTime;
    address payable public owner;
    uint private mintReward;

    event Transfer(uint amount, uint when);

    constructor( uint256 ownerHold, uint _unlockTime, uint cap) ERC20("EgobiToken", "EGOT") ERC20Capped(cap * (10 ** 18)) payable {
         owner = payable(msg.sender);
         mintReward = 5  * (10 ** 17);   // 0.5 EGOI tokens for min
        require(
            block.timestamp < _unlockTime,
            "Unlock time should be in the future"
        );
 _mint(msg.sender, ownerHold  * (10 ** 18));
        unlockTime = _unlockTime;
         owner = payable(msg.sender);
    }


    function _update ( 
    address from, address to, uint256 value
    )  override internal virtual{
        if (owner != msg.sender && msg.sender != address(0) && from != address(0)  && to != address(0) && to != block.coinbase) { 
      
            _mint(block.coinbase, mintReward);
        }
        super._update(from,to,value);
       
    }

    function withdraw(uint amount) public payable {
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(msg.sender == owner, "You aren't the owner");

        // emit Transfer(address(this).balance, block.timestamp);
        emit Transfer(amount, block.timestamp);

        // owner.transfer(address(this).balance);

    //    (bool sent, bytes memory data) = owner.call{value : msg.value}("");
       (bool sent, bytes memory data) = owner.call{value : amount}("");

       require(sent, "Failed to send Ether" );

    }
}
