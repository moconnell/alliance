// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CalendarLib.sol";

contract CalendarStorage {
    mapping(uint256 => // year
    mapping(uint256 => // month
    mapping(uint256 => // day
    CalendarLib.Meeting[]
    ))) public dateToMeetings;

    address public owner;
    string public emailAddress;
    int8 public timezone;
    bool[7] public availableDays;
    CalendarLib.Time public availableStart;
    CalendarLib.Time public availableEnd;
}