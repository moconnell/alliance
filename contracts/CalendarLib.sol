// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library CalendarLib {
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
        uint16 duration
    );

    event MeetingCancelled(
        address indexed _attendee,
        uint256 year, uint256 month, uint256 day,
        uint256 hour, uint256 minute,
        uint16 duration
    );
}