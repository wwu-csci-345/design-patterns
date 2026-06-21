type DatabaseConfig = {
  host: string;
  port: number;
  database: string;
  username: string;
};

class DatabaseConnection {
  private static instance: DatabaseConnection | null = null;

  private isConnected: boolean = false;

  private constructor(private readonly config: DatabaseConfig) {}

  public static getInstance(config?: DatabaseConfig): DatabaseConnection {
    if (DatabaseConnection.instance === null) {
      if (!config) {
        throw new Error(
          'Database config is required when creating the first connection.',
        );
      }

      DatabaseConnection.instance = new DatabaseConnection(config);
    }

    return DatabaseConnection.instance;
  }

  public connect(): void {
    if (this.isConnected) {
      console.log('Already connected.');
      return;
    }

    this.isConnected = true;

    console.log(
      `Connected to ${this.config.database} at ${this.config.host}:${this.config.port}`,
    );
  }

  public query(sql: string): void {
    if (!this.isConnected) {
      throw new Error('Cannot run query before connecting.');
    }

    console.log(`Executing SQL: ${sql}`);
  }

  public disconnect(): void {
    this.isConnected = false;
    console.log('Disconnected from database.');
  }
}

// usage example
const db = DatabaseConnection.getInstance({
  host: "localhost",
  port: 5432,
  database: "student_records",
  username: "admin",
});

db.connect();
db.query("SELECT * FROM students");

const sameDb = DatabaseConnection.getInstance();

console.log(db === sameDb); // true