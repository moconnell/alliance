// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @notice Contains the information of a meeting.
/// @param hour Hour the meeting starts.
/// @param minute Minunte the meeting starts.
/// @param duration Duration of the meeting in minutes.
struct Meeting {
  address attendee; // 32 bytes
  uint16 hour; // 2 bytes
  uint16 minute; // 2 bytes
  uint16 duration; // 2 bytes
}

/// @notice The profile info of the calendar owner.
/// @param description description of the calendar owner.
/// @param email email address of the calendar owner.
/// @param picture profile picture URL of the calendar owner.
/// @param url public URL of the calendar owner.
/// @param username public username of the calendar owner.
struct Profile {
  string description;
  string email;
  string picture;
  string url;
  string username;
}

/// @notice The availability of the calendar owner.
/// @param location location of the calendar owner.
/// @param timeZone time-zone of the calendar owner.
/// @param availableDays bit mask specifying on which days meetings can be booked (Sunday = 1 << 0; Saturday = 1 << 6)
/// @param earliestTimeInMinutes earliest time in total minutes at which meetings can be booked.
/// @param minutesAvailable period in minutes starting at the earliest time in which meetings can be booked.
struct Availability {
  string location;
  string timeZone;
  uint8 availableDays;
  uint16 earliestTimeInMinutes;
  uint16 minutesAvailable;
}

/// @title Storage of a calendar.
/// @notice Stores the all information of a calendar.
contract CalendarStorage {
  /// @notice Maps the year, month, and day to an dynamic array of meetings.
  mapping(uint256 => mapping(uint256 => mapping(uint256 => Meeting[]))) // year // month // day
    public dateToMeetings;

  /// @notice The profile info of the calendar owner.
  Profile public profile;

  /// @notice The availability of the calendar owner.
  Availability public availability;
}
