// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";

/// @title A custom ownable implementation.
/// @notice Provides a function modifier that allows only the owner to execute the function.
/// @dev A custom implementation is used here (in contrast to OpenZepplin) to allow clones to be ownable.
abstract contract CustomOwnable is ContextUpgradeable {
  /// @notice Address of the owner.
  address public owner;

  /// @dev Throws if called by any account other than the owner.
  modifier onlyOwner() {
    require(owner == _msgSender(), "Caller is not the owner.");
    _;
  }
}
