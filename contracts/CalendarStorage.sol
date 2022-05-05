// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CalendarTypes.sol";

/// @title Storage of a calendar.
/// @notice Stores the all information of a calendar.
contract CalendarStorage {
  /// @notice Maps the year, month, and day to an dynamic array of meetings.
  mapping(uint256 => mapping(uint256 => mapping(uint256 => CalendarTypes.Meeting[]))) // year // month // day
    public dateToMeetings;

  /// @notice The profile info of the calendar owner.
  CalendarTypes.Profile public profile;

  /// @notice The availability of the calendar owner.
  CalendarTypes.Availability public availability;
}
