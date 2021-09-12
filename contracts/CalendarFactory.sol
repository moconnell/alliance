// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import "./Calendar.sol";

contract CalendarFactory {

    mapping(address => uint256[]) public userToCalendarIds;
    mapping(uint256 => address) public calendarIdToCalendar;

    address calendarImplementation;
    uint256 public calendarCount = 0;

    event CalendarCreated(
        address indexed calendar,
        address indexed owner,
        uint256 id
    );

    constructor() {
        calendarImplementation = address(new Calendar());
    }
    
    function createCalendar(
        string memory _emailAddress,
        bool[7] memory _availableDays,
        uint16 _availableStartHour,
        uint16 _availableStartMinute,
        uint16 _durationInMinutes
    ) external returns (uint256){
        require(_durationInMinutes < 1440, "The duration must be less than 24h."); // 60min/h * 24h = 1440 min

        address clone = ClonesUpgradeable.clone(calendarImplementation);

        Calendar(clone).initialize(
            msg.sender,
            _emailAddress,
            _availableDays,
            _availableStartHour,
            _availableStartMinute,
            _durationInMinutes
        );

        uint256 id = calendarCount;
        calendarCount++;

        calendarIdToCalendar[id] = clone;
        userToCalendarIds[msg.sender].push(id);

        emit CalendarCreated(clone, msg.sender, id);

        return id;
    }

    function remove(uint256 id) external {
        require(id < calendarCount, "Calendar does not exist.");

        uint256 i = 0;
        uint256 length = userToCalendarIds[msg.sender].length;
        while(i < length) {
            if(userToCalendarIds[msg.sender][i] == id) break;
            i++;
        }
        require(i < length, "Calendar is not owned by you.");

        userToCalendarIds[msg.sender][i] = userToCalendarIds[msg.sender][length-1];
        userToCalendarIds[msg.sender].pop();
        calendarIdToCalendar[id] = address(0);
    }
}