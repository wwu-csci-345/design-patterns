// The HTTP methods supported by this example.
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Configuration used when creating an HttpRequest.
//
// A configuration object is clearer than a constructor with many
// positional parameters because every value has a descriptive name.
type HttpRequestConfig = {
  // The destination URL is required.
  url: string;

  // GET is used by default when no method is provided.
  method?: HttpMethod;

  // Optional HTTP headers.
  headers?: Record<string, string>;

  // Optional query-string parameters.
  queryParameters?: Record<string, string>;

  // Optional request body.
  body?: string | null;

  // Maximum time the request may take before timing out.
  timeout?: number;

  // Number of times the request may be retried after failure.
  retryCount?: number;
};

class HttpRequest {
  public readonly url: string;
  public readonly method: HttpMethod;

  public readonly headers: Readonly<Record<string, string>>;
  public readonly queryParameters: Readonly<Record<string, string>>;

  public readonly body: string | null;
  public readonly timeout: number;
  public readonly retryCount: number;

  public constructor(config: HttpRequestConfig) {
    // Apply default values for optional configuration properties.
    const method = config.method ?? 'GET';
    const headers = config.headers ?? {};
    const queryParameters = config.queryParameters ?? {};
    const body = config.body ?? null;
    const timeout = config.timeout ?? 5000;
    const retryCount = config.retryCount ?? 0;

    // Validate the required URL.
    if (config.url.trim() === '') {
      throw new Error('The request URL cannot be empty.');
    }

    // Validate the timeout.
    if (!Number.isFinite(timeout) || timeout <= 0) {
      throw new Error('Timeout must be a positive number.');
    }

    // Validate the retry count.
    if (!Number.isInteger(retryCount) || retryCount < 0) {
      throw new Error('Retry count must be a non-negative integer.');
    }

    // This example does not allow GET or DELETE requests to contain a body.
    //
    // Whether DELETE requests may contain a body depends on the API and
    // client library. This restriction is simply a domain rule used here.
    if (body !== null && (method === 'GET' || method === 'DELETE')) {
      throw new Error(`${method} requests cannot contain a body.`);
    }

    this.url = config.url;
    this.method = method;

    // Copy mutable objects so later changes to the original configuration
    // do not change the HttpRequest after it has been created.
    this.headers = { ...headers };
    this.queryParameters = { ...queryParameters };

    this.body = body;
    this.timeout = timeout;
    this.retryCount = retryCount;
  }

  /**
   * Returns the complete URL, including encoded query parameters.
   */
  public getFullUrl(): string {
    const entries = Object.entries(this.queryParameters);

    if (entries.length === 0) {
      return this.url;
    }

    const queryString = entries
      .map(([name, value]) => {
        return `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
      })
      .join('&');

    // Use "&" when the original URL already contains a query string.
    const separator = this.url.includes('?') ? '&' : '?';

    return `${this.url}${separator}${queryString}`;
  }

  /**
   * Returns a readable description of the request.
   *
   * This method does not actually send the request. It only displays
   * the request configuration for demonstration purposes.
   */
  public describe(): void {
    console.log('HTTP Request');
    console.log('------------');
    console.log(`Method: ${this.method}`);
    console.log(`URL: ${this.getFullUrl()}`);
    console.log(`Timeout: ${this.timeout} ms`);
    console.log(`Retry count: ${this.retryCount}`);
    console.log('Headers:', this.headers);
    console.log('Body:', this.body);
  }
}

/*
 * Example 1: A simple GET request
 *
 * Only the URL is required. All other properties use their defaults:
 *
 * method: GET
 * headers: {}
 * queryParameters: {}
 * body: null
 * timeout: 5000
 * retryCount: 0
 */
const getUserRequest = new HttpRequest({
  url: 'https://api.example.com/users/42',
});

getUserRequest.describe();

/*
 * Example 2: A GET request with query parameters
 */
const searchUsersRequest = new HttpRequest({
  url: 'https://api.example.com/users',

  queryParameters: {
    status: 'active',
    department: 'Computer Science',
    page: '1',
  },

  timeout: 3000,
});

searchUsersRequest.describe();

/*
 * Example 3: A POST request with a JSON body
 *
 * Because this class does not use a builder, the caller is responsible
 * for serializing the body and adding the appropriate Content-Type header.
 */
const createUserRequest = new HttpRequest({
  url: 'https://api.example.com/users',
  method: 'POST',

  headers: {
    Authorization: 'Bearer example-token',
    'Content-Type': 'application/json',
  },

  body: JSON.stringify({
    name: 'Alice',
    email: 'alice@example.com',
  }),

  timeout: 10_000,
  retryCount: 3,
});

createUserRequest.describe();

/*
 * Example 4: A PATCH request
 */
const updateUserRequest = new HttpRequest({
  url: 'https://api.example.com/users/42',
  method: 'PATCH',

  headers: {
    Authorization: 'Bearer example-token',
    'Content-Type': 'application/json',
  },

  body: JSON.stringify({
    email: 'new-address@example.com',
  }),

  retryCount: 2,
});

updateUserRequest.describe();

/*
 * Example 5: Invalid construction
 *
 * The constructor rejects a GET request that contains a body.
 */
try {
  const invalidRequest = new HttpRequest({
    url: 'https://api.example.com/users',
    method: 'GET',
    body: JSON.stringify({
      name: 'Alice',
    }),
  });

  invalidRequest.describe();
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error(`Could not create request: ${error.message}`);
  } else {
    console.error('An unknown error occurred.');
  }
}