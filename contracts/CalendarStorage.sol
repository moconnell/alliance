// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


/// @title Storage of a calendar.
/// @notice Stores the all information of a calendar.
contract CalendarStorage {

    /// @notice Contains the information of a meeting.
    /// @param hour Hour the meeting starts.
    /// @param minute Minunte the meeting starts.
    /// @param duration Duration of the meeting in minutes.
    struct Meeting {
        address attendee;   // 32 bytes
        uint16 hour;        // 2 bytes
        uint16 minute;      // 2 bytes
        uint16 duration;    // 2 bytes
    }

    /// @notice Maps the year, month, and day to an dynamic array of meetings.
    mapping(uint256 => // year
    mapping(uint256 => // month
    mapping(uint256 => // day
    Meeting[]
    ))) public dateToMeetings;

    /// @notice The email address of the calendar owner.
    string public emailAddress;

    /// @notice A fixed-size array of type `bool` and length `7` specifying on which days meetings can be booked.
    bool[7] public availableDays;

    /// @notice The earliest time in total minutes at which meetings can be booked. 
    uint16 internal earliestTimeInMinutes;

    /// @notice The period in minutes starting at the earliest time in which meetings can be booked.
    uint16 internal minutesAvailable;
}