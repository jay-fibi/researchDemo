#!/usr/bin/env python3
"""
Custom Database Implementation
A simple database system built from scratch in Python
"""

import json
import os
import pickle
from typing import Dict, List, Any, Optional, Union
from datetime import datetime
import uuid


class DatabaseError(Exception):
    """Custom exception for database operations"""
    pass


class Record:
    """Represents a single record/row in a table"""
    
    def __init__(self, data: Dict[str, Any], record_id: str = None):
        self.id = record_id or str(uuid.uuid4())
        self.data = data
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
    
    def update(self, data: Dict[str, Any]):
        """Update record data"""
        self.data.update(data)
        self.updated_at = datetime.now()
    
    def to_dict(self):
        """Convert record to dictionary"""
        return {
            'id': self.id,
            'data': self.data,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]):
        """Create record from dictionary"""
        record = cls(data['data'], data['id'])
        record.created_at = datetime.fromisoformat(data['created_at'])
        record.updated_at = datetime.fromisoformat(data['updated_at'])
        return record


class Table:
    """Represents a database table"""
    
    def __init__(self, name: str, schema: Dict[str, str] = None):
        self.name = name
        self.schema = schema or {}
        self.records: Dict[str, Record] = {}
        self.indexes: Dict[str, Dict[Any, List[str]]] = {}
    
    def create_index(self, field: str):
        """Create an index on a field for faster queries"""
        if field not in self.indexes:
            self.indexes[field] = {}
            # Build index for existing records
            for record in self.records.values():
                if field in record.data:
                    value = record.data[field]
                    if value not in self.indexes[field]:
                        self.indexes[field][value] = []
                    self.indexes[field][value].append(record.id)
    
    def insert(self, data: Dict[str, Any]) -> str:
        """Insert a new record"""
        # Validate against schema if it exists
        if self.schema:
            for field, field_type in self.schema.items():
                if field in data:
                    if not self._validate_type(data[field], field_type):
                        raise DatabaseError(f"Invalid type for field {field}. Expected {field_type}")
        
        record = Record(data)
        self.records[record.id] = record
        
        # Update indexes
        for field, index in self.indexes.items():
            if field in data:
                value = data[field]
                if value not in index:
                    index[value] = []
                index[value].append(record.id)
        
        return record.id
    
    def find_by_id(self, record_id: str) -> Optional[Record]:
        """Find a record by its ID"""
        return self.records.get(record_id)
    
    def find_all(self) -> List[Record]:
        """Get all records"""
        return list(self.records.values())
    
    def find_where(self, conditions: Dict[str, Any]) -> List[Record]:
        """Find records matching conditions"""
        results = []
        
        for record in self.records.values():
            match = True
            for field, value in conditions.items():
                if field not in record.data or record.data[field] != value:
                    match = False
                    break
            if match:
                results.append(record)
        
        return results
    
    def update(self, record_id: str, data: Dict[str, Any]) -> bool:
        """Update a record"""
        if record_id not in self.records:
            return False
        
        old_record = self.records[record_id]
        
        # Update indexes
        for field, index in self.indexes.items():
            if field in old_record.data:
                old_value = old_record.data[field]
                if old_value in index and record_id in index[old_value]:
                    index[old_value].remove(record_id)
                    if not index[old_value]:
                        del index[old_value]
            
            if field in data:
                new_value = data[field]
                if new_value not in index:
                    index[new_value] = []
                index[new_value].append(record_id)
        
        old_record.update(data)
        return True
    
    def delete(self, record_id: str) -> bool:
        """Delete a record"""
        if record_id not in self.records:
            return False
        
        record = self.records[record_id]
        
        # Update indexes
        for field, index in self.indexes.items():
            if field in record.data:
                value = record.data[field]
                if value in index and record_id in index[value]:
                    index[value].remove(record_id)
                    if not index[value]:
                        del index[value]
        
        del self.records[record_id]
        return True
    
    def count(self) -> int:
        """Get record count"""
        return len(self.records)
    
    def _validate_type(self, value: Any, expected_type: str) -> bool:
        """Validate data type"""
        type_map = {
            'str': str,
            'int': int,
            'float': float,
            'bool': bool,
            'list': list,
            'dict': dict
        }
        
        if expected_type in type_map:
            return isinstance(value, type_map[expected_type])
        return True
    
    def to_dict(self):
        """Convert table to dictionary for serialization"""
        return {
            'name': self.name,
            'schema': self.schema,
            'records': {record_id: record.to_dict() for record_id, record in self.records.items()},
            'indexes': self.indexes
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]):
        """Create table from dictionary"""
        table = cls(data['name'], data['schema'])
        
        # Load records
        for record_id, record_data in data['records'].items():
            table.records[record_id] = Record.from_dict(record_data)
        
        # Load indexes
        table.indexes = data.get('indexes', {})
        
        return table


