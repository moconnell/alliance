// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import "./Calendar.sol";

/// @title Calendar Factory
/// @notice The factory deploys and removes calendars and manages assigns their ownership.
/// @dev The factory uses OpenZepplin minimal clones to save gas.
contract CalendarFactory {
    /// @notice Emitted when a new calendar is created.
    /// @param calendar The address of the calendar.
    /// @param owner The address of the calendar owner.
    event CalendarCreated(
        address indexed calendar,
        address indexed owner
    );

    /// @notice Emitted when a new calendar is removed.
    /// @param calendar The address of the calendar.
    /// @param owner The address of the calendar owner.
    event CalendarRemoved(
        address indexed calendar,
        address indexed owner
    );

    /// @dev Contains the calendar implementation that is cloned.
    address private calendarImplementation;

    /// @notice Maps between user and calendar addresses.
    mapping(address => address) public userToCalendar;

    /// @notice Factory constructor.
    /// @dev This creates the original calendar implementation from which all other calendars are cloned.
    constructor() {
        calendarImplementation = address(new Calendar());
    }

    /// @notice Creates a new calendar.
    /// @dev Populates the `userToCalendarIds` and `calendarIdToCalendar` mappings.
    /// @param _emailAddress The email address of the calendar owner.
    /// @param _availableDays A fixed-size array of type `bool` and length `7` specifying on which days meetings can be booked.
    /// @param _earliestHour An hour between 0 and 23 at which the earliest meeting can start.
    /// @param _earliestMinute A minute between 0 and 59 at which the earliest meeting can start.
    /// @param _minutesAvailable The availablilty in minutes starting at the earliest time in which meetings can be booked.
    function createCalendar(
        string memory _emailAddress,
        bool[7] memory _availableDays,
        uint16 _earliestHour,
        uint16 _earliestMinute,
        uint16 _minutesAvailable
    ) external {
        require(_earliestHour < 24, "Earliest hour > 23");
        require(_earliestMinute < 60, "Earliest minute > 59");
        require(_minutesAvailable <= 1440, "Minutes available > 24h");
        // 60min/h * 24h = 1440 min

        address clone = ClonesUpgradeable.clone(calendarImplementation);

        Calendar(clone).initialize(
            msg.sender,
            _emailAddress,
            _availableDays,
            _earliestHour,
            _earliestMinute,
            _minutesAvailable
        );

        userToCalendar[msg.sender] = clone;
        emit CalendarCreated(clone, msg.sender);
    }

    /// @notice Remove the calendar
    function remove() external {
        require(userToCalendar[msg.sender] != address(0), "Calendar does not exist.");

        emit CalendarRemoved(address(this), msg.sender);
        userToCalendar[msg.sender] = address(0);
    }
}