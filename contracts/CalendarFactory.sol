// SPDX-License-Identifier: MIT
pragma solidity 0.7.3;

import "./Calendar.sol";

contract CalendarFactory {
    mapping(address => address[]) public userToCalendars;
    mapping(address => uint256) public userToNumCalendars;

    event CalendarCreated(
        address indexed _user,
        address _calAddr
    );

    function createCalendar (
        int8 _timezone,
        string memory _emailAddress,
        address _newOwner,
        Calendar.Day[] memory _availableDays,
        uint256 _availableStartTime,
        uint256 _availableEndTime,
        uint256 _duration
    ) external {
        Calendar cal = new Calendar(
            _timezone,
            _emailAddress,
            _newOwner,
            _availableDays,
            _availableStartTime,
            _availableEndTime,
            _duration
        );

        address calAddr = address(cal);
        userToNumCalendars[msg.sender] += 1;
        userToCalendars[msg.sender].push(calAddr);

        emit CalendarCreated(msg.sender, calAddr);
    }
}