// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./Calendar.sol";

contract CalendarFactory {
    mapping(address => address[]) public userToCalendars;
    mapping(address => uint256) public userToNumCalendars;

    address calendarImplementation;

    event CalendarCreated(
        address indexed _user,
        address _calAddr
    );

    constructor() {
        calendarImplementation = address(new Calendar());
    }
    
    function createCalendar(
        int8 _timezone,
        string memory _emailAddress,
        Calendar.Day[] memory _availableDays,
        uint256 _availableStartTime,
        uint256 _availableEndTime,
        uint256 _duration
    ) external {

        address clone = Clones.clone(calendarImplementation);

        Calendar(clone).initialize(
            _timezone,
            _emailAddress,
            msg.sender,
            _availableDays,
            _availableStartTime,
            _availableEndTime,
            _duration
        );

        userToNumCalendars[msg.sender] += 1;
        userToCalendars[msg.sender].push(clone);

        emit CalendarCreated(msg.sender, clone);
    }
}