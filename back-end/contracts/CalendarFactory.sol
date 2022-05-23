// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import "./Calendar.sol";
import "./CalendarStorage.sol";
import "./CalendarTypes.sol";

/// @title Calendar Factory
/// @notice The factory deploys and removes calendars and manages assigns their ownership.
/// @dev The factory uses OpenZepplin minimal clones to save gas.
contract CalendarFactory {
  uint256 private constant MINUTES_PER_DAY = 24 * 60;

  /// @notice Emitted when a new calendar is created.
  /// @param calendar The address of the calendar.
  /// @param owner The address of the calendar owner.
  event CalendarCreated(address indexed calendar, address indexed owner);

  /// @notice Emitted when a new calendar is removed.
  /// @param calendar The address of the calendar.
  /// @param owner The address of the calendar owner.
  event CalendarRemoved(address indexed calendar, address indexed owner);

  /// @dev Contains the calendar implementation that is cloned.
  address private immutable calendarImplementation;

  /// @notice Maps between user and calendar addresses.
  mapping(address => address) public userToCalendar;

  /// @notice Factory constructor.
  /// @dev This creates the original calendar implementation from which all other calendars are cloned.
  constructor() {
    calendarImplementation = address(new Calendar());
  }

  /// @notice Creates a new calendar.
  /// @dev Populates the `userToCalendarIds` and `calendarIdToCalendar` mappings.
  /// @param _profile The profile of the calendar owner.
  /// @param _availability The availability of the calendar owner.
  function createCalendar(
    CalendarTypes.Profile calldata _profile,
    CalendarTypes.Availability calldata _availability
  ) external {
    require(
      _availability.earliestStartMinutes < MINUTES_PER_DAY,
      "earliestStartMinutes > 24h"
    );
    require(
      _availability.minutesAvailable <= MINUTES_PER_DAY,
      "Minutes available > 24h"
    );

    address clone = ClonesUpgradeable.clone(calendarImplementation);

    userToCalendar[msg.sender] = clone;
    emit CalendarCreated(clone, msg.sender);

    Calendar(clone).initialize(msg.sender, _profile, _availability);
  }

  /// @notice Remove the calendar
  function remove() external {
    require(
      userToCalendar[msg.sender] != address(0),
      "Calendar does not exist."
    );

    emit CalendarRemoved(address(this), msg.sender);
    userToCalendar[msg.sender] = address(0);
  }
}
