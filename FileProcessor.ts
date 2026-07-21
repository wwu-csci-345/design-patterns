export {};

// ============================================================
// Domain model
// ============================================================

/**
 * Represents one customer record after it has been parsed
 * from an input file.
 */
type CustomerRecord = {
  id: number;
  name: string;
  email: string;
};

// ============================================================
// Product interface
// ============================================================

/**
 * Product interface.
 *
 * Every concrete parser created by the factory method must
 * implement this interface.
 */
interface FileParser {
  parse(fileContents: string): CustomerRecord[];
}

// ============================================================
// Concrete products
// ============================================================

/**
 * Concrete product for parsing CSV files.
 */
class CsvFileParser implements FileParser {
  public parse(fileContents: string): CustomerRecord[] {
    console.log("Parsing file contents as CSV...");

    const lines = fileContents
      .trim()
      .split("\n")
      .map((line) => line.trim());

    // Remove the CSV header.
    const dataLines = lines.slice(1);

    return dataLines.map((line) => {
      const [id, name, email] = line.split(",");

      return {
        id: Number(id),
        name: name.trim(),
        email: email.trim(),
      };
    });
  }
}

/**
 * Concrete product for parsing JSON files.
 */
class JsonFileParser implements FileParser {
  public parse(fileContents: string): CustomerRecord[] {
    console.log("Parsing file contents as JSON...");

    const parsedData: unknown = JSON.parse(fileContents);

    if (!Array.isArray(parsedData)) {
      throw new Error("JSON file must contain an array of records.");
    }

    return parsedData as CustomerRecord[];
  }
}

/**
 * Concrete product for parsing a pipe-delimited text format.
 *
 * Example:
 *
 * 1|Alice Johnson|alice@example.com
 * 2|Bob Smith|bob@example.com
 */
class PipeDelimitedFileParser implements FileParser {
  public parse(fileContents: string): CustomerRecord[] {
    console.log("Parsing file contents as pipe-delimited text...");

    const lines = fileContents
      .trim()
      .split("\n")
      .map((line) => line.trim());

    return lines.map((line) => {
      const [id, name, email] = line.split("|");

      return {
        id: Number(id),
        name: name.trim(),
        email: email.trim(),
      };
    });
  }
}

// ============================================================
// Supporting services
// ============================================================

/**
 * Simulates a repository that stores customer records.
 */
class CustomerRepository {
  public saveAll(records: CustomerRecord[]): void {
    console.log(`Saving ${records.length} customer records...`);

    for (const record of records) {
      console.log(
        `Saved customer: ${record.id}, ${record.name}, ${record.email}`,
      );
    }
  }
}

/**
 * Simulates reading file contents from a file system.
 *
 * In a real application, this class might use Node.js fs APIs.
 */
class FileReader {
  public read(filePath: string, simulatedContents: string): string {
    console.log(`Opening file: ${filePath}`);

    if (simulatedContents.trim().length === 0) {
      throw new Error(`File is empty: ${filePath}`);
    }

    console.log(`Finished reading file: ${filePath}`);

    return simulatedContents;
  }
}

// ============================================================
// Creator
// ============================================================

/**
 * Creator class.
 *
 * This class owns the stable file-processing workflow:
 *
 * 1. Open and read the file.
 * 2. Create the appropriate parser.
 * 3. Parse the file.
 * 4. Validate the records.
 * 5. Save the records.
 * 6. Report the result.
 *
 * The createParser() method is the factory method.
 *
 * The creator does not know which concrete parser will be used.
 * That decision is delegated to subclasses.
 */
abstract class FileProcessingJob {
  public constructor(
    private readonly fileReader: FileReader,
    private readonly customerRepository: CustomerRepository,
  ) {}

  /**
   * Factory method.
   *
   * Each subclass overrides this method to create the appropriate
   * concrete FileParser.
   */
  protected abstract createParser(): FileParser;

