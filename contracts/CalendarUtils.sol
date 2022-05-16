// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./CalendarStorage.sol";
import "./CalendarTypes.sol";
import "./DateTime.sol";

library CalendarUtils {
  /// @notice converts a timestamp's day to a bit mask value (Sunday = 1 << 0; Saturday = 1 << 6)
  /// @param _timestamp timestamp to evaluate
  function daysOfWeekFromTimestamp(uint256 _timestamp)
    internal
    pure
    returns (uint256 daysOfWeek)
  {
    daysOfWeek = 1 << (DateTime.getDayOfWeek(_timestamp) % 7);
  }

  /// @notice Gets available meeting times on a given day.
  /// @param _timestamp timestamp to evaluate
  /// @param _availableDays "DaysOfWeek" bit mask value
  function timestampIsAvailableDay(uint256 _timestamp, uint8 _availableDays)
    internal
    pure
    returns (bool isAvailableDay)
  {
    uint256 daysOfWeek = daysOfWeekFromTimestamp(_timestamp);
    isAvailableDay = _availableDays & daysOfWeek == daysOfWeek;
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
    CalendarTypes.Availability memory _availability,
    CalendarTypes.Meeting[] memory existingMeetingsOnDate
  ) internal view returns (CalendarTypes.TimeArray memory) {
    uint256 _timestamp = DateTime.timestampFromDateTime(
      _year,
      _month,
      _day,
      0,
      0,
      0
    );

    require(_timestamp > block.timestamp, "Date is in the past");
    
    if (!timestampIsAvailableDay(_timestamp, _availability.availableDays)) {
      return
        CalendarTypes.TimeArray({
          times: new int16[](0),
          timeZone: _availability.timeZone
        });
    }

    uint256 maxLength = _availability.minutesAvailable / _duration;
    int16[] memory times = new int16[](maxLength);
    uint16 startMinute = _availability.earliestStartMinutes;
    uint16 otherStartMinute;
    uint256 s = 0;

    for (uint256 i = 0; i < existingMeetingsOnDate.length; i++) {
      CalendarTypes.Meeting memory other = existingMeetingsOnDate[i];

      while (startMinute + _duration <= other.startMinutes) {
        times[s++] = int16(startMinute);
        startMinute += _duration;
      }

      startMinute = other.startMinutes + other.durationMinutes;
    }

    otherStartMinute =
      _availability.earliestStartMinutes +
      _availability.minutesAvailable;

    while (startMinute + _duration <= otherStartMinute) {
      times[s++] = int16(startMinute);
      startMinute += _duration;
    }

    // cannot resize array, so fill in the blanks with "empty" value
    while (s < maxLength) {
      times[s++] = -1;
    }

    return
      CalendarTypes.TimeArray({
        times: times,
        timeZone: _availability.timeZone
      });
  }
}
