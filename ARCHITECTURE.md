# ARCHITECTURE.md - CPU Emulator

This document outlines the architecture, layout, and implementation details of the CPU Emulator mini-project located within the /dev-tools/ directory.

---

## 1. Overview
The CPU Emulator is a web-based client-side application designed to visually simulate a basic Central Processing Unit (CPU) architecture. It allows users to write simple assembly-like instructions, execute them line by line, and observe real-time updates to CPU components including registers, the Program Counter (PC), the Instruction Register (IR), memory addresses, and status flags.

---

## 2. Technical Stack
The project relies on a minimal, vanilla frontend stack to ensure fast execution and broad compatibility without build dependencies:
* HTML5: Structure for the interactive control panel, code input editor, register tables, and system memory grid view.
* CSS3: Layout formatting and dynamic execution state coloring (highlighting active execution lines, state flags, and modified register statuses).
* JavaScript (ES6): Houses the instruction parser, memory management maps, register objects, execution controls, and UI DOM synchronization logic.

---

## 3. Directory Structure
projects/dev-tools/cpu-emulator/
├── index.html     # Application interface layout and visual panels
├── script.js      # Core instruction decoding loop and state management
└── style.css      # User interface theme styles and animation states

---

## 4. Architectural Core Components

### A. State Management & Data Components
The application encapsulates its operational hardware state inside a central JavaScript runtime object:
* Registers: A fixed set of general-purpose virtual storage spaces (e.g., ACC, R0, R1, R2).
* Program Counter (PC): Points directly to the index of the memory block containing the next instruction code line to execute.
* Memory Array: A finite sequence representation modeling RAM where variables or immediate instructions are located.
* Flags: Booleans representing system conditions like Zero (Z) or Sign/Negative (N) indicators updated post-ALU operations.

### B. Execution Loop Process Flow
The processor follows a traditional structural loop:
1. Fetch: Reads the string literal instruction at the index specified by the Program Counter.
2. Decode: Splits the instruction string into its constituent pieces: Opcode (Action) and Operands (Target registers, constants, or addresses).
3. Execute: Matches the decoded Opcode via a conditional switch matrix, executing arithmetic, value moving, or jump flow modifications.
4. Update UI: Reflects altered register rows, jumps PC highlights, and displays updated status flags dynamically to the user.

---

## 5. Supported Instruction Set Architecture (ISA)

The emulator supports standard operations including:
* MOV [Dest] [Src] - Copies value from source to destination register or sets a literal value.
* ADD [Reg] [Val] - Aggregates value into target register, updating status flags.
* SUB [Reg] [Val] - Subtracts value from target register, updating status flags.
* JMP [Line] - Updates Program Counter directly to create loops or branching scripts.
* JZ [Line] - Conditional execution branch targeting another line if Zero Flag is true.