  /**
   * Template workflow.
   *
   * This method defines the stable algorithm used by every
   * file-processing job.
   */
  public run(filePath: string, simulatedContents: string): void {
    console.log("\n========================================");
    console.log(`Starting processing job for ${filePath}`);
    console.log("========================================");

    try {
      // Step 1: Read the file.
      const fileContents = this.fileReader.read(
        filePath,
        simulatedContents,
      );

      // Step 2: Create the correct parser.
      //
      // The superclass calls the factory method, but the subclass
      // determines which concrete parser is returned.
      const parser = this.createParser();

      // Step 3: Parse the file.
      const records = parser.parse(fileContents);

      // Step 4: Validate the parsed records.
      this.validate(records);

      // Step 5: Save valid records.
      this.customerRepository.saveAll(records);

      // Step 6: Report successful completion.
      console.log(`Successfully processed ${filePath}`);
    } catch (error: unknown) {
      this.handleError(filePath, error);
    } finally {
      console.log(`Finished processing job for ${filePath}`);
    }
  }

  /**
   * Shared validation logic.
   *
   * Every file format produces the same CustomerRecord objects,
   * so validation can remain in the creator superclass.
   */
  private validate(records: CustomerRecord[]): void {
    console.log("Validating parsed customer records...");

    if (records.length === 0) {
      throw new Error("The file did not contain any customer records.");
    }

    for (const record of records) {
      if (!Number.isInteger(record.id) || record.id <= 0) {
        throw new Error(
          `Invalid customer ID: ${String(record.id)}`,
        );
      }

      if (
        typeof record.name !== "string" ||
        record.name.trim().length === 0
      ) {
        throw new Error(
          `Customer ${record.id} does not have a valid name.`,
        );
      }

      if (
        typeof record.email !== "string" ||
        !record.email.includes("@")
      ) {
        throw new Error(
          `Customer ${record.id} does not have a valid email.`,
        );
      }
    }

    console.log(`${records.length} customer records are valid.`);
  }

  /**
   * Shared error-handling logic.
   */
  private handleError(filePath: string, error: unknown): void {
    const message =
      error instanceof Error
        ? error.message
        : "An unknown processing error occurred.";

    console.error(`Failed to process ${filePath}: ${message}`);
  }
}

// ============================================================
// Concrete creators
// ============================================================

/**
 * Concrete creator for CSV processing.
 *
 * This class chooses CsvFileParser as the concrete product.
 */
class CsvFileProcessingJob extends FileProcessingJob {
  protected createParser(): FileParser {
    return new CsvFileParser();
  }
}

/**
 * Concrete creator for JSON processing.
 *
 * This class chooses JsonFileParser as the concrete product.
 */
class JsonFileProcessingJob extends FileProcessingJob {
  protected createParser(): FileParser {
    return new JsonFileParser();
  }
}

/**
 * Concrete creator for pipe-delimited file processing.
 *
 * This class chooses PipeDelimitedFileParser as the concrete product.
 */
class PipeDelimitedFileProcessingJob extends FileProcessingJob {
  protected createParser(): FileParser {
    return new PipeDelimitedFileParser();
  }
}

// ============================================================
// Client code and composition root
// ============================================================

/**
 * The concrete processing job has already been selected before
 * this function is called.
 *
 * The client can therefore work with the abstract creator type.
 */
function executeJob(
  job: FileProcessingJob,
  filePath: string,
  fileContents: string,
): void {
  job.run(filePath, fileContents);
}

// Shared supporting dependencies.
const fileReader = new FileReader();
const customerRepository = new CustomerRepository();

// Create the concrete creators.
const csvJob = new CsvFileProcessingJob(
  fileReader,
  customerRepository,
);

const jsonJob = new JsonFileProcessingJob(
  fileReader,
  customerRepository,
);

const pipeDelimitedJob = new PipeDelimitedFileProcessingJob(
  fileReader,
  customerRepository,
);

// ============================================================
// Example input files
// ============================================================

const csvContents = `
id,name,email
1,Alice Johnson,alice@example.com
2,Bob Smith,bob@example.com
`;

const jsonContents = `
[
  {
    "id": 3,
    "name": "Carol Williams",
    "email": "carol@example.com"
  },
  {
    "id": 4,
    "name": "David Brown",
    "email": "david@example.com"
  }
]
`;

const pipeDelimitedContents = `
5|Emma Davis|emma@example.com
6|Frank Miller|frank@example.com
`;

// ============================================================
// Run the processing jobs
// ============================================================

executeJob(csvJob, "customers.csv", csvContents);

executeJob(jsonJob, "customers.json", jsonContents);

executeJob(
  pipeDelimitedJob,
  "customers.txt",
  pipeDelimitedContents,
);