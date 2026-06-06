#!/usr/bin/env python3
"""
Simple Banking App - Account management with transactions
"""

import json
import os
from datetime import datetime
from typing import Optional, List, Dict


class BankAccount:
    def __init__(self, account_number: str, account_holder: str, initial_balance: float = 0.0):
        self.account_number = account_number
        self.account_holder = account_holder
        self.balance = initial_balance
        self.transactions: List[Dict] = []
        
        if initial_balance > 0:
            self.transactions.append({
                "timestamp": datetime.now().isoformat(),
                "type": "initial_deposit",
                "amount": initial_balance,
                "balance_after": self.balance
            })
    
    def deposit(self, amount: float) -> bool:
        """Deposit money into account"""
        if amount <= 0:
            print(f"[ERROR] Invalid deposit amount: ${amount}")
            return False
        
        self.balance += amount
        self.transactions.append({
            "timestamp": datetime.now().isoformat(),
            "type": "deposit",
            "amount": amount,
            "balance_after": self.balance
        })
        print(f"[OK] Deposited ${amount:.2f}. New balance: ${self.balance:.2f}")
        return True
    
    def withdraw(self, amount: float) -> bool:
        """Withdraw money from account"""
        if amount <= 0:
            print(f"[ERROR] Invalid withdrawal amount: ${amount}")
            return False
        
        if amount > self.balance:
            print(f"[ERROR] Insufficient funds. Current balance: ${self.balance:.2f}")
            return False
        
        self.balance -= amount
        self.transactions.append({
            "timestamp": datetime.now().isoformat(),
            "type": "withdrawal",
            "amount": amount,
            "balance_after": self.balance
        })
        print(f"[OK] Withdrew ${amount:.2f}. New balance: ${self.balance:.2f}")
        return True
    
    def transfer(self, recipient_account: 'BankAccount', amount: float) -> bool:
        """Transfer money to another account"""
        if amount <= 0:
            print(f"[ERROR] Invalid transfer amount: ${amount}")
            return False
        
        if amount > self.balance:
            print(f"[ERROR] Insufficient funds for transfer. Current balance: ${self.balance:.2f}")
            return False
        
        self.balance -= amount
        recipient_account.balance += amount
        
        self.transactions.append({
            "timestamp": datetime.now().isoformat(),
            "type": "transfer_out",
            "amount": amount,
            "recipient": recipient_account.account_holder,
            "balance_after": self.balance
        })
        
        recipient_account.transactions.append({
            "timestamp": datetime.now().isoformat(),
            "type": "transfer_in",
            "amount": amount,
            "sender": self.account_holder,
            "balance_after": recipient_account.balance
        })
        
        print(f"[OK] Transferred ${amount:.2f} to {recipient_account.account_holder}. Your new balance: ${self.balance:.2f}")
        return True
    
    def get_balance(self) -> float:
        """Get current account balance"""
        return self.balance
    
    def get_statement(self, limit: int = 10) -> None:
        """Print recent transactions"""
        print(f"\n[STATEMENT] Account - {self.account_holder}")
        print(f"Account Number: {self.account_number}")
        print(f"Current Balance: ${self.balance:.2f}")
        print(f"\nRecent Transactions (last {limit}):")
        print("-" * 70)
        
        recent = self.transactions[-limit:] if len(self.transactions) > limit else self.transactions
        
        for txn in recent:
            timestamp = txn["timestamp"].split("T")[1][:5]  # HH:MM only
            txn_type = txn["type"].upper()
            amount = txn["amount"]
            balance = txn["balance_after"]
            print(f"{timestamp} | {txn_type:15} | ${amount:8.2f} | Balance: ${balance:.2f}")
        print("-" * 70 + "\n")


class Bank:
    def __init__(self, bank_name: str):
        self.bank_name = bank_name
        self.accounts: Dict[str, BankAccount] = {}
    
    def create_account(self, account_number: str, account_holder: str, initial_balance: float = 0.0) -> BankAccount:
        """Create a new bank account"""
        if account_number in self.accounts:
            print(f"[ERROR] Account {account_number} already exists")
            return None
        
        account = BankAccount(account_number, account_holder, initial_balance)
        self.accounts[account_number] = account
        print(f"[OK] Account created: {account_holder} ({account_number})")
        return account
    
    def get_account(self, account_number: str) -> Optional[BankAccount]:
        """Retrieve an account by number"""
        return self.accounts.get(account_number)
    
    def list_accounts(self) -> None:
        """List all accounts"""
        print(f"\n[BANK] {self.bank_name} - All Accounts")
        print("-" * 50)
        if not self.accounts:
            print("No accounts found")
        else:
            for num, account in self.accounts.items():
                print(f"{num} | {account.account_holder:20} | ${account.balance:.2f}")
        print("-" * 50 + "\n")


def main():
    """Demo the banking app"""
    print("[BANK] Welcome to Python Banking App\n")
    
    # Create bank and accounts
    bank = Bank("First National Python Bank")
    
    acc1 = bank.create_account("1001", "Angela Hudson", 5000.00)
    acc2 = bank.create_account("1002", "Jaxon Smith", 2500.00)
    acc3 = bank.create_account("1003", "Sarah Davis", 7500.00)
    
    print()
    
    # Demo transactions
    print("--- Transactions ---\n")
    
    acc1.deposit(1000.00)
    acc1.withdraw(500.00)
    acc2.deposit(250.00)
    
    print()
    acc1.transfer(acc2, 300.00)
    print()
    
    acc3.transfer(acc1, 1500.00)
    print()
    
    # Show statements
    acc1.get_statement(10)
    acc2.get_statement(10)
    
    # Show all accounts
    bank.list_accounts()


if __name__ == "__main__":
    main()
