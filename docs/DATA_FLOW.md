# Data Flow

This document describes the intended data flow of the experimental-functional branch.

The application should work as a clear transformation pipeline.

## Main Flow

PGN input  
→ parsed PGN  
→ chess move model  
→ mnemonic model  
→ story model  
→ export model  
→ UI view model  
→ rendered interface

## Step 1: PGN Input

The user provides a PGN game or a SAN move list.

The PGN domain is responsible for reading, normalizing and extracting the useful game data.

## Step 2: Chess Model

The chess domain converts parsed moves into a structured chess model.

This includes:

- SAN notation
- move number
- fullmove index
- piece information
- source and target squares where available
- move classification

## Step 3: Mnemonic Model

The mnemonic domain converts chess data into mnemonic data.

This includes:

- time loci
- space loci
- character links
- associations
- shortnames
- PAO rows

## Step 4: Story Model

The story domain converts mnemonic data into narrative material.

This includes SAN-to-text and Epic Story output.

## Step 5: Export Model

The export domain prepares data for downloadable formats.

This may include CSV, JSON, TXT and ZIP exports.

## Step 6: UI View Model

The UI receives prepared data.

The UI should not calculate chess or mnemonic logic.

It should only render the data and handle user interaction.

## Core Rule

Data should move forward through the pipeline.

Each step should receive input, transform it, and return output.

Avoid hidden global mutations.