# Changelog

## [1.1.1] - 2025-02-01

### Changed

- Modified the general regex to detect statements with multiple chained function calls (e.g., `log.error("test").format().time();`)
- Improved ESLint rules

### Added

- New icon for the extension (Thanks to @eNiiju)

## [1.1.0] - 2025-01-28

### Changed

- Renamed the command titles from `Logs` to `Unobtrusive Logs`

### Added

- Added support for `console.*` methods in JavaScript and TypeScript regexes
- Added general regex `log.*` used for every languages
- Added support for C++ logging: `std::cerr.*`, `std::cout.*`, `std::clog.*`, `cerr.*`, `cout.*`, and `clog.*`

## [1.0.1] - 2025-01-25

### Changed

- Renamed the command from `logs-opacity:*` to `unobtrusive-logs:*`

## [1.0.0] - 2025-01-25

### Added

- First public version
