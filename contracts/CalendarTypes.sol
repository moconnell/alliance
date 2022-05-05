// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library CalendarTypes {
  /// @notice Contains the information of a meeting.
  /// @param address Address of the attendee of the meeting.
  /// @param startMinutes Total number of minutes past midnight that the meeting starts.
  /// @param durationMinutes Duration of the meeting in minutes.
  struct Meeting {
    address attendee; // 20 bytes
    uint16 startMinutes; // 2 byte
    uint16 durationMinutes; // 2 bytes
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
  /// @param earliestStartMinutes earliest time in total minutes past midnight at which meetings can be booked.
  /// @param minutesAvailable period in minutes starting at the earliest time in which meetings can be booked.
  struct Availability {
    string location;
    string timeZone;
    uint8 availableDays;
    uint16 earliestStartMinutes;
    uint16 minutesAvailable;
  }

  /// @notice Contains an array of times expressed in minutes past midnight
  /// @param times array of times expressed in minutes past midnight, where -1 indicates a null value
  /// @param timeZone time zone relevant to the times
  struct TimeArray {
    int16[] times;
    string timeZone;
  }
}
