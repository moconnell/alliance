// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./CalendarStorage.sol";
import "./CalendarLib.sol";
import "./DateTime.sol";


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
        CalendarLib.Time calldata _availableEndTime
    ) external initializer
    {
        owner = _owner;
        emailAddress = _emailAddress;
        availableDays = _availableDays;
        availableStart = _availableStartTime;
        availableEnd = _availableEndTime;
    }

    function setAvailableDays(bool[7] memory _availableDays) external onlyOwner {
        availableDays = _availableDays;
    }

    function changeAvailableTimes(CalendarLib.Time calldata _start, CalendarLib.Time calldata _end) external onlyOwner {
        require(CalendarLib.isLess(_start, _end), "The start must be earlier than the end.");
        availableStart = _start;
        availableEnd = _end;
    }

    function bookMeeting(
        uint256 _year,
        uint256 _month,
        uint256 _day,
        CalendarLib.Time calldata _start,
        CalendarLib.Time calldata _end
    ) external {
        require(CalendarLib.isLess(_start, _end), "The time of start must be earlier than the end.");

        require(msg.sender != owner, "You cannot book a meeting with yourself.");
        require(CalendarLib.isInbetween(_start, availableStart, availableEnd)
            && CalendarLib.isInbetween(_end, availableStart, availableEnd), "Time not available.");

        uint256 timestamp = DateTime.timestampFromDateTime(_year, _month, _day, _start.hour, _start.minute, 59);
        require(timestamp > block.timestamp, "Cant book in past");
        require(availableDays[DateTime.getDayOfWeek(timestamp) - 1], "Day not available.");

        // Compare existing events for collisions
        for (uint i = 0; i < dateToMeetings[_year][_month][_day].length; i++) {

            // Require the new meeting to have no overlap with meeting i
            if (!CalendarLib.isGreaterOrEqual(_start, dateToMeetings[_year][_month][_day][i].end)) {   //          |s..e| <= |s'..
                require(CalendarLib.isLessOrEqual(_end, dateToMeetings[_year][_month][_day][i].start), // ..e'| <= |s..e|
                    "Overlap with existing event."
                );
            }
        }

        //No time collision
        dateToMeetings[_year][_month][_day].push(
            CalendarLib.Meeting({attendee : msg.sender, start : _start, end : _end})
        );

        emit CalendarLib.MeetingBooked(
            msg.sender, _year, _month, _day,
            _start.hour, _start.minute,
            _end.hour, _end.minute
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
        CalendarLib.Time calldata _start,
        CalendarLib.Time calldata _end
    ) external {

        // search for the meeting position in the meetings array
        uint256 i = 0;
        uint256 length = dateToMeetings[_year][_month][_day].length;
        while (i < length) {

            if (msg.sender == dateToMeetings[_year][_month][_day][i].attendee
            && CalendarLib.isEqual(_start, dateToMeetings[_year][_month][_day][i].start)
            && CalendarLib.isEqual(_end, dateToMeetings[_year][_month][_day][i].end)
            ) {
                break;
            }
            i++;
        }

        require(i != length, "Meeting not found.");

        // remove element by overwriting it with the last element
        dateToMeetings[_year][_month][_day][i] = dateToMeetings[_year][_month][_day][length - 1];
        dateToMeetings[_year][_month][_day].pop();

        emit CalendarLib.MeetingCancelled(msg.sender, _year, _month, _day, _start.hour, _start.minute, _end.hour, _end.minute);
    }
}