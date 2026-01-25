# unobtrusive-logs

![Build job](https://github.com/nemocazin/unobtrusive-logs/actions/workflows/build.yaml/badge.svg)
![Test job](https://github.com/nemocazin/unobtrusive-logs/actions/workflows/test.yaml/badge.svg)

[![codecov](https://codecov.io/gh/nemocazin/unobtrusive-logs/graph/badge.svg?token=S3Q28YYMOF)](https://codecov.io/gh/nemocazin/unobtrusive-logs)

## Description

VS Code extension that adjusts the visual appearance of log statements in your code by controlling their opacity and color, making them less obtrusive while coding.

## Features

- Customizable opacity for log statements (0-100%)
- Configurable color for log statements
- Support Go, JavaScript, and TypeScript files (more languages coming soon)
- Simple commands for quick adjustments
- Compatible with [Syntax Gaslighting](https://github.com/eNiiju/syntax-gaslighting/tree/main)

## Usage

The extension is enabled by default when you open VS Code. It will apply the configured opacity and color settings to log statements in your code.

### Commands

- `unobtrusive-logs.changeOpacity`: Change the opacity level of log statements
- `unobtrusive-logs.changeColor`: Change the color of log statements

### Configuration

You can configure the extension in VS Code settings:

- `unobtrusive-logs.opacity`: Opacity level for logs (0 to 100, default: 50)
- `unobtrusive-logs.color`: Color used for logs (default: #808080)

## Contact

[Némo Cazin](https://github.com/nemocazin) 2026