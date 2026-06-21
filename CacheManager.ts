// define cache manager using singleton pattern
type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

class AppCache {
  private static instance: AppCache | null = null;

  private readonly store = new Map<string, CacheEntry<unknown>>();

  private constructor() {}

  public static getInstance(): AppCache {
    if (AppCache.instance === null) {
      AppCache.instance = new AppCache();
    }

    return AppCache.instance;
  }

  public set<T>(key: string, value: T, ttlSeconds: number): void {
    const expiresAt = Date.now() + ttlSeconds * 1000;

    this.store.set(key, {
      value,
      expiresAt,
    });
  }

  public get<T>(key: string): T | null {
    const entry = this.store.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  public delete(key: string): void {
    this.store.delete(key);
  }

  public clear(): void {
    this.store.clear();
  }
}

// define two classes that use the cache manager
type UserProfile = {
  id: string;
  name: string;
  email: string;
};

class UserService {
  private readonly cache = AppCache.getInstance();

  public getUserProfile(userId: string): UserProfile {
    const cacheKey = `user-profile:${userId}`;

    const cachedProfile = this.cache.get<UserProfile>(cacheKey);

    if (cachedProfile) {
      console.log("Returning user profile from cache.");
      return cachedProfile;
    }

    console.log("Fetching user profile from database.");

    const profile: UserProfile = {
      id: userId,
      name: "Ada Lovelace",
      email: "ada@example.com",
    };

    this.cache.set(cacheKey, profile, 60);

    return profile;
  }
}

class PermissionService {
  private readonly cache = AppCache.getInstance();

  public getUserPermissions(userId: string): string[] {
    const cacheKey = `user-permissions:${userId}`;

    const cachedPermissions = this.cache.get<string[]>(cacheKey);

    if (cachedPermissions) {
      console.log("Returning permissions from cache.");
      return cachedPermissions;
    }

    console.log("Fetching permissions from authorization service.");

    const permissions = ["READ_COURSES", "EDIT_PROFILE"];

    this.cache.set(cacheKey, permissions, 30);

    return permissions;
  }
}

// usage example
// // expected output:
// // Fetching user profile from database.
// // Returning user profile from cache.
// // Fetching permissions from authorization service.
// // Returning permissions from cache.
// // true
// // true
const userService = new UserService();
const permissionService = new PermissionService();

const profile1 = userService.getUserProfile("u1");
const profile2 = userService.getUserProfile("u1");

const permissions1 = permissionService.getUserPermissions("u1");
const permissions2 = permissionService.getUserPermissions("u1");

console.log(profile1 === profile2); // true
console.log(permissions1 === permissions2); // true