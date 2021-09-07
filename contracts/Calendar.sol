// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./DateTime.sol";


contract Calendar is Ownable, Initializable {

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
    string private emailAddress;
    mapping(Day => bool) public availableDays;
    uint256 public availableStartTime;
    uint256 public availableEndTime;
    uint256 public duration;

    mapping(uint256 => address) public meetingSchedule;

    event MeetingBooked(
        address indexed _attendee,
        uint256 _meetingDatetime
    );

    event MeetingCancelled(
        address indexed _attendee,
        uint256 _meetingDatetime
    );

    function initialize(
        int8 _timezone,
        string memory _emailAddress,
        address _newOwner,
        Day[] memory _availableDays,
        uint256 _availableStartTime,
        uint256 _availableEndTime,
        uint256 _duration
    ) external initializer
    {
        timezone = _timezone;
        emailAddress = _emailAddress;

        for (uint i = 0; i < _availableDays.length; i++) {
            availableDays[_availableDays[i]] = true;
        }

        availableStartTime = _availableStartTime;
        availableEndTime = _availableEndTime;
        duration = _duration;

        transferOwnership(_newOwner);
    }

    function bookMeeting(uint256 _datetime) external {
        (, , , uint256 hr, uint256 min, ) = DateTime.timestampToDateTime(_datetime);
        uint256 formattedTime = (hr * 100) + min;
        require(formattedTime >= availableStartTime, "bookMeeting::cant book before start time.");
        require(formattedTime < availableEndTime, "bookMeeting::cant book after end time.");
        require(meetingSchedule[_datetime] == address(0), "bookMeeting::time already booked."); 
        require(_datetime > block.timestamp, "bookMeeting::cant book in past");

        Day day = Day(
            DateTime.getDayOfWeek(_datetime) - 1
        );

        require(availableDays[day], "bookMeeting::day unavailable");

        meetingSchedule[_datetime] = msg.sender;

        emit MeetingBooked(msg.sender, _datetime);
    }

    function cancelMeeting(uint256 _datetime) external {
        require(meetingSchedule[_datetime] == msg.sender, "cancelMeeting::cant cancel meeting that isnt yours."); 
        meetingSchedule[_datetime] = address(0);

        emit MeetingCancelled(msg.sender, _datetime);
    }

}