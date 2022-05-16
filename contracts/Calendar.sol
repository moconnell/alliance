// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./CalendarStorage.sol";
import "./CalendarTypes.sol";
import "./CalendarUtils.sol";
import "./CustomOwnable.sol";
import "./DateTime.sol";

/// @title The calendar logic.
/// @notice Contains functions and events to initialize the calendar and to book and cancel meetings.
contract Calendar is CalendarStorage, CustomOwnable {
  /// @notice Emitted when a new meeting is book.
  /// @param attendee calendar The address of the calendar.
  /// @param year Year the meeting starts.
  /// @param month Month the meeting starts.
  /// @param day Day the meeting starts.
  /// @param hour Hour the meeting starts.
  /// @param minute Minunte the meeting starts.
  /// @param duration Duration of the meeting in minutes.
  event MeetingBooked(
    address indexed attendee,
    uint256 year,
    uint256 month,
    uint256 day,
    uint256 hour,
    uint256 minute,
    uint256 duration
  );

  /// @notice Emitted when a booked meeting is cancelled.
  /// @param attendee calendar The address of the calendar.
  /// @param year Year the meeting starts.
  /// @param month Month the meeting starts.
  /// @param day Day the meeting starts.
  /// @param hour Hour the meeting starts.
  /// @param minute Minunte the meeting starts.
  /// @param duration Duration of the meeting in minutes.
  event MeetingCancelled(
    address indexed attendee,
    uint256 year,
    uint256 month,
    uint256 day,
    uint256 hour,
    uint256 minute,
    uint256 duration
  );

  /// @notice Initializes the calendar.
  /// @param _owner The owner of the contract.
  /// @param _profile The profile of the calendar owner.
  /// @param _availability The availability of the calendar owner.
  function initialize(
    address _owner,
    CalendarTypes.Profile calldata _profile,
    CalendarTypes.Availability calldata _availability
  ) external initializer {
    require(_owner != address(0), "Zero");
    owner = _owner;
    profile = _profile;
    availability = _availability;
  }

  function setAvailability(CalendarTypes.Availability calldata _availability)
    external
    onlyOwner
  {
    availability = _availability;
  }

  function setProfile(CalendarTypes.Profile calldata _profile)
    external
    onlyOwner
  {
    profile = _profile;
  }

  function setProfileAvailability(
    CalendarTypes.Profile calldata _profile,
    CalendarTypes.Availability calldata _availability
  ) external onlyOwner {
    availability = _availability;
    profile = _profile;
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
    uint16 _duration
  ) external view returns (CalendarTypes.TimeArray memory) {
    require(
      DateTime.isValidDateTime(_year, _month, _day, 0, 0, 0),
      "Date is not valid."
    );

    CalendarTypes.Meeting[] memory existingMeetingsOnDate = getMeetings(
      _year,
      _month,
      _day
    );

    return
      CalendarUtils.getAvailableTimes(
        _year,
        _month,
        _day,
        _duration,
        availability,
        existingMeetingsOnDate
      );
  }

  /// @notice Books a meeting.
  /// @param _year Year the meeting starts.
  /// @param _month Month the meeting starts.
  /// @param _day Day the meeting starts.
  /// @param _hour Hour the meeting starts.
  /// @param _minute Minute the meeting starts.
  /// @param _duration Duration of the meeting in minutes.
  function bookMeeting(
    uint256 _year,
    uint256 _month,
    uint256 _day,
    uint256 _hour,
    uint256 _minute,
    uint256 _duration
  ) external {
    require(msg.sender != owner, "Cannot book meeting with self");
    require(
      DateTime.isValidDateTime(_year, _month, _day, _hour, _minute, 0),
      "Date and time are not valid."
    );

    uint256 startMinute = _hour * 60 + _minute;
    uint256 endMinute = startMinute + _duration;

    if (availability.earliestStartMinutes <= startMinute)
      require(
        endMinute - availability.earliestStartMinutes <=
          availability.minutesAvailable,
        "Time not available."
      );
    else {
      // overnight case
      require(
        endMinute + 1440 - availability.earliestStartMinutes <=
          availability.minutesAvailable,
        "Time not available."
      );
    }

    uint256 timestamp = DateTime.timestampFromDateTime(
      _year,
      _month,
      _day,
      _hour,
      _minute,
      0
    );
    //slither-disable-next-line timestamp
    require(timestamp > block.timestamp, "Cannot book meeting in the past");

    require(
      CalendarUtils.timestampIsAvailableDay(
        timestamp,
        availability.availableDays
      ),
      "Day not available."
    );

    // Check existing meetings on the day for collisions
    _checkDay(_year, _month, _day, startMinute, _duration);

    uint256 days_ = DateTime._daysFromDate(_year, _month, _day);

    // Check existing meetings on the previous day for collisions
    _checkPrevDay(startMinute, days_);

    // Check existing meetings on the previous day for collisions
    _checkNextDay(endMinute, days_);

    // Add meeting to existing meetings
    dateToMeetings[_year][_month][_day].push(
      CalendarTypes.Meeting({
        attendee: msg.sender,
        startMinutes: uint16(_hour * 60 + _minute),
        durationMinutes: uint16(_duration)
      })
    );

    emit MeetingBooked(
      msg.sender,
      _year,
      _month,
      _day,
      _hour,
      _minute,
      _duration
    );
  }

  /// @notice Checks if a meeting collides with a meeting on the previous day.
  /// @param _year Year the meeting starts.
  /// @param _month Month the meeting starts.
  /// @param _day Day the meeting starts.
  /// @param _startMinute Minute the meeting starts.
  /// @param _duration Duration of the meeting in minutes.
  function _checkDay(
    uint256 _year,
    uint256 _month,
    uint256 _day,
    uint256 _startMinute,
    uint256 _duration
  ) internal view {
    // Compare existing meetings on the same day for collisions
    CalendarTypes.Meeting[] memory existingMeetingsOnDate = getMeetings(
      _year,
      _month,
      _day
    );

    for (uint256 i = 0; i < existingMeetingsOnDate.length; i++) {
      CalendarTypes.Meeting memory other = existingMeetingsOnDate[i];
      uint16 otherEndMinute = other.startMinutes + other.durationMinutes;

      // check if the other meeting ends before the new meeting starts
      // or if the new meeting ends before the other meeting starts
      require(
        otherEndMinute <= _startMinute ||
          _startMinute + _duration <= other.startMinutes,
        "Overlap with existing meeting."
      );
    }
  }

  /// @notice Checks if a meeting collides with a meeting on the previous day.
  /// @param _startMinute Minute the meeting starts.
  /// @param _days The number of days after day 0 (1970/01/01).
  function _checkPrevDay(uint256 _startMinute, uint256 _days) internal view {
    (uint256 year, uint256 month, uint256 day) = DateTime._daysToDate(
      _days - 1
    );

    CalendarTypes.Meeting[] memory existingMeetingsPrevDay = getMeetings(
      year,
      month,
      day
    );

    for (uint256 i = 0; i < existingMeetingsPrevDay.length; i++) {
      CalendarTypes.Meeting memory other = existingMeetingsPrevDay[i];

      uint16 otherEndMinute = other.startMinutes + other.durationMinutes;

      // check if the other meeting ends before the new one starts
      require(
        otherEndMinute <= 1440 || otherEndMinute % 1440 <= _startMinute,
        "Overlaps meeting previous day"
      );
    }
  }

  /// @notice Checks if a meeting collides with a meeting on the next day.
  /// @param _endMinute Minute the meeting ends.
  /// @param _days The number of days after day 0 (1970/01/01).
  function _checkNextDay(uint256 _endMinute, uint256 _days) internal view {
    (uint256 year, uint256 month, uint256 day) = DateTime._daysToDate(
      _days + 1
    );

    CalendarTypes.Meeting[] memory existingMeetingsNextDay = getMeetings(
      year,
      month,
      day
    );

    for (uint256 i = 0; i < existingMeetingsNextDay.length; i++) {
      // check if the other meeting ends before the new one starts
      require(
        _endMinute <= existingMeetingsNextDay[i].startMinutes,
        "Overlaps meeting next day"
      );
    }
  }

  /// @notice Getter for all meetings on a specific date.
  /// @param _year Year the meeting starts.
  /// @param _month Month the meeting starts.
  /// @param _day Day the meeting starts.
  /// @return Returns all meetings on the date.
  function getMeetings(
    uint256 _year,
    uint256 _month,
    uint256 _day
  ) public view returns (CalendarTypes.Meeting[] memory) {
    return dateToMeetings[_year][_month][_day];
  }

  /// @notice Canels a meeting by its date and position in the senders meeting array.
  /// @param _year Year the meeting starts.
  /// @param _month Month the meeting starts.
  /// @param _day Day the meeting starts.
  /// @param _arrayPosition Position of the meeting in the senders meeting array.
  function cancelMeeting(
    uint256 _year,
    uint256 _month,
    uint256 _day,
    uint256 _arrayPosition
  ) external {
    // search for the meeting position in the meetings array
    CalendarTypes.Meeting[] memory meetingsOnDay = getMeetings(
      _year,
      _month,
      _day
    );

    uint256 length = meetingsOnDay.length;
    require(_arrayPosition < length, "Meeting does not exist.");

    CalendarTypes.Meeting memory meeting = meetingsOnDay[_arrayPosition];

    require(msg.sender == meeting.attendee, "Not your booking!");

    emit MeetingCancelled(
      msg.sender,
      _year,
      _month,
      _day,
      meeting.startMinutes / 60,
      meeting.startMinutes % 60,
      meeting.durationMinutes
    );

    // remove element by overwriting it with the last element
    dateToMeetings[_year][_month][_day][_arrayPosition] = meetingsOnDay[
      length - 1
    ];
    dateToMeetings[_year][_month][_day].pop();
  }
}
