// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./CalendarStorage.sol";
import "./DateTime.sol";

/// @title A custom ownable implementation.
/// @notice Provides a function modifier that allows only the owner to execute the function.
/// @dev A custom implementation is used here (in contrast to OpenZepplin) to allow clones to be ownable.
abstract contract CustomOwnable is ContextUpgradeable {
  /// @notice Address of the owner.
  address public owner;

  /// @dev Throws if called by any account other than the owner.
  modifier onlyOwner() {
    require(owner == _msgSender(), "Caller is not the owner.");
    _;
  }
}

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
    Profile calldata _profile,
    Availability calldata _availability
  ) external initializer {
    owner = _owner;
    profile = _profile;
    availability = _availability;
  }

  function setAvailability(Availability calldata _availability)
    external
    onlyOwner
  {
    availability = _availability;
  }

  function setProfile(Profile calldata _profile) external onlyOwner {
    profile = _profile;
  }

  function setProfileAvailability(
    Profile calldata _profile,
    Availability calldata _availability
  ) external onlyOwner {
    availability = _availability;
    profile = _profile;
  }

  /// @notice Gets available meeting slots on a given day.
  /// @param _year Year the meeting starts.
  /// @param _month Month the meeting starts.
  /// @param _day Day the meeting starts.
  /// @param _duration Duration of the meeting in minutes.
  function getAvailableSlots(
    uint256 _year,
    uint256 _month,
    uint256 _day,
    uint16 _duration
  ) public view returns (uint16[] memory) {
    require(
      DateTime.isValidDateTime(_year, _month, _day, 0, 0, 0),
      "Date is not valid."
    );

    uint256 maxLength = availability.minutesAvailable / _duration;
    uint16[] memory slots = new uint16[](maxLength);

    uint256 timestamp = DateTime.timestampFromDateTime(
      _year,
      _month,
      _day,
      0,
      0,
      0
    );
    if (timestamp < block.timestamp) {
      return slots;
    }

    uint256 dayOfWeek = 1 << (DateTime.getDayOfWeek(timestamp) - 1);
    if (availability.availableDays & dayOfWeek != dayOfWeek) {
      return slots;
    }

    // TODO: check existing meetings on the previous day

    Meeting[] memory existingMeetingsOnDate = dateToMeetings[_year][_month][
      _day
    ];
    uint16 startMinute = availability.earliestStartMinutes;
    uint16 otherStartMinute;
    uint256 s = 0;

    for (uint256 i = 0; i < existingMeetingsOnDate.length; i++) {
      Meeting memory other = existingMeetingsOnDate[i];

      while (startMinute + _duration <= other.startMinutes) {
        slots[s++] = startMinute;
        startMinute += _duration;
      }

      startMinute = other.startMinutes + other.durationMinutes;
    }

    otherStartMinute =
      availability.earliestStartMinutes +
      availability.minutesAvailable;

    while (startMinute + _duration <= otherStartMinute) {
      slots[s++] = startMinute;
      startMinute += _duration;
    }

    // TODO: check existing meetings on the next day

    return slots;
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
  ) public {
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
    require(timestamp > block.timestamp, "Cannot book meeting in the past");

    uint256 dayOfWeek = 1 << (DateTime.getDayOfWeek(timestamp) - 1);
    require(
      availability.availableDays & dayOfWeek == dayOfWeek,
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
      Meeting({
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
    Meeting[] memory existingMeetingsOnDate = dateToMeetings[_year][_month][
      _day
    ];
    for (uint256 i = 0; i < existingMeetingsOnDate.length; i++) {
      Meeting memory other = existingMeetingsOnDate[i];
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
    (uint256 prevYear, uint256 prevMonth, uint256 prevDay) = DateTime
      ._daysToDate(_days - 1);

    Meeting[] memory existingMeetingsOnPrevDay = dateToMeetings[prevYear][
      prevMonth
    ][prevDay];

    for (uint256 i = 0; i < existingMeetingsOnPrevDay.length; i++) {
      Meeting memory other = existingMeetingsOnPrevDay[i];

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
    (uint256 nextYear, uint256 nextMonth, uint256 nextDay) = DateTime
      ._daysToDate(_days + 1);

    Meeting[] memory existingMeetingsOnNextDay = dateToMeetings[nextYear][
      nextMonth
    ][nextDay];

    for (uint256 i = 0; i < existingMeetingsOnNextDay.length; i++) {
      Meeting memory other = existingMeetingsOnNextDay[i];

      // check if the other meeting ends before the new one starts
      require(_endMinute <= other.startMinutes, "Overlaps meeting next day");
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
  ) public view returns (Meeting[] memory) {
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
    uint256 length = dateToMeetings[_year][_month][_day].length;

    require(_arrayPosition < length, "Meeting does not exist.");

    Meeting memory meeting = dateToMeetings[_year][_month][_day][_arrayPosition];

    require(
      msg.sender ==
        meeting.attendee,
      "Not your booking!"
    );

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
    dateToMeetings[_year][_month][_day][_arrayPosition] = dateToMeetings[_year][
      _month
    ][_day][length - 1];
    dateToMeetings[_year][_month][_day].pop();
  }
}
