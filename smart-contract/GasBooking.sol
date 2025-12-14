// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title GasBooking
 * @dev Stores proof of gas bookings on-chain after backend verification.
 */
contract GasBooking {
    
    struct Booking {
        address user;
        string gasType;
        uint256 quantity;
        uint256 amount;
        string paymentId;
        uint256 timestamp;
    }

    Booking[] public bookings;
    address public owner;

    event GasBooked(address indexed user, string gasType, uint256 quantity, string paymentId, uint256 timestamp);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only backend service can write to this contract");
        _;
    }

    /**
     * @dev Called by the backend after successful Razorpay payment verification.
     */
    function bookGas(address _user, string memory _gasType, uint256 _quantity, uint256 _amount, string memory _paymentId) external onlyOwner {
        bookings.push(Booking({
            user: _user,
            gasType: _gasType,
            quantity: _quantity,
            amount: _amount,
            paymentId: _paymentId,
            timestamp: block.timestamp
        }));

        emit GasBooked(_user, _gasType, _quantity, _paymentId, block.timestamp);
    }

    function getBookingCount() external view returns (uint256) {
        return bookings.length;
    }

    function getBooking(uint256 _index) external view returns (Booking memory) {
        return bookings[_index];
    }
}
