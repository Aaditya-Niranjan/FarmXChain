// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CropRegistry {
    
    struct Crop {
        uint256 id;
        string cropName;
        uint256 quantityKg;
        string originLocation;
        uint256 harvestTimestamp;
        string dataHash; // SHA-256 hash of the crop data for verification
        address farmer;
        address currentOwner;
        uint256 registrationTimestamp;
        bool exists;
    }
    
    mapping(uint256 => Crop) public crops;
    mapping(address => uint256[]) public farmerCrops;
    
    event CropRegistered(uint256 indexed cropId, address indexed farmer, string cropName, uint256 quantityKg);
    event OwnershipTransferred(uint256 indexed cropId, address indexed previousOwner, address indexed newOwner);
    event ShipmentLogged(uint256 indexed orderId, string location, string conditionData);
    
    function registerCrop(
        uint256 _id,
        string memory _cropName,
        uint256 _quantityKg,
        string memory _originLocation,
        uint256 _harvestTimestamp,
        string memory _dataHash
    ) public {
        require(!crops[_id].exists, "Crop ID already exists");
        
        crops[_id] = Crop({
            id: _id,
            cropName: _cropName,
            quantityKg: _quantityKg,
            originLocation: _originLocation,
            harvestTimestamp: _harvestTimestamp,
            dataHash: _dataHash,
            farmer: msg.sender,
            currentOwner: msg.sender,
            registrationTimestamp: block.timestamp,
            exists: true
        });
        
        farmerCrops[msg.sender].push(_id);
        
        emit CropRegistered(_id, msg.sender, _cropName, _quantityKg);
    }
    
    function getCrop(uint256 _id) public view returns (
        string memory cropName,
        uint256 quantityKg,
        string memory originLocation,
        uint256 harvestTimestamp,
        string memory dataHash,
        address farmer,
        uint256 registrationTimestamp
    ) {
        require(crops[_id].exists, "Crop does not exist");
        Crop memory c = crops[_id];
        return (c.cropName, c.quantityKg, c.originLocation, c.harvestTimestamp, c.dataHash, c.farmer, c.registrationTimestamp);
    }
    
    function verifyCrop(uint256 _id, string memory _dataHash) public view returns (bool) {
        require(crops[_id].exists, "Crop does not exist");
        return (keccak256(abi.encodePacked(crops[_id].dataHash)) == keccak256(abi.encodePacked(_dataHash)));
    }
    
    function getFarmerCropCount(address _farmer) public view returns (uint256) {
        return farmerCrops[_farmer].length;
    }

    function transferOwnership(uint256 _id, address _newOwner) public {
        require(crops[_id].exists, "Crop does not exist");
        require(crops[_id].currentOwner == msg.sender, "Only the current owner can transfer ownership");
        
        address previousOwner = crops[_id].currentOwner;
        crops[_id].currentOwner = _newOwner;
        
        emit OwnershipTransferred(_id, previousOwner, _newOwner);
    }

    function logShipment(uint256 _orderId, string memory _location, string memory _conditionData) public {
        // In a real scenario, we might want to restrict this to authorized carriers or the owner
        emit ShipmentLogged(_orderId, _location, _conditionData);
    }
}