class Database:
    """Main database class"""
    
    def __init__(self, name: str, storage_path: str = "./databases"):
        self.name = name
        self.storage_path = storage_path
        self.tables: Dict[str, Table] = {}
        self.db_path = os.path.join(storage_path, f"{name}.db")
        
        # Create storage directory if it doesn't exist
        os.makedirs(storage_path, exist_ok=True)
        
        # Load database if it exists
        self.load()
    
    def create_table(self, table_name: str, schema: Dict[str, str] = None) -> Table:
        """Create a new table"""
        if table_name in self.tables:
            raise DatabaseError(f"Table {table_name} already exists")
        
        table = Table(table_name, schema)
        self.tables[table_name] = table
        return table
    
    def get_table(self, table_name: str) -> Optional[Table]:
        """Get a table by name"""
        return self.tables.get(table_name)
    
    def drop_table(self, table_name: str) -> bool:
        """Drop a table"""
        if table_name in self.tables:
            del self.tables[table_name]
            return True
        return False
    
    def list_tables(self) -> List[str]:
        """List all table names"""
        return list(self.tables.keys())
    
    def save(self):
        """Save database to disk"""
        db_data = {
            'name': self.name,
            'tables': {name: table.to_dict() for name, table in self.tables.items()}
        }
        
        with open(self.db_path, 'w') as f:
            json.dump(db_data, f, indent=2)
    
    def load(self):
        """Load database from disk"""
        if os.path.exists(self.db_path):
            try:
                with open(self.db_path, 'r') as f:
                    db_data = json.load(f)
                
                # Load tables
                for table_name, table_data in db_data['tables'].items():
                    self.tables[table_name] = Table.from_dict(table_data)
                    
            except (json.JSONDecodeError, KeyError) as e:
                raise DatabaseError(f"Failed to load database: {e}")
    
    def backup(self, backup_path: str):
        """Create a backup of the database"""
        import shutil
        shutil.copy2(self.db_path, backup_path)
    
    def get_stats(self) -> Dict[str, Any]:
        """Get database statistics"""
        stats = {
            'name': self.name,
            'total_tables': len(self.tables),
            'total_records': sum(table.count() for table in self.tables.values()),
            'tables': {}
        }
        
        for table_name, table in self.tables.items():
            stats['tables'][table_name] = {
                'record_count': table.count(),
                'schema': table.schema,
                'indexes': list(table.indexes.keys())
            }
        
        return stats


