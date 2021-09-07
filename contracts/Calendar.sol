// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./DateTime.sol";


contract Calendar is Initializable {
    address owner;

    enum Day {
        MONDAY,
        TUESDAY,
        WEDNESDAY,
        THURSDAY,
        FRIDAY,
        SATURDAY,
        SUNDAY
    }

    int8 public timezone;
    string public emailAddress;
    mapping(Day => bool) public availableDays;
    uint256 public availableStartTime;
    uint256 public availableEndTime;
    uint256 public duration;

    mapping(uint256 => address) public meetingSchedule;

    event MeetingBooked(
        address indexed _attendee,
        uint256 _meetingTimestamp
    );

    event MeetingCancelled(
        address indexed _attendee,
        uint256 _meetingTimestamp
    );

    function initialize(
        int8 _timezone,
        string memory _emailAddress,
        address _owner,
        Day[] memory _availableDays,
        uint256 _availableStartTime,
        uint256 _availableEndTime,
        uint256 _duration
    ) external initializer
    {
        timezone = _timezone;
        emailAddress = _emailAddress;
        owner = _owner;

        for (uint i = 0; i < _availableDays.length; i++) {
            availableDays[_availableDays[i]] = true;
        }

        availableStartTime = _availableStartTime;
        availableEndTime = _availableEndTime;
        duration = _duration;
    }

    function bookMeeting(uint256 _timestamp) external {
        (, , , uint256 hr, uint256 min, ) = DateTime.timestampToDateTime(_timestamp);
        uint256 formattedTime = (hr * 100) + min;
        require(formattedTime >= availableStartTime, "bookMeeting::cant book before start time.");
        require(formattedTime < availableEndTime, "bookMeeting::cant book after end time.");
        require(meetingSchedule[_timestamp] == address(0), "bookMeeting::time already booked.");
        require(_timestamp > block.timestamp, "bookMeeting::cant book in past");

        Day day = Day(
            DateTime.getDayOfWeek(_timestamp) - 1
        );

        require(availableDays[day], "bookMeeting::day unavailable");

        meetingSchedule[_timestamp] = msg.sender;

        emit MeetingBooked(msg.sender, _timestamp);
    }

    function cancelMeeting(uint256 _timestamp) external {
        require(meetingSchedule[_timestamp] == msg.sender, "cancelMeeting::cant cancel meeting that isnt yours.");
        meetingSchedule[_timestamp] = address(0);

        emit MeetingCancelled(msg.sender, _timestamp);
    }

}