package com.infosys.farmxchain.service;

import com.infosys.farmxchain.dto.OrderDTO;
import com.infosys.farmxchain.dto.OrderRequest;
import com.infosys.farmxchain.entity.*;
import com.infosys.farmxchain.exception.ResourceNotFoundException;
import com.infosys.farmxchain.repository.CropRepository;
import com.infosys.farmxchain.repository.OrderRepository;
import com.infosys.farmxchain.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CropRepository cropRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BlockchainService blockchainService;

    public OrderDTO placeOrder(Long buyerId, OrderRequest request) {
        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new ResourceNotFoundException("Buyer not found with id: " + buyerId));

        Crop crop = cropRepository.findById(request.getCropId())
                .orElseThrow(() -> new ResourceNotFoundException("Crop not found with id: " + request.getCropId()));

        BigDecimal totalPrice = crop.getPricePerKg() != null ? 
                        crop.getPricePerKg().multiply(request.getQuantity()) : BigDecimal.ZERO;

        if (buyer.getBalance().compareTo(totalPrice) < 0) {
            throw new RuntimeException("Insufficient wallet balance. Please add funds to place this order.");
        }

        Order order = Order.builder()
                .buyer(buyer)
                .farmer(crop.getFarmer())
                .crop(crop)
                .quantity(request.getQuantity())
                .totalPrice(totalPrice)
                .status(OrderStatus.PENDING)
                .deliveryAddress(request.getDeliveryAddress()) // Set delivery address
                .build();

        Order savedOrder = orderRepository.save(order);
        return convertToDTO(savedOrder);
    }

    public List<OrderDTO> getOrdersByBuyer(Long buyerId) {
        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new ResourceNotFoundException("Buyer not found with id: " + buyerId));
        return orderRepository.findByBuyer(buyer).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getOrdersByFarmer(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Farmer farmer = user.getFarmer();
        if (farmer == null) {
            throw new ResourceNotFoundException("Farmer profile not found for user: " + userId);
        }
        return orderRepository.findByFarmer(farmer).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public OrderDTO updateOrderStatus(Long userId, Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        // Security check
        User requester = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (status == OrderStatus.COMPLETED) {
            // Only the buyer can confirm receipt
            if (!order.getBuyer().getId().equals(userId) && requester.getRole() != Role.ADMIN) {
                throw new RuntimeException("Unauthorized: Only the buyer can confirm receipt. (Your ID: " + userId + ", Buyer ID: " + order.getBuyer().getId() + ")");
            }
            if (order.getStatus() != OrderStatus.DELIVERED) {
                throw new RuntimeException("Order must be delivered before it can be completed. Current status: " + order.getStatus());
            }
        } else {
            // For other statuses (ACCEPT, REJECT, etc.), only the farmer can update
            if (!order.getFarmer().getUser().getId().equals(userId) && requester.getRole() != Role.ADMIN) {
                throw new RuntimeException("Unauthorized: Only the farmer associated with this order can update its status. (Your ID: " + userId + ", Farmer User ID: " + order.getFarmer().getUser().getId() + ")");
            }
        }

        order.setStatus(status);
        
        if (status == OrderStatus.ACCEPTED) {
            // Deduct quantity from crop
            Crop crop = order.getCrop();
            if (crop.getQuantityKg().compareTo(order.getQuantity()) < 0) {
                throw new RuntimeException("Insufficient crop inventory available.");
            }
            crop.setQuantityKg(crop.getQuantityKg().subtract(order.getQuantity()));
            cropRepository.save(crop);

            // Financial Transfer
            User buyer = order.getBuyer();
            User farmerUser = order.getFarmer().getUser();

            BigDecimal totalPrice = order.getTotalPrice() != null ? order.getTotalPrice() : BigDecimal.ZERO;

            if (buyer.getBalance() == null) {
                buyer.setBalance(BigDecimal.ZERO);
            }
            if (farmerUser.getBalance() == null) {
                farmerUser.setBalance(BigDecimal.ZERO);
            }

            if (buyer.getBalance().compareTo(totalPrice) < 0) {
                throw new RuntimeException("Buyer has insufficient funds (Current: " + buyer.getBalance() + ", Required: " + totalPrice + ")");
            }

            buyer.setBalance(buyer.getBalance().subtract(totalPrice));
            farmerUser.setBalance(farmerUser.getBalance().add(totalPrice));

            userRepository.save(buyer);
            userRepository.save(farmerUser);
            
            // Blockchain ownership transfer
            if (buyer.getWalletAddress() != null && !buyer.getWalletAddress().trim().isEmpty() && !buyer.getWalletAddress().equals("null")) {
                try {
                    String txHash = blockchainService.transferOwnership(crop.getId(), buyer.getWalletAddress());
                    order.setBlockchainTxHash(txHash);
                } catch (Exception e) {
                    // Log error but don't fail transaction if blockchain fails (fallback to simulation happens in service)
                    System.err.println("Non-critical blockchain transfer error: " + e.getMessage());
                }
            }
        }

        return convertToDTO(orderRepository.save(order));
    }

    public OrderDTO assignToDistributor(Long orderId, Long distributorId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        User distributor = userRepository.findById(distributorId)
                .orElseThrow(() -> new ResourceNotFoundException("Distributor not found with id: " + distributorId));

        if (distributor.getRole() != Role.DISTRIBUTOR) {
            throw new RuntimeException("User is not a distributor");
        }

        // Only accepted orders can be assigned to distributors
        if (order.getStatus() != OrderStatus.ACCEPTED) {
            throw new RuntimeException("Only accepted orders can be assigned to distributors. Current status: " + order.getStatus());
        }

        order.setDistributor(distributor);
        order.setStatus(OrderStatus.ASSIGNED);

        return convertToDTO(orderRepository.save(order));
    }

    private OrderDTO convertToDTO(Order order) {
        return OrderDTO.builder()
                .id(order.getId())
                .buyerId(order.getBuyer().getId())
                .buyerName(order.getBuyer().getName())
                .farmerId(order.getFarmer().getId())
                .farmName(order.getFarmer().getFarmName())
                .cropId(order.getCrop().getId())
                .cropName(order.getCrop().getCropName())
                .quantity(order.getQuantity())
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus())
                .buyerRole(order.getBuyer().getRole().name())
                .distributorId(order.getDistributor() != null ? order.getDistributor().getId() : null)
                .distributorName(order.getDistributor() != null ? order.getDistributor().getName() : null)
                .blockchainTxHash(order.getBlockchainTxHash())
                .createdAt(order.getCreatedAt())
                .deliveryAddress(order.getDeliveryAddress()) // Map delivery address
                .build();
    }
}
