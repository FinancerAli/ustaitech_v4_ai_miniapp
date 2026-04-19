import sqlite3

def check_db():
    conn = sqlite3.connect('bot.db')
    curr = conn.cursor()
    
    curr.execute("SELECT name, sql FROM sqlite_master WHERE type='table';")
    tables = curr.fetchall()
    
    for table_name, table_sql in tables:
        print(f"--- Table: {table_name} ---")
        if table_sql:
            print(table_sql)
            
        print("Data sample:")
        curr.execute(f"SELECT * FROM {table_name} LIMIT 3;")
        rows = curr.fetchall()
        for r in rows:
            print(r)
        print("\n")
        
    conn.close()

if __name__ == '__main__':
    check_db()
