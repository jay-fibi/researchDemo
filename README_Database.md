# Custom Database System

A lightweight, pure Python database system built from scratch with support for CRUD operations, indexing, schema validation, and data persistence.

## Features

- **CRUD Operations**: Create, Read, Update, Delete records
- **Schema Validation**: Define and enforce data types for table columns
- **Indexing**: Create indexes on fields for faster queries
- **Data Persistence**: Automatic saving and loading from JSON files
- **Multiple Databases**: Manage multiple databases simultaneously
- **Backup & Recovery**: Create backups of your databases
- **Statistics**: Get detailed statistics about your databases
- **UUID-based Records**: Each record has a unique identifier
- **Timestamp Tracking**: Automatic created_at and updated_at timestamps

## Architecture

The system consists of four main classes:

1. **Record**: Represents individual data records with metadata
2. **Table**: Manages collections of records with schema validation
3. **Database**: Contains multiple tables and handles persistence
4. **DatabaseManager**: Manages multiple databases

## Quick Start

```python
from custom_database import DatabaseManager

# Initialize database manager
manager = DatabaseManager()

# Create a database
db = manager.create_database("my_app")

# Create a table with schema
users = db.create_table("users", {
    "name": "str",
    "email": "str",
    "age": "int"
})

# Insert data
user_id = users.insert({
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
})

# Query data
user = users.find_by_id(user_id)
all_users = users.find_all()
adults = users.find_where({"age": 30})

# Update data
users.update(user_id, {"age": 31})

# Save to disk
db.save()
```

## API Reference

### DatabaseManager

```python
manager = DatabaseManager(storage_path="./databases")

# Create or get databases
db = manager.create_database("database_name")
db = manager.get_database("database_name")

# List and manage databases
databases = manager.list_databases()
success = manager.drop_database("database_name")
```

### Database

```python
# Create and manage tables
table = db.create_table("table_name", schema)
table = db.get_table("table_name")
tables = db.list_tables()
success = db.drop_table("table_name")

# Persistence
db.save()                    # Save to disk
db.load()                    # Load from disk
db.backup("backup_path")     # Create backup

# Statistics
stats = db.get_stats()
```

### Table

```python
# Insert data
record_id = table.insert({"field": "value"})

# Query data
record = table.find_by_id(record_id)
records = table.find_all()
records = table.find_where({"field": "value"})

# Update and delete
success = table.update(record_id, {"field": "new_value"})
success = table.delete(record_id)

# Indexing
table.create_index("field_name")

# Utility
count = table.count()
```

### Record

```python
record = Record({"name": "John", "age": 30})
record.update({"age": 31})
data = record.to_dict()
```

## Schema Types

Supported data types for schema validation:

- `"str"`: String values
- `"int"`: Integer values
- `"float"`: Floating-point values
- `"bool"`: Boolean values
- `"list"`: List values
- `"dict"`: Dictionary values

## Examples

### Basic CRUD Operations

```python
from custom_database import DatabaseManager

manager = DatabaseManager()
db = manager.create_database("store")

# Create products table
products = db.create_table("products", {
    "name": "str",
    "price": "float",
    "category": "str"
})

# Insert products
laptop_id = products.insert({
    "name": "Gaming Laptop",
    "price": 1299.99,
    "category": "Electronics"
})

# Query products
laptop = products.find_by_id(laptop_id)
all_products = products.find_all()
electronics = products.find_where({"category": "Electronics"})

# Update price
products.update(laptop_id, {"price": 1199.99})

# Save database
db.save()
```

### Using Indexes

```python
# Create index for faster queries
products.create_index("category")

# Queries on indexed fields will be faster
electronics = products.find_where({"category": "Electronics"})
```

### Multiple Databases

```python
manager = DatabaseManager()

# Create different databases for different purposes
user_db = manager.create_database("users")
inventory_db = manager.create_database("inventory")
logs_db = manager.create_database("logs")

# Each database is independent
users_table = user_db.create_table("users", {...})
products_table = inventory_db.create_table("products", {...})

# Save all databases
user_db.save()
inventory_db.save()
logs_db.save()
```

### Data Validation

```python
# Schema validation catches type errors
users = db.create_table("users", {
    "name": "str",
    "age": "int",
    "active": "bool"
})

# This works
users.insert({"name": "John", "age": 30, "active": True})

# This raises DatabaseError
users.insert({"name": "John", "age": "thirty", "active": True})
```

## File Structure

```
databases/
├── database1.db          # JSON file containing database data
├── database2.db
└── backups/
    └── database1_backup.db
```

## Storage Format

Data is stored in human-readable JSON format:

```json
{
  "name": "my_database",
  "tables": {
    "users": {
      "name": "users",
      "schema": {"name": "str", "age": "int"},
      "records": {
        "uuid-1": {
          "id": "uuid-1",
          "data": {"name": "John", "age": 30},
          "created_at": "2024-01-01T12:00:00",
          "updated_at": "2024-01-01T12:00:00"
        }
      },
      "indexes": {
        "age": {
          "30": ["uuid-1"]
        }
      }
    }
  }
}
```

## Performance Considerations

- **Indexing**: Create indexes on frequently queried fields
- **Memory Usage**: All data is loaded into memory for fast access
- **File Size**: JSON storage is human-readable but not space-efficient
- **Concurrency**: Single-threaded, not suitable for concurrent access

## Limitations

- **No SQL**: Uses simple key-value queries, not SQL
- **No Joins**: No built-in support for joining tables
- **No Transactions**: No atomic operations across multiple records
- **Memory-based**: All data loaded into memory
- **Single Process**: Not designed for concurrent access

## Future Enhancements

Potential improvements for the database system:

1. **Query Language**: Add a simple query language
2. **Relationships**: Support for foreign keys and joins
3. **Transactions**: Atomic operations
4. **Compression**: Compress data files
5. **Replication**: Master-slave replication
6. **Concurrency**: Thread-safe operations
7. **Binary Format**: More efficient storage format

## Files

- `custom_database.py` - Main database implementation
- `database_examples.py` - Usage examples and demos
- `README_Database.md` - This documentation

## Running Examples

```bash
# Run the main demo
python3 custom_database.py

# Run additional examples
python3 database_examples.py
```

## Contributing

This is a educational database implementation. Feel free to extend it with:

- Additional query methods
- Better indexing algorithms
- Query optimization
- Data compression
- Network protocols
- Web interfaces

## License

Open source - use and modify freely for learning purposes.
