//SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/access/Ownable.sol";

import "@ganache/console.log/console.sol";

abstract contract IERC20 {
    function transferFrom(
        address _from,
        address to,
        uint256 amount
    ) public virtual returns (bool);
}

contract TokenSale is Ownable {
    mapping(uint256 => Round) public rounds;
    IERC20 token;
    uint256 index;
    uint256 public activeRound;
    address tokenOwner;

    struct Round {
        uint256 index;
        uint256 tokenPriceInWei;
        uint256 quantityToken;
        uint256 quantityBuyer;
        uint256 startDate;
        uint256 endDate;
        uint256 quantitySold;
    }

    event PurchaseToken(
        address _to,
        uint256 _amount,
        uint256 _tokenPriceInWei,
        uint256 _timestamp
    );

    constructor(address _token) {
        token = IERC20(_token);
        tokenOwner = msg.sender;
    }

    function createRound(
        uint256 _tokenPriceInWei,
        uint256 _quantityToken,
        uint256 _quantityBuyer,
        uint256 _startDate,
        uint256 _endDate
    ) public onlyOwner {
        index++;
        Round memory round = Round({
            index: index,
            tokenPriceInWei: _tokenPriceInWei,
            quantityToken: _quantityToken,
            quantityBuyer: _quantityBuyer,
            startDate: _startDate,
            endDate: _endDate,
            quantitySold: 0
        });
        rounds[index] = round;
    }

    function setRoundActive(uint256 _index) public onlyOwner {
        require(rounds[_index].index > 0, "Round not exists");
        activeRound = _index;
    }

    function getQuantityTokenRemain() public view returns (uint256) {
        Round memory round = rounds[activeRound];
        return round.quantityToken - round.quantitySold;
    }

    function purchase() public payable {
        Round memory round = rounds[activeRound];
        uint256 current = uint256(block.timestamp);
        require(
            round.startDate <= current && round.endDate >= current,
            "Token not open for sale yet"
        );
        require(msg.value >= round.tokenPriceInWei, "Not enough money sent");
        uint256 tokensToTransfer = msg.value / round.tokenPriceInWei;
        uint256 remainder = msg.value -
            tokensToTransfer *
            round.tokenPriceInWei;
        token.transferFrom(tokenOwner, msg.sender, tokensToTransfer);
        payable(msg.sender).transfer(remainder);
        emit PurchaseToken(
            msg.sender,
            msg.value,
            round.tokenPriceInWei,
            block.timestamp
        );
        payable(this).transfer(tokensToTransfer * round.tokenPriceInWei);
    }

    fallback() external payable {
        payable(this).transfer(msg.value);
    }

    receive() external payable {
        payable(this).transfer(msg.value);
    }

    function withdrawMoney(address payable _to, uint256 _amount)
        public
        onlyOwner
    {
        uint256 balance = address(this).balance;
        require(_amount <= balance, "balance not enough");
        balance -= _amount;
        _to.transfer(_amount);
    }

    function withdrawAllMoney(address payable _to) public onlyOwner {
        _to.transfer(address(this).balance);
    }
}