class DatabaseManager:
    """Manages multiple databases"""
    
    def __init__(self, storage_path: str = "./databases"):
        self.storage_path = storage_path
        self.databases: Dict[str, Database] = {}
    
    def create_database(self, db_name: str) -> Database:
        """Create a new database"""
        if db_name in self.databases:
            raise DatabaseError(f"Database {db_name} already exists")
        
        db = Database(db_name, self.storage_path)
        self.databases[db_name] = db
        return db
    
    def get_database(self, db_name: str) -> Optional[Database]:
        """Get a database by name"""
        if db_name not in self.databases:
            # Try to load from disk
            db_path = os.path.join(self.storage_path, f"{db_name}.db")
            if os.path.exists(db_path):
                db = Database(db_name, self.storage_path)
                self.databases[db_name] = db
                return db
        
        return self.databases.get(db_name)
    
    def list_databases(self) -> List[str]:
        """List all available databases"""
        databases = set(self.databases.keys())
        
        # Also check for databases on disk
        if os.path.exists(self.storage_path):
            for filename in os.listdir(self.storage_path):
                if filename.endswith('.db'):
                    databases.add(filename[:-3])  # Remove .db extension
        
        return list(databases)
    
    def drop_database(self, db_name: str) -> bool:
        """Drop a database"""
        # Remove from memory
        if db_name in self.databases:
            del self.databases[db_name]
        
        # Remove from disk
        db_path = os.path.join(self.storage_path, f"{db_name}.db")
        if os.path.exists(db_path):
            os.remove(db_path)
            return True
        
        return False


def main():
    """Demo of the custom database"""
    print("=== Custom Database Demo ===\n")
    
    # Initialize database manager
    manager = DatabaseManager()
    
    # Create a database
    db = manager.create_database("test_db")
    print(f"Created database: {db.name}")
    
    # Create a users table with schema
    users_table = db.create_table("users", {
        "name": "str",
        "email": "str",
        "age": "int"
    })
    print(f"Created table: {users_table.name}")
    
    # Create index on email for faster lookups
    users_table.create_index("email")
    print("Created index on email field")
    
    # Insert some users
    user_ids = []
    users_data = [
        {"name": "John Doe", "email": "john@example.com", "age": 30},
        {"name": "Jane Smith", "email": "jane@example.com", "age": 25},
        {"name": "Bob Johnson", "email": "bob@example.com", "age": 35}
    ]
    
    for user_data in users_data:
        user_id = users_table.insert(user_data)
        user_ids.append(user_id)
        print(f"Inserted user: {user_data['name']} (ID: {user_id[:8]}...)")
    
    print(f"\nTotal users: {users_table.count()}")
    
    # Find all users
    print("\n--- All Users ---")
    all_users = users_table.find_all()
    for user in all_users:
        print(f"ID: {user.id[:8]}... | {user.data}")
    
    # Find users by condition
    print("\n--- Users over 30 ---")
    older_users = users_table.find_where({"age": 30})
    for user in older_users:
        print(f"ID: {user.id[:8]}... | {user.data}")
    
    # Update a user
    if user_ids:
        success = users_table.update(user_ids[0], {"age": 31, "city": "New York"})
        if success:
            updated_user = users_table.find_by_id(user_ids[0])
            print(f"\nUpdated user: {updated_user.data}")
    
    # Create another table for posts
    posts_table = db.create_table("posts", {
        "title": "str",
        "content": "str",
        "user_id": "str"
    })
    
    # Insert some posts
    posts_data = [
        {"title": "My First Post", "content": "Hello world!", "user_id": user_ids[0]},
        {"title": "Python Tutorial", "content": "Learning Python is fun!", "user_id": user_ids[1]}
    ]
    
    for post_data in posts_data:
        post_id = posts_table.insert(post_data)
        print(f"Inserted post: {post_data['title']} (ID: {post_id[:8]}...)")
    
    # Save database
    db.save()
    print(f"\nDatabase saved to: {db.db_path}")
    
    # Display database statistics
    print("\n--- Database Statistics ---")
    stats = db.get_stats()
    print(f"Database: {stats['name']}")
    print(f"Tables: {stats['total_tables']}")
    print(f"Total Records: {stats['total_records']}")
    
    for table_name, table_stats in stats['tables'].items():
        print(f"\nTable '{table_name}':")
        print(f"  Records: {table_stats['record_count']}")
        print(f"  Schema: {table_stats['schema']}")
        print(f"  Indexes: {table_stats['indexes']}")
    
    print("\n=== Demo Complete ===")


if __name__ == "__main__":
    main()
