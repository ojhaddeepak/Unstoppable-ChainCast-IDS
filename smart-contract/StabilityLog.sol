// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StabilityLog {
    struct Incident {
        string incidentType;
        uint time;
    }

    Incident[] public incidents;

    function logIncident(string memory _type) public {
        incidents.push(Incident(_type, block.timestamp));
    }
}
