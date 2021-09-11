// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CalendarStorage {
    struct Meeting {
        address attendee;   // 32 bytes
        uint16 hour;        // 2 bytes
        uint16 minute;      // 2 bytes
        uint16 duration;    // 2 bytes
    }

    event MeetingBooked(
        address indexed _attendee,
        uint256 year, uint256 month, uint256 day,
        uint256 hour, uint256 minute,
        uint256 duration
    );

    event MeetingCancelled(
        address indexed _attendee,
        uint256 year, uint256 month, uint256 day,
        uint256 hour, uint256 minute,
        uint256 duration
    );

    mapping(uint256 => // year
    mapping(uint256 => // month
    mapping(uint256 => // day
    Meeting[]
    ))) public dateToMeetings;

    address public owner;
    string public emailAddress;
    bool[7] public availableDays;
    uint16 earliestStartMinute;
    uint16 minutesAvailable;
}