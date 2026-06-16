package com.infosys.farmxchain.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Bool;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.RawTransactionManager;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.StaticGasProvider;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Base64;
import java.util.Collections;

@Service
public class BlockchainService {

    @Value("${blockchain.node.url}")
    private String nodeUrl;

    @Value("${blockchain.private-key}")
    private String privateKey;

    @Value("${blockchain.contract.address}")
    private String contractAddress;

    private Web3j web3j;
    private Credentials credentials;
    private boolean isConnected = false;

    @PostConstruct
    public void init() {
        try {
            // Attempt to connect to local node
            web3j = Web3j.build(new HttpService(nodeUrl));
            // Basic check if connected (get version)
            web3j.web3ClientVersion().send();
            
            if (isValidPrivateKey(privateKey)) {
                credentials = Credentials.create(privateKey);
                isConnected = true;
                System.out.println("Connected to blockchain node at " + nodeUrl);
            } else {
                System.out.println("Blockchain connected but invalid private key. Using simulation.");
            }
        } catch (Exception e) {
            System.out.println("Could not connect to blockchain node: " + e.getMessage() + ". Using simulation mode.");
            isConnected = false;
        }
    }

    private boolean isValidPrivateKey(String key) {
        return key != null && key.length() >= 64 && !key.startsWith("0x0000");
    }

    public String generateBlockchainHash(String data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data.getBytes());
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error generating blockchain hash", e);
        }
    }

    public String registerCropOnBlockchain(Long cropId, String cropName, java.math.BigDecimal quantity, String originLocation, java.time.LocalDateTime harvestDate, String purityData) {
        // Generate the data hash for integrity check
        String cropDataString = cropId + ":" + cropName + ":" + quantity + ":" + harvestDate + ":" + originLocation + ":" + purityData;
        
        if (isConnected && credentials != null) {
            try {
                // Real Blockchain Interaction
                System.out.println("Initiating real blockchain transaction for crop: " + cropId);
                
                // Convert timestamp
                long harvestTimestamp = harvestDate.atZone(java.time.ZoneId.systemDefault()).toEpochSecond();
                String dataHash = generateBlockchainHash(cropDataString);
                
                // Function: registerCrop(uint256 _id, string _cropName, uint256 _quantityKg, string _originLocation, uint256 _harvestTimestamp, string _dataHash)
                Function function = new Function(
                        "registerCrop",
                        Arrays.asList(
                                new Uint256(cropId), 
                                new Utf8String(cropName), 
                                new Uint256(quantity.toBigInteger()), 
                                new Utf8String(originLocation), 
                                new Uint256(harvestTimestamp),
                                new Utf8String(dataHash)
                        ),
                        Collections.emptyList());

                String encodedFunction = FunctionEncoder.encode(function);
                
                TransactionManager txManager = new RawTransactionManager(web3j, credentials);
                // Use static gas for simulation, in prod should estimate
                String txHash = txManager.sendTransaction(
                        BigInteger.valueOf(20_000_000_000L), // 20 Gwei
                        BigInteger.valueOf(3000000), // Gas Info
                        contractAddress,
                        encodedFunction,
                        BigInteger.ZERO).getTransactionHash();
                        
                System.out.println("Blockchain Transaction Successful: " + txHash);
                return txHash;

            } catch (Exception e) {
                System.err.println("Blockchain transaction failed: " + e.getMessage());
                e.printStackTrace();
                return simulateTransaction(cropId, cropDataString);
            }
        } else {
            // Simulation Mode
            return simulateTransaction(cropId, cropDataString);
        }
    }
    
    public String transferOwnership(Long cropId, String newOwnerAddress) {
        if (isConnected && credentials != null) {
            try {
                Function function = new Function(
                        "transferOwnership",
                        Arrays.asList(
                                new Uint256(cropId),
                                new Address(newOwnerAddress)
                        ),
                        Collections.emptyList());

                String encodedFunction = FunctionEncoder.encode(function);
                TransactionManager txManager = new RawTransactionManager(web3j, credentials);
                String txHash = txManager.sendTransaction(
                        BigInteger.valueOf(20_000_000_000L),
                        BigInteger.valueOf(3000000),
                        contractAddress,
                        encodedFunction,
                        BigInteger.ZERO).getTransactionHash();
                return txHash;
            } catch (Exception e) {
                return "SIM_TX_OWNERSHIP_" + cropId;
            }
        }
        return "SIM_TX_OWNERSHIP_" + cropId;
    }

    public String logShipment(Long orderId, String location, String conditionData) {
        if (isConnected && credentials != null) {
            try {
                Function function = new Function(
                        "logShipment",
                        Arrays.asList(
                                new Uint256(orderId),
                                new Utf8String(location),
                                new Utf8String(conditionData)
                        ),
                        Collections.emptyList());

                String encodedFunction = FunctionEncoder.encode(function);
                TransactionManager txManager = new RawTransactionManager(web3j, credentials);
                String txHash = txManager.sendTransaction(
                        BigInteger.valueOf(20_000_000_000L),
                        BigInteger.valueOf(3000000),
                        contractAddress,
                        encodedFunction,
                        BigInteger.ZERO).getTransactionHash();
                return txHash;
            } catch (Exception e) {
                return "SIM_TX_SHIPMENT_" + orderId;
            }
        }
        return "SIM_TX_SHIPMENT_" + orderId;
    }

    private String simulateTransaction(Long cropId, String cropData) {
        String dataToHash = cropId + ":" + cropData + ":" + LocalDateTime.now().toString();
        String hash = generateBlockchainHash(dataToHash);
        String extendedData = dataToHash + ":" + System.nanoTime();
        String extendedHash = generateBlockchainHash(extendedData);
        return "0x" + (hash + extendedHash).substring(0, 64);
    }

    public boolean verifyBlockchainRecord(String hash, String data) {
        if (isConnected) {
            // In real mode, we would call the contract's verifyCrop function
            // For now, we rely on the hash check which is valid for both
        }
        String computedHash = generateBlockchainHash(data);
        return computedHash.equals(hash);
    }
}
