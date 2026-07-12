/*
 * Data Service Without the Decorator Pattern
 *
 * In this design, all optional responsibilities are implemented directly
 * inside a single class:
 *
 * - Fetching data
 * - Logging
 * - Compression
 * - Encryption
 * - Caching
 *
 * This approach works for a small system, but the class becomes increasingly
 * difficult to maintain as more optional behaviors are added.
 */

/*
 * Configuration controls which optional behaviors are enabled.
 */
interface DataServiceConfig {
    enableLogging: boolean;
    enableCompression: boolean;
    enableEncryption: boolean;
    enableCaching: boolean;
}

/*
 * The public interface exposed to the client.
 */
interface DataService {
    fetchData(): string;
}

/*
 * This class contains both the core data-fetching responsibility and all
 * optional cross-cutting responsibilities.
 *
 * Because everything is placed in one class, the class has several reasons
 * to change:
 *
 * - The data source changes
 * - The logging rules change
 * - The caching policy changes
 * - The compression algorithm changes
 * - The encryption algorithm changes
 */
class ConfigurableDataService implements DataService {
    /*
     * A simple in-memory cache.
     *
     * In a real application, this might be replaced with Redis, a database,
     * or another caching system.
     */
    private cachedData: string | null = null;

    constructor(private readonly config: DataServiceConfig) {}

    /*
     * Main operation used by the client.
     *
     * Notice how this method must coordinate every optional behavior.
     * As more features are added, this method will continue to grow.
     */
    fetchData(): string {
        /*
         * Step 1: Check the cache.
         */
        if (this.config.enableCaching && this.cachedData !== null) {
            if (this.config.enableLogging) {
                console.log("Returning data from cache.");
            }

            return this.cachedData;
        }

        /*
         * Step 2: Log the beginning of the operation.
         */
        if (this.config.enableLogging) {
            console.log("Fetching data from the original data source...");
        }

        /*
         * Step 3: Fetch the original application data.
         */
        let data = this.fetchOriginalData();

        /*
         * Step 4: Compress the data when compression is enabled.
         */
        if (this.config.enableCompression) {
            data = this.compress(data);

            if (this.config.enableLogging) {
                console.log("Data compressed.");
            }
        }

        /*
         * Step 5: Encrypt the data when encryption is enabled.
         */
        if (this.config.enableEncryption) {
            data = this.encrypt(data);

            if (this.config.enableLogging) {
                console.log("Data encrypted.");
            }
        }

        /*
         * Step 6: Store the final transformed result in the cache.
         *
         * This implementation caches the result after compression and
         * encryption. A different order would produce different behavior.
         */
        if (this.config.enableCaching) {
            this.cachedData = data;

            if (this.config.enableLogging) {
                console.log("Data stored in cache.");
            }
        }

        /*
         * Step 7: Log the completion of the operation.
         */
        if (this.config.enableLogging) {
            console.log("Data fetched successfully.");
        }

        return data;
    }

    /*
     * Represents the core responsibility of the data service.
     *
     * In a real application, this method might:
     *
     * - Execute a database query
     * - Call a REST API
     * - Read a file
     * - Contact another service
     */
    private fetchOriginalData(): string {
        return "Important application data";
    }

    /*
     * Demonstration-only compression.
     *
     * This method removes spaces to simulate a smaller representation.
     * It is not a real compression algorithm.
     */
    private compress(data: string): string {
        return data.replace(/\s+/g, "");
    }

    /*
     * Demonstration-only encryption.
     *
     * Base64 encoding is not encryption and must not be used to protect
     * sensitive information in a real application.
     *
     * This browser-compatible implementation avoids relying on Node's
     * Buffer class.
     */
    private encrypt(data: string): string {
        const bytes = new TextEncoder().encode(data);

        let binary = "";

        for (const byte of bytes) {
            binary += String.fromCharCode(byte);
        }

        return btoa(binary);
    }

    /*
     * Clears the in-memory cache.
     *
     * Because caching is built directly into this class, cache-management
     * operations must also be added to the same class.
     */
    clearCache(): void {
        this.cachedData = null;

        if (this.config.enableLogging) {
            console.log("Cache cleared.");
        }
    }
}

/*
 * Client Code
 */

const service: DataService = new ConfigurableDataService({
    enableLogging: true,
    enableCompression: true,
    enableEncryption: true,
    enableCaching: true
});

/*
 * First call:
 *
 * - Fetches the original data
 * - Compresses it
 * - Encrypts it
 * - Stores it in the cache
 */
console.log("First request:");

const firstResult = service.fetchData();

console.log("Result:", firstResult);

/*
 * Second call:
 *
 * Because caching is enabled, the service returns the previously cached
 * transformed result.
 */
console.log("\nSecond request:");

const secondResult = service.fetchData();

console.log("Result:", secondResult);