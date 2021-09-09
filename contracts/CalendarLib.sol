// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library CalendarLib {
    struct Meeting {
        address attendee;   // 32 bytes
        Time start;         // 2 bytes
        Time end;           // 2 bytes
    }

    struct Time {
        uint8 hour;     // 1 byte
        uint8 minute;   // 1 byte
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
        if (a.hour >= b.hour) {
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
        if (a.hour <= b.hour) {
            return true;
        } else if (a.hour == b.hour) {
            return a.minute <= b.minute;
        } else return false;
    }

    function isInbetween(Time calldata time, Time calldata a, Time calldata b) public view returns (bool){
        return isLess(a, time) && isLess(time, b);
    }

    function differenceInMinutes(Time calldata a, Time calldata b) public pure returns (uint256){
        require(isGreater(a, b));
        return (a.hour - b.hour) * 60 + a.minute - b.minute;
    }
}