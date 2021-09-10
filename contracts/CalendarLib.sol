// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library CalendarLib {
    struct Meeting {
        address attendee;   // 32 bytes
        Time start;         // 2 bytes
        uint16 durationInMinutes;    // 2 bytes
        //Time end;           // 2 bytes
    }

    event MeetingBooked(
        address indexed _attendee,
        uint256 year, uint256 month, uint256 day,
        uint256 startHour, uint256 startMinute,
        uint16 durationInMinutes
    );

    event MeetingCancelled(
        address indexed _attendee,
        uint256 year, uint256 month, uint256 day,
        uint256 startHour, uint256 startMinute,
        uint16 durationInMinutes
    );

    struct Time {
        uint16 hour;     // 1 byte
        uint16 minute;   // 1 byte
    }

    function isEqual(Time calldata a, Time calldata b) public pure returns (bool){
        return a.hour == b.hour && a.minute == b.minute;
    }

    function isGreater(Time calldata a, Time calldata b) public pure returns (bool){
        if (a.hour > b.hour) {
            return true;
        } else if (a.hour == b.hour) {
            return a.minute > b.minute;
        } else return false;
    }

    function isGreaterOrEqual(Time calldata a, Time calldata b) public pure returns (bool){
        if (a.hour > b.hour) {
            return true;
        } else if (a.hour == b.hour) {
            return a.minute >= b.minute;
        } else return false;
    }

    function isLess(Time calldata a, Time calldata b) public pure returns (bool){
        if (a.hour < b.hour) {
            return true;
        } else if (a.hour == b.hour) {
            return a.minute < b.minute;
        } else return false;
    }

    function isLessOrEqual(Time calldata a, Time calldata b) public pure returns (bool){
        if (a.hour < b.hour) {
            return true;
        } else if (a.hour == b.hour) {
            return a.minute <= b.minute;
        } else return false;
    }

    function isInbetween(Time calldata time, Time calldata a, Time calldata b) public pure returns (bool){
        return isLessOrEqual(a, time) && isLessOrEqual(time, b);
    }

    function isLooselyInbetween(Time calldata time, Time calldata a, Time calldata b) public pure returns (bool){
        return isLess(a, time) && isLess(time, b);
    }

    function timeDifferenceToMinutes(Time calldata a, Time calldata b) public pure returns (uint16){
        require(isGreater(a, b));
        return (a.hour - b.hour) * 60 + a.minute - b.minute;
    }

    function timeToMinuteOfDay(Time calldata a) public pure returns (uint16) {
        return a.hour * 60 + a.minute;
    }

    function timeDifferenceFromMinutes(Time calldata a, uint16 timeDifference) public pure returns (Time memory){
        uint8 hour = uint8(timeDifference / 60);
        uint8 minute = uint8(timeDifference % 60);

        if(a.minute + minute >= 60){
            hour += 1;
            minute -= 60;
        }

        if(a.hour + hour >= 24)
            hour -= 24;

        return Time({hour: hour, minute: minute});
    }

}