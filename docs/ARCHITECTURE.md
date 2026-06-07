# Functional Domain-Based Architecture

This branch is an experimental functional rebuild of the Chess Mnemonic Application.

The goal is to preserve the existing user-facing behavior while reorganizing the application around a clean functional, domain-based structure.

## Architecture Type

This branch follows a Functional Domain-Based Architecture.

The application is organized by responsibility, not by file type.

Instead of treating the project as a storage room of JavaScript files, the application is structured like an organization with departments.

Each department has a clear role.

## Main Principle

Functional core, minimal imperative shell.

The core logic should transform data without directly touching the DOM.

The UI should display already prepared data and handle user interaction.

## Main Flow

PGN input  
→ PGN domain  
→ Chess domain  
→ Mnemonic domain  
→ Story / Export domains  
→ UI rendering

## Main Departments

- app: application startup, configuration and lifecycle
- domains: core business logic
- warehouse: stable source material and constants
- pipelines: connects the processing steps
- state: single source of truth
- ui: rendering and user interaction
- services: browser, files, storage and downloads
- shared: generic utilities
- legacy: documentation of the old structure and migration decisions

## Core Rule

Domains must not directly touch the DOM.

UI must not perform mnemonic calculations.

Warehouse stores stable material but does not contain business logic.

Pipelines connect the departments but should not hide complex logic.