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
        uint256 year, uint256 month, uint256 day,
        uint256 hour, uint256 minute,
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
        uint256 year, uint256 month, uint256 day,
        uint256 hour, uint256 minute,
        uint256 duration
    );

    /// @notice Initializes the calendar.
    /// @param _owner The owner of the contract.
    /// @param _emailAddress The email address to notify on booked events.
    /// @param _availableDays The days on which the meetings can be booked.
    /// @param _earliestHour The earliest hour of the day at which meetings can be booked.
    /// @param _earliestMinute The earliest minute of the day at which meetings can be booked.
    /// @param _minutesAvailable The availablilty in minutes starting at the earliest time in which meetings can be booked.
    function initialize(
        address _owner,
        string memory _emailAddress,
        bool[7] memory _availableDays,
        uint16 _earliestHour,
        uint16 _earliestMinute,
        uint16 _minutesAvailable
    ) external initializer
    {
        owner = _owner;
        emailAddress = _emailAddress;
        availableDays = _availableDays;
        earliestTimeInMinutes = _earliestHour * 60 + _earliestMinute;
        minutesAvailable = _minutesAvailable;
    }

    function setAvailableDays(bool[7] memory _availableDays) external onlyOwner {
        availableDays = _availableDays;
    }

    function changeAvailableTimes(
        uint16 _availableStartHour,
        uint16 _availableStartMinute,
        uint16 _durationInMinutes
    ) external onlyOwner {
        earliestTimeInMinutes = _availableStartHour * 60 + _availableStartMinute;
        minutesAvailable = _durationInMinutes;
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
        uint16 _hour,
        uint16 _minute,
        uint16 _duration
    ) public {
        require(msg.sender != owner, "You cannot book a meeting with yourself.");
        require(DateTime.isValidDateTime(_year, _month, _day, _hour, _minute,0), "Date and time are not valid.");

        uint16 startMinute = _hour * 60 + _minute;
        uint16 endMinute = startMinute + _duration;

        if (earliestTimeInMinutes <= startMinute)
            require(endMinute - earliestTimeInMinutes <= minutesAvailable,
                "Time not available.");
        else {// overnight case
            require(endMinute + 1440 - earliestTimeInMinutes <= minutesAvailable,
                "Time not available.");
        }

        uint256 timestamp = DateTime.timestampFromDateTime(_year, _month, _day, _hour, _minute, 0);
        require(timestamp > block.timestamp, "Cannot book meeting in the past");

        require(availableDays[DateTime.getDayOfWeek(timestamp) - 1], "Day not available.");

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
                attendee : msg.sender,
                hour : _hour,
                minute : _minute,
                duration : _duration
            })
        );

        emit MeetingBooked(msg.sender, _year, _month, _day, _hour, _minute, _duration);
    }

    /// @notice Checks if a meeting collides with a meeting on the previous day.
    /// @param _year Year the meeting starts.
    /// @param _month Month the meeting starts.
    /// @param _day Day the meeting starts.
    /// @param _startMinute Minute the meeting starts.
    /// @param _duration Duration of the meeting in minutes.
    function _checkDay(uint256 _year, uint256 _month, uint256 _day, uint16 _startMinute, uint16 _duration) internal view {
        // Compare existing meetings on the same day for collisions
        for (uint256 i = 0; i < dateToMeetings[_year][_month][_day].length; i++) {
            Meeting memory other = dateToMeetings[_year][_month][_day][i];

            uint16 otherStartMinute = other.hour * 60 + other.minute;
            uint16 otherEndMinute = otherStartMinute + other.duration;

            // check if the other meeting ends before the new meeting starts
            // or if the new meeting ends before the other meeting starts
            require(otherEndMinute <= _startMinute
                || _startMinute + _duration <= otherStartMinute,
                "Overlap with existing meeting."
            );
        }
    }

    /// @notice Checks if a meeting collides with a meeting on the previous day.
    /// @param _startMinute Minute the meeting starts.
    /// @param _days The number of days after day 0 (1970/01/01).
    function _checkPrevDay(uint16 _startMinute, uint256 _days) internal view {
        (uint256 prevYear, uint256 prevMonth, uint256 prevDay) = DateTime._daysToDate(_days - 1);

        for (uint256 i = 0; i < dateToMeetings[prevYear][prevMonth][prevDay].length; i++) {
            Meeting memory other = dateToMeetings[prevYear][prevMonth][prevDay][i];

            uint16 otherEndMinute = other.hour * 60 + other.minute + other.duration;

            // check if the other meeting ends before the new one starts
            require(otherEndMinute <= _startMinute,
                "Overlap with existing meeting on previous day.");
        }
    }

    /// @notice Checks if a meeting collides with a meeting on the next day.
    /// @param _endMinute Minute the meeting ends.
    /// @param _days The number of days after day 0 (1970/01/01).
    function _checkNextDay(uint16 _endMinute, uint256 _days) internal view {
        (uint256 nextYear, uint256 nextMonth, uint256 nextDay) = DateTime._daysToDate(_days + 1);

        for (uint256 i = 0; i < dateToMeetings[nextYear][nextMonth][nextDay].length; i++) {
            Meeting memory other = dateToMeetings[nextYear][nextMonth][nextDay][i];

            uint16 otherStartMinute = other.hour * 60 + other.minute;

            // check if the other meeting ends before the new one starts
            require(_endMinute <= otherStartMinute,
                "Overlap with existing meeting on next day.");
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

        require(msg.sender == dateToMeetings[_year][_month][_day][_arrayPosition].attendee,
            "You cannot cancel a meeting that you have not booked yourself.");

        emit MeetingCancelled(
            msg.sender, _year, _month, _day,
            dateToMeetings[_year][_month][_day][_arrayPosition].hour,
            dateToMeetings[_year][_month][_day][_arrayPosition].minute,
            dateToMeetings[_year][_month][_day][_arrayPosition].duration
        );

        // remove element by overwriting it with the last element
        dateToMeetings[_year][_month][_day][_arrayPosition] = dateToMeetings[_year][_month][_day][length - 1];
        dateToMeetings[_year][_month][_day].pop();
    }
}