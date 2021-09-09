// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CalendarLib.sol";

contract CalendarStorage {
    address public owner;
    int8 public timezone;
    string public emailAddress;
    bool[7] public availableDays;
    CalendarLib.Time public availableStart;
    CalendarLib.Time public availableEnd;

    mapping(uint256 =>          // year
        mapping(uint256 =>      // month
            mapping(uint256 =>  // day
                CalendarLib.Meeting[]
    ))) public dateToMeetings;

}