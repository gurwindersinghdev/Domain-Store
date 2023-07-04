// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract Domain is ERC721 {
    uint256 public totalSupply;
    uint256 public maxSupply;
    address public owner;

   struct DomainNames {
    string name;
    uint256 cost;
    bool isOwned;
   }

   mapping(uint256 => DomainNames) domains;

   modifier onlyOwner() {
     require(msg.sender == owner,"must be a owner");
_;
   }


   constructor(string memory _name, string memory _symbol)
   ERC721(_name, _symbol)
{
    owner = msg.sender;

}

function list(string memory _name, uint256 _cost) external onlyOwner {
   
    maxSupply++;
   domains[maxSupply] =  DomainNames(_name, _cost, false);


}

function mint(uint256 _id) payable external {
    require(_id != 0);
    require(_id <= maxSupply);
    require(domains[_id].isOwned == false);
    require(msg.value >= domains[_id].cost);

     domains[_id].isOwned = true;

     totalSupply++;
    _safeMint(msg.sender, _id);
   

}

function getDomain(uint256 _id) public view returns (DomainNames memory) {
    return domains[_id];
}

function getBalance() public view returns(uint256) {
    return address(this).balance;
}

function withdraw() public onlyOwner {
    (bool success,) = owner.call{value: address(this).balance}("");
    require(success);
}

}
