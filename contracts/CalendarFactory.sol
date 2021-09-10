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
        address indexed userAddress,
        address indexed calenderAddress,
        uint256 id
    );

    constructor() {
        calendarImplementation = address(new Calendar());
    }
    
    function createCalendar(
        string memory _emailAddress,
        bool[7] memory _availableDays,
        CalendarLib.Time calldata _availableStartTime,
        uint16 _durationInMinutes
    ) external returns (uint256){
        require(_durationInMinutes < 1440 ,"The duration must be less than 24h."); // 60min/h * 24h = 1440 min

        address clone = Clones.clone(calendarImplementation);

        Calendar(clone).initialize(
            msg.sender,
            _emailAddress,
            _availableDays,
            _availableStartTime,
            _durationInMinutes
        );

        uint256 id = calendarCount;
        calendarCount++;

        calendarIdToCalendar[id] = clone;
        userToCalendarIds[msg.sender].push(id);

        emit CalendarCreated(msg.sender, clone, id);

        return id;
    }
}