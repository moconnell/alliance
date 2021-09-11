// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./CalendarStorage.sol";
import "./CalendarLib.sol";
import "./DateTime.sol";

import "hardhat/console.sol";

contract Calendar is CalendarStorage, Initializable {
    modifier onlyOwner() {
        require(owner == msg.sender, "Caller is not the owner.");
        _;
    }

    function initialize(
        address _owner,
        string memory _emailAddress,
        bool[7] memory _availableDays,
        uint16 _availableStartHour,
        uint16 _availableStartMinute,
        uint16 _minutesAvailable
    ) external initializer
    {
        owner = _owner;
        emailAddress = _emailAddress;
        availableDays = _availableDays;
        earliestStartMinute = _availableStartHour*60 + _availableStartMinute;
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
        earliestStartMinute = _availableStartHour*60 + _availableStartMinute;
        minutesAvailable = _durationInMinutes;
    }

    function bookMeeting(
        uint256 _year,
        uint256 _month,
        uint256 _day,
        uint16 _hour,
        uint16 _minute,
        uint16 _duration
    ) public {
        require(msg.sender != owner, "You cannot book a meeting with yourself.");

        uint16 startMinute = _hour * 60 + _minute;

        if (earliestStartMinute <= startMinute)
            require(_duration + (startMinute - earliestStartMinute) <= minutesAvailable,
                "Time not available.");
        else {// overnight case
            require(_duration + (startMinute + 1440 - earliestStartMinute) <= minutesAvailable,
                "Time not available.");
        }

        uint256 timestamp = DateTime.timestampFromDateTime(_year, _month, _day, _hour, _minute, 0);
        require(timestamp > block.timestamp, "Cannot book meeting in the past");

        require(availableDays[DateTime.getDayOfWeek(timestamp) - 1], "Day not available.");

        // Compare existing events for collisions
        for (uint256 i = 0; i < dateToMeetings[_year][_month][_day].length; i++) {
            CalendarLib.Meeting memory other = dateToMeetings[_year][_month][_day][i];

            uint16 otherStartMinute = other.hour * 60 + other.minute;
            uint16 otherEndMinute = otherStartMinute + other.duration;

            require(otherEndMinute <= startMinute
                || startMinute + _duration <= otherStartMinute,
                "Overlap with existing meeting."
            );
        }

        // check also the previous day
        (uint256 prevYear, uint256 prevMonth, uint256 prevDay)
        = DateTime._daysToDate(DateTime._daysFromDate(_year, _month, _day) - 1);

        for (uint256 i = 0; i < dateToMeetings[prevYear][prevMonth][prevDay].length; i++) {
            CalendarLib.Meeting memory other = dateToMeetings[prevYear][prevMonth][prevDay][i];

            //uint16 otherStartMinute = other.hour * 60 + other.minute;
            //uint16 otherEndMinute = otherStartMinute + other.duration;
            uint16 otherEndMinute = other.hour * 60 + other.minute + other.duration;

            require(otherEndMinute <= startMinute,
                "Overlap with existing meeting on previous day.");
        }

        // push
        dateToMeetings[_year][_month][_day].push(
            CalendarLib.Meeting({
                attendee : msg.sender,
                hour : _hour,
                minute : _minute,
                duration : _duration
            })
        );

        emit CalendarLib.MeetingBooked(
            msg.sender, _year, _month, _day,
            _hour, _minute,
            _duration
        );
    }

    function getMeetings(
        uint256 _year,
        uint256 _month,
        uint256 _day
    ) public view returns (CalendarLib.Meeting[] memory) {
        return dateToMeetings[_year][_month][_day];
    }

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

        // only to emit event
        uint16 startHour = dateToMeetings[_year][_month][_day][_arrayPosition].hour;
        uint16 startMinute = dateToMeetings[_year][_month][_day][_arrayPosition].minute;
        uint16 duration = dateToMeetings[_year][_month][_day][_arrayPosition].duration;

        // remove element by overwriting it with the last element
        dateToMeetings[_year][_month][_day][_arrayPosition] = dateToMeetings[_year][_month][_day][length - 1];
        dateToMeetings[_year][_month][_day].pop();

        emit CalendarLib.MeetingCancelled(msg.sender, _year, _month, _day, startHour, startMinute, duration);
    }
}