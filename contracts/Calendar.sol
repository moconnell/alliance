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
        CalendarLib.Time calldata _availableStartTime,
        uint16 _durationInMinutes
    ) external initializer
    {
        owner = _owner;
        emailAddress = _emailAddress;
        availableDays = _availableDays;
        earliestStartMinute = CalendarLib.timeToMinuteOfDay(_availableStartTime);
        latestEndMinute = earliestStartMinute + _durationInMinutes;
    }

    function setAvailableDays(bool[7] memory _availableDays) external onlyOwner {
        availableDays = _availableDays;
    }

    function changeAvailableTimes(CalendarLib.Time calldata _start, uint16 _durationInMinutes) external onlyOwner {
        earliestStartMinute = CalendarLib.timeToMinuteOfDay(_start);
        latestEndMinute = earliestStartMinute + _durationInMinutes;
    }

    function bookMeeting(
        uint256 _year,
        uint256 _month,
        uint256 _day,
        CalendarLib.Time calldata _start,
        uint16 _durationInMinutes
    ) public {
        require(msg.sender != owner, "You cannot book a meeting with yourself.");

        uint16 startMinute = CalendarLib.timeToMinuteOfDay(_start);
        uint16 endMinute = startMinute + _durationInMinutes;

        require(earliestStartMinute <= startMinute
            && endMinute <= latestEndMinute, "Time not available.");

        uint256 timestamp = DateTime.timestampFromDateTime(_year, _month, _day, _start.hour, _start.minute, 0);
        require(timestamp > block.timestamp, "Cannot book meeting in the past");

        require(availableDays[DateTime.getDayOfWeek(timestamp) - 1], "Day not available.");

        // Compare existing events for collisions
        for (uint256 i = 0; i < dateToMeetings[_year][_month][_day].length; i++) {
            CalendarLib.Meeting memory other = dateToMeetings[_year][_month][_day][i];

            // TODO Collision might come from the day before

            uint16 otherStartMinute = other.start.hour * 60 + other.start.minute;
            uint16 otherEndMinute = otherStartMinute + other.durationInMinutes;

            //TODO check if nested mapping call is more gas efficient than memory struct

            require(otherEndMinute <= startMinute
                || endMinute <= otherStartMinute,
                "Overlap with existing meeting."
            );
        }

        // push
        dateToMeetings[_year][_month][_day].push(
            CalendarLib.Meeting({
        attendee : msg.sender,
        start : _start,
        durationInMinutes : _durationInMinutes
        })
        );

        emit CalendarLib.MeetingBooked(
            msg.sender, _year, _month, _day,
            _start.hour, _start.minute,
            _durationInMinutes
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
        CalendarLib.Time memory start = dateToMeetings[_year][_month][_day][_arrayPosition].start;
        uint16 duration = dateToMeetings[_year][_month][_day][_arrayPosition].durationInMinutes;

        // remove element by overwriting it with the last element
        dateToMeetings[_year][_month][_day][_arrayPosition] = dateToMeetings[_year][_month][_day][length - 1];
        dateToMeetings[_year][_month][_day].pop();

        //TODO if meeting over night

        emit CalendarLib.MeetingCancelled(msg.sender, _year, _month, _day, start.hour, start.minute, duration);
    }
}