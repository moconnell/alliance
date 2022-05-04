// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CalendarStorage.sol";
import "./DateTime.sol";

library CalendarUtils {
  function daysOfWeekFromTimestamp(uint256 timestamp)
    internal
    pure
    returns (uint256 daysOfWeek)
  {
    daysOfWeek = 1 << (DateTime.getDayOfWeek(timestamp) % 7);
  }

  function timestampIsAvailableDay(uint256 timestamp, uint8 availableDays)
    internal
    pure
    returns (bool isAvailableDay)
  {
    uint256 daysOfWeek = daysOfWeekFromTimestamp(timestamp);
    isAvailableDay = availableDays & daysOfWeek == daysOfWeek;
  }

  /// @notice Gets available meeting times on a given day.
  /// @param _year Year the meeting starts.
  /// @param _month Month the meeting starts.
  /// @param _day Day the meeting starts.
  /// @param _duration Duration of the meeting in minutes.
  function getAvailableTimes(
    uint256 _year,
    uint256 _month,
    uint256 _day,
    uint16 _duration,
    Availability storage _availability,
    Meeting[] memory existingMeetingsOnDate
  ) internal view returns (uint16[] memory) {
    uint256 maxLength = _availability.minutesAvailable / _duration;
    uint16[] memory times = new uint16[](maxLength);

    uint256 timestamp = DateTime.timestampFromDateTime(
      _year,
      _month,
      _day,
      0,
      0,
      0
    );
    if (timestamp < block.timestamp) {
      return times;
    }

    if (
      !CalendarUtils.timestampIsAvailableDay(
        timestamp,
        _availability.availableDays
      )
    ) {
      return times;
    }

    uint16 startMinute = _availability.earliestStartMinutes;
    uint16 otherStartMinute;
    uint256 s = 0;

    for (uint256 i = 0; i < existingMeetingsOnDate.length; i++) {
      Meeting memory other = existingMeetingsOnDate[i];

      while (startMinute + _duration <= other.startMinutes) {
        times[s++] = startMinute;
        startMinute += _duration;
      }

      startMinute = other.startMinutes + other.durationMinutes;
    }

    otherStartMinute =
      _availability.earliestStartMinutes +
      _availability.minutesAvailable;

    while (startMinute + _duration <= otherStartMinute) {
      times[s++] = startMinute;
      startMinute += _duration;
    }

    // TODO: check existing meetings on the next day

    return times;
  }
}
