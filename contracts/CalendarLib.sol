// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library CalendarLib {
    struct Meeting {
        address attendee;   // 32 bytes
        Time start;         // 2 bytes
        uint16 duration;    // 2 bytes
    }

    event MeetingBooked(
        address indexed _attendee,
        uint256 year, uint256 month, uint256 day,
        uint256 startHour, uint256 startMinute,
        uint16 duration
    );

    event MeetingCancelled(
        address indexed _attendee,
        uint256 year, uint256 month, uint256 day,
        uint256 startHour, uint256 startMinute,
        uint16 duration
    );

    struct Time {
        uint16 hour;     // 1 byte
        uint16 minute;   // 1 byte
    }

    function timeToMinuteOfDay(Time calldata a) public pure returns (uint16) {
        return a.hour * 60 + a.minute;
    }
}