// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./Calendar.sol";

contract CalendarFactory {
    mapping(address => uint256[]) public userToCalendarIds;
    mapping(uint256 => address) public calendarIdToCalendar;

    address calendarImplementation;
    uint256 public calendarCount = 0;

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
    ) external returns (uint256){

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

        uint256 id = calendarCount;
        calendarCount++;

        calendarIdToCalendar[id] = clone;
        userToCalendarIds[msg.sender].push(id);

        emit CalendarCreated(msg.sender, clone);

        return id;
    }
}