#!/usr/bin/env python3
"""
Custom Database Usage Examples
Demonstrates various use cases for the custom database system
"""

from custom_database import DatabaseManager, DatabaseError


def basic_crud_operations():
    """Example of basic CRUD operations"""
    print("=== Basic CRUD Operations ===")
    
    manager = DatabaseManager()
    db = manager.create_database("crud_demo")
    
    # Create products table
    products = db.create_table("products", {
        "name": "str",
        "price": "float",
        "category": "str",
        "in_stock": "bool"
    })
    
    # CREATE - Insert products
    product_data = [
        {"name": "Laptop", "price": 999.99, "category": "Electronics", "in_stock": True},
        {"name": "Chair", "price": 149.99, "category": "Furniture", "in_stock": True},
        {"name": "Phone", "price": 699.99, "category": "Electronics", "in_stock": False}
    ]
    
    product_ids = []
    for product in product_data:
        product_id = products.insert(product)
        product_ids.append(product_id)
        print(f"Created: {product['name']} (${product['price']})")
    
    # READ - Find all products
    print(f"\nAll products ({products.count()}):")
    for product in products.find_all():
        print(f"  {product.data['name']}: ${product.data['price']}")
    
    # READ - Find by condition
    electronics = products.find_where({"category": "Electronics"})
    print(f"\nElectronics ({len(electronics)}):")
    for product in electronics:
        print(f"  {product.data['name']}: ${product.data['price']}")
    
    # UPDATE - Change price
    products.update(product_ids[0], {"price": 899.99})
    updated_product = products.find_by_id(product_ids[0])
    print(f"\nUpdated {updated_product.data['name']} price to ${updated_product.data['price']}")
    
    # DELETE - Remove a product
    products.delete(product_ids[2])
    print(f"\nDeleted product. Remaining products: {products.count()}")
    
    db.save()
    print("Database saved.\n")


def indexing_performance():
    """Example showing indexing for better performance"""
    print("=== Indexing Performance Demo ===")
    
    manager = DatabaseManager()
    db = manager.create_database("performance_demo")
    
    # Create customers table
    customers = db.create_table("customers", {
        "name": "str",
        "email": "str",
        "city": "str",
        "age": "int"
    })
    
    # Insert many customers
    import random
    cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"]
    
    print("Inserting 1000 customers...")
    for i in range(1000):
        customer_data = {
            "name": f"Customer {i+1}",
            "email": f"customer{i+1}@example.com",
            "city": random.choice(cities),
            "age": random.randint(18, 80)
        }
        customers.insert(customer_data)
    
    print(f"Total customers: {customers.count()}")
    
    # Create index on city for faster queries
    customers.create_index("city")
    print("Created index on 'city' field")
    
    # Query by city (will be faster with index)
    chicago_customers = customers.find_where({"city": "Chicago"})
    print(f"Customers in Chicago: {len(chicago_customers)}")
    
    db.save()
    print("Database saved.\n")


def multiple_databases():
    """Example of managing multiple databases"""
    print("=== Multiple Databases Demo ===")
    
    manager = DatabaseManager()
    
    # Create multiple databases
    blog_db = manager.create_database("blog")
    ecommerce_db = manager.create_database("ecommerce")
    
    # Blog database - articles table
    articles = blog_db.create_table("articles", {
        "title": "str",
        "content": "str",
        "author": "str",
        "published": "bool"
    })
    
    articles.insert({
        "title": "Getting Started with Python",
        "content": "Python is a great programming language...",
        "author": "John Doe",
        "published": True
    })
    
    # E-commerce database - orders table
    orders = ecommerce_db.create_table("orders", {
        "customer_id": "str",
        "total": "float",
        "status": "str"
    })
    
    orders.insert({
        "customer_id": "cust_123",
        "total": 299.99,
        "status": "shipped"
    })
    
    # Save both databases
    blog_db.save()
    ecommerce_db.save()
    
    # List all databases
    print("Available databases:", manager.list_databases())
    
    # Show statistics for each database
    for db_name in ["blog", "ecommerce"]:
        db = manager.get_database(db_name)
        stats = db.get_stats()
        print(f"\n{db_name.title()} Database:")
        print(f"  Tables: {stats['total_tables']}")
        print(f"  Records: {stats['total_records']}")
    
    print()


def data_validation():
    """Example of schema validation"""
    print("=== Data Validation Demo ===")
    
    manager = DatabaseManager()
    db = manager.create_database("validation_demo")
    
    # Create strict schema
    users = db.create_table("users", {
        "name": "str",
        "age": "int",
        "email": "str",
        "active": "bool"
    })
    
    # Valid data
    try:
        user_id = users.insert({
            "name": "Alice",
            "age": 25,
            "email": "alice@example.com",
            "active": True
        })
        print("✓ Valid user inserted successfully")
    except DatabaseError as e:
        print(f"✗ Error: {e}")
    
    # Invalid data (wrong type)
    try:
        users.insert({
            "name": "Bob",
            "age": "twenty-five",  # Should be int
            "email": "bob@example.com",
            "active": True
        })
        print("✓ User inserted")
    except DatabaseError as e:
        print(f"✗ Validation Error: {e}")
    
    db.save()
    print("Database saved.\n")


def backup_and_recovery():
    """Example of database backup and recovery"""
    print("=== Backup and Recovery Demo ===")
    
    manager = DatabaseManager()
    db = manager.create_database("backup_demo")
    
    # Create and populate table
    inventory = db.create_table("inventory", {
        "item": "str",
        "quantity": "int",
        "location": "str"
    })
    
    inventory.insert({"item": "Widget A", "quantity": 100, "location": "Warehouse 1"})
    inventory.insert({"item": "Widget B", "quantity": 50, "location": "Warehouse 2"})
    
    db.save()
    print(f"Original database has {inventory.count()} items")
    
    # Create backup
    backup_path = "./databases/backup_demo_backup.db"
    db.backup(backup_path)
    print(f"Backup created at: {backup_path}")
    
    # Simulate data loss (delete items)
    all_records = inventory.find_all()
    for record in all_records:
        inventory.delete(record.id)
    
    print(f"After data loss: {inventory.count()} items")
    
    # Recovery would involve loading from backup
    print("In a real scenario, you would restore from backup")
    print("Database operations completed.\n")


def advanced_queries():
    """Example of more complex query patterns"""
    print("=== Advanced Queries Demo ===")
    
    manager = DatabaseManager()
    db = manager.create_database("advanced_demo")
    
    # Create employees table
    employees = db.create_table("employees", {
        "name": "str",
        "department": "str",
        "salary": "int",
        "years_experience": "int"
    })
    
    # Create indexes for better query performance
    employees.create_index("department")
    employees.create_index("salary")
    
    # Insert sample data
    employee_data = [
        {"name": "Alice Smith", "department": "Engineering", "salary": 95000, "years_experience": 5},
        {"name": "Bob Johnson", "department": "Engineering", "salary": 85000, "years_experience": 3},
        {"name": "Carol Davis", "department": "Marketing", "salary": 70000, "years_experience": 4},
        {"name": "David Wilson", "department": "Sales", "salary": 60000, "years_experience": 2},
        {"name": "Eve Brown", "department": "Engineering", "salary": 105000, "years_experience": 8}
    ]
    
    for emp in employee_data:
        employees.insert(emp)
    
    print(f"Total employees: {employees.count()}")
    
    # Query by department
    engineers = employees.find_where({"department": "Engineering"})
    print(f"Engineers: {len(engineers)}")
    
    # Find high earners (manual filtering for demonstration)
    high_earners = []
    for emp in employees.find_all():
        if emp.data["salary"] > 80000:
            high_earners.append(emp)
    
    print(f"High earners (>$80k): {len(high_earners)}")
    for emp in high_earners:
        print(f"  {emp.data['name']}: ${emp.data['salary']:,}")
    
    db.save()
    print("Database saved.\n")


def main():
    """Run all examples"""
    print("Custom Database System - Usage Examples\n")
    
    try:
        basic_crud_operations()
        indexing_performance()
        multiple_databases()
        data_validation()
        backup_and_recovery()
        advanced_queries()
        
        print("=== All Examples Completed Successfully ===")
        
    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    main()
