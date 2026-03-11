# Timelocked Wallet | Clarity Smart Contract

![Stacks](https://img.shields.io/badge/Blockchain-Stacks-purple) 
![Clarity](https://img.shields.io/badge/Language-Clarity-blue)
![Testing](https://img.shields.io/badge/Testing-Vitest-green)

## 🚀 Overview
This repository contains a **Timelocked Wallet** smart contract developed for the **Stacks (Bitcoin L2)** ecosystem. 

As a **Systems Analyst** and **Data Science student**, I developed this project to explore the intersection of blockchain immutability and data transparency. The contract allows a user to lock STX tokens, which can only be claimed by a designated beneficiary after a specific Bitcoin block height is reached.

### Key Logic Features:
* **Access Control:** Only the contract owner can initialize the lock.
* **Integrity:** Once locked, parameters cannot be modified (Lógica Inmutable).
* **Validation:** Strict checks to prevent locking funds in the past or double-locking.
* **Event Logging:** Every transaction generates on-chain events, essential for future data auditing and analysis.

---

## 📊 Data Science & Blockchain Perspective
In my path to becoming a **Data Scientist**, I see Smart Contracts as high-quality data generators. This project focuses on:

1. **Provably Fair Logic:** Ensuring the "rules of the game" are public and verifiable.
2. **On-chain Auditing:** Using blockchain events (`stx_transfer_event`) to track capital flows without relying on centralized databases.
3. **Traceability:** Every state change is recorded, providing a clean dataset for behavioral analysis using **Python** or **Pandas**.



---

## 🛠 Technical Stack
* **Contract Language:** Clarity (Decidable language for Bitcoin L2).
* **Environment:** [Clarinet](https://github.com/hirosystems/clarinet).
* **Testing:** Unit tests written in **TypeScript** using **Vitest**.

---

## 🧪 Testing Suite
Reliability is my priority. The testing suite covers:
- **Success Paths:** Correct fund transfer to the contract and event emission.
- **Security Guards:** Ensuring the `err-owner-only` (u100) error triggers correctly.
- **Logic Constraints:** Validating `err-already-locked` (u101) and `err-unlock-in-past` (u102).

To run the tests, use the following command:
```bash
clarinet test
