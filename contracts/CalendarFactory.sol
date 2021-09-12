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
    /// @param id The ID of the calendar
    event CalendarCreated(
        address indexed calendar,
        address indexed owner,
        uint256 id
    );

    /// @notice Emitted when a new calendar is removed.
    /// @param calendar The address of the calendar.
    /// @param owner The address of the calendar owner.
    /// @param id The ID of the calendar.
    event CalendarRemoved(
        address indexed calendar,
        address indexed owner,
        uint256 id
    );

    /// @dev Contains the calendar implementation that is cloned.
    address calendarImplementation;

    /// @notice Counts the calendars that have been created.
    /// @dev This is used to determines the calendar IDs.
    uint256 public calendarCount = 0;

    /// @notice Maps the user addresses to an array of calendar IDs.
    mapping(address => uint256[]) public userToCalendarIds;

    /// @notice Maps calendar IDs to calendar addresses.
    mapping(uint256 => address) public calendarIdToCalendar;

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
    /// @return Returns the ID of the created calendar.
    function createCalendar(
        string memory _emailAddress,
        bool[7] memory _availableDays,
        uint16 _earliestHour,
        uint16 _earliestMinute,
        uint16 _minutesAvailable
    ) external returns (uint256){
        require(_earliestHour < 24, "The start hour must be less than 24.");
        require(_earliestMinute < 60, "The start hour must be less than 60.");
        require(_minutesAvailable <= 1440, "The duration must be less than 24h.");
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

        uint256 id = calendarCount;
        calendarCount++;

        calendarIdToCalendar[id] = clone;
        userToCalendarIds[msg.sender].push(id);

        emit CalendarCreated(clone, msg.sender, id);

        return id;
    }

    /// @notice Removes a calendar by its id.
    /// @dev Overwrite the calendar to be deleted with the last calendar in the array and then uses `pop()`.
    /// @param id ID of the calendar to be removed.
    function remove(uint256 id) external {
        require(id < calendarCount, "Calendar does not exist.");

        // Find calendar in the senders calendar array.
        uint256 i = 0;
        uint256 length = userToCalendarIds[msg.sender].length;
        while (i < length) {
            if (userToCalendarIds[msg.sender][i] == id) break;
            i++;
        }
        require(i < length, "Calendar is not owned by you.");

        // Overwrite the calendar to be deleted with the last calendar in the array.
        userToCalendarIds[msg.sender][i] = userToCalendarIds[msg.sender][length - 1];

        // `pop()` the last calendar.
        userToCalendarIds[msg.sender].pop();

        emit CalendarRemoved(calendarIdToCalendar[id], msg.sender, id);

        // Delete address from the ID to calendar mapping.
        calendarIdToCalendar[id] = address(0);
    }
}