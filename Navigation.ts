// The system supports several ways of traveling from point A
// to point B:
//
// 1. Driving
// 2. Walking
// 3. Cycling
// 4. Public transit
//
// All routing algorithms are contained inside one class.
// The class also decides which routing algorithm to execute.

// Represents a geographic point used by this application.
type MapPoint = {
  name: string;
  latitude: number;
  longitude: number;
};

// Represents the result produced by a routing algorithm.
type RouteResult = {
  description: string;
  distanceKm: number;
  estimatedMinutes: number;
};

// Lists the transportation modes supported by the application.
// Every time a new transportation mode is added, this type must
// be modified.
type TravelMode = 'driving' | 'walking' | 'cycling' | 'public-transit';

class MapNavigator {
  // ----------------------------------------------------------
  // Main public operation
  // ----------------------------------------------------------
  //
  // The caller provides:
  //
  // - a starting point
  // - a destination
  // - a transportation mode
  //
  // This method validates the request and then selects one of
  // several routing algorithms using conditionals.
  // ----------------------------------------------------------
  createRoute(
    start: MapPoint,
    destination: MapPoint,
    travelMode: TravelMode,
  ): RouteResult {
    this.validatePoints(start, destination);

    // MapNavigator must know every supported transportation mode.
    //
    // Adding another routing approach requires modifying this
    // conditional structure.
    if (travelMode === 'driving') {
      return this.calculateDrivingRoute(start, destination);
    }

    if (travelMode === 'walking') {
      return this.calculateWalkingRoute(start, destination);
    }

    if (travelMode === 'cycling') {
      return this.calculateCyclingRoute(start, destination);
    }

    if (travelMode === 'public-transit') {
      return this.calculatePublicTransitRoute(start, destination);
    }

    return this.assertUnreachable(travelMode);
  }

  // ----------------------------------------------------------
  // Shared validation
  // ----------------------------------------------------------
  //
  // This validation applies to every routing approach, so it is
  // reasonable for MapNavigator to perform it.
  // ----------------------------------------------------------
  private validatePoints(start: MapPoint, destination: MapPoint): void {
    this.validatePoint(start, 'Starting point');
    this.validatePoint(destination, 'Destination');

    const pointsHaveSameCoordinates =
      start.latitude === destination.latitude &&
      start.longitude === destination.longitude;

    if (pointsHaveSameCoordinates) {
      throw new Error('The starting point and destination must be different.');
    }
  }

  // Validates one geographic point.
  private validatePoint(point: MapPoint, label: string): void {
    if (point.name.trim().length === 0) {
      throw new Error(`${label} must have a name.`);
    }

    if (!Number.isFinite(point.latitude)) {
      throw new Error(`${label} latitude must be a finite number.`);
    }

    if (!Number.isFinite(point.longitude)) {
      throw new Error(`${label} longitude must be a finite number.`);
    }

    if (point.latitude < -90 || point.latitude > 90) {
      throw new Error(`${label} latitude must be between -90 and 90.`);
    }

    if (point.longitude < -180 || point.longitude > 180) {
      throw new Error(`${label} longitude must be between -180 and 180.`);
    }
  }

  // ----------------------------------------------------------
  // Driving-route algorithm
  // ----------------------------------------------------------
  //
  // Driving routes may prioritize:
  //
  // - lower travel time
  // - major roads
  // - current traffic
  // - road closures
  // ----------------------------------------------------------
  private calculateDrivingRoute(
    start: MapPoint,
    destination: MapPoint,
  ): RouteResult {
    console.log('Loading the road network...');
    console.log('Checking current traffic...');
    console.log('Avoiding closed roads...');
    console.log('Selecting the fastest driving path...');

    return {
      description:
        `Drive from ${start.name} to ${destination.name} ` +
        'using major roads while avoiding heavy traffic.',
      distanceKm: 24,
      estimatedMinutes: 32,
    };
  }

  // ----------------------------------------------------------
  // Walking-route algorithm
  // ----------------------------------------------------------
  //
  // Walking routes may prioritize:
  //
  // - sidewalks
  // - pedestrian paths
  // - crosswalks
  // - roads that permit pedestrian access
  // ----------------------------------------------------------
  private calculateWalkingRoute(
    start: MapPoint,
    destination: MapPoint,
  ): RouteResult {
    console.log('Loading pedestrian map data...');
    console.log('Finding sidewalks and walking paths...');
    console.log('Avoiding roads without pedestrian access...');
    console.log('Selecting a safe walking path...');

    return {
      description:
        `Walk from ${start.name} to ${destination.name} ` +
        'using sidewalks, crosswalks, and pedestrian paths.',
      distanceKm: 18,
      estimatedMinutes: 220,
    };
  }

  // ----------------------------------------------------------
  // Cycling-route algorithm
  // ----------------------------------------------------------
  //
  // Cycling routes may prioritize:
  //
  // - bicycle lanes
  // - low-traffic roads
  // - safer intersections
  // - manageable elevation changes
  // ----------------------------------------------------------
  private calculateCyclingRoute(
    start: MapPoint,
    destination: MapPoint,
  ): RouteResult {
    console.log('Loading bicycle route data...');
    console.log('Finding bicycle lanes...');
    console.log('Checking road traffic...');
    console.log('Checking elevation changes...');
    console.log('Selecting a safe cycling path...');

    return {
      description:
        `Cycle from ${start.name} to ${destination.name} ` +
        'using bicycle lanes and low-traffic roads.',
      distanceKm: 20,
      estimatedMinutes: 75,
    };
  }

  // ----------------------------------------------------------
  // Public-transit routing algorithm
  // ----------------------------------------------------------
  //
  // Public-transit routes may prioritize:
  //
  // - bus and train schedules
  // - available stops
  // - transfer times
  // - walking distance to and from stations
  // ----------------------------------------------------------
  private calculatePublicTransitRoute(
    start: MapPoint,
    destination: MapPoint,
  ): RouteResult {
    console.log('Loading public-transit schedules...');
    console.log('Finding nearby stops...');
    console.log('Checking bus and train availability...');
    console.log('Calculating transfers...');
    console.log('Selecting the fastest transit route...');

    return {
      description:
        `Travel from ${start.name} to ${destination.name} ` +
        'using a combination of walking, buses, and trains.',
      distanceKm: 22,
      estimatedMinutes: 48,
    };
  }

  // ----------------------------------------------------------
  // Exhaustiveness check
  // ----------------------------------------------------------
  //
  // The parameter has type never. That means this method should
  // only be callable when every possible TravelMode value has
  // already been handled.
  //
  // For example, suppose "flying" is added to TravelMode but no
  // corresponding conditional is added to createRoute. TypeScript
  // will report an error when travelMode is passed here because
  // its type will no longer be never.
  // ----------------------------------------------------------
  private assertUnreachable(value: never): never {
    throw new Error(`Unsupported transportation mode: ${String(value)}`);
  }
}

// ------------------------------------------------------------
// Example geographic points
// ------------------------------------------------------------

const universityCampus: MapPoint = {
  name: 'University Campus',
  latitude: 48.734,
  longitude: -122.486,
};

const regionalAirport: MapPoint = {
  name: 'Regional Airport',
  latitude: 48.793,
  longitude: -122.537,
};

// ------------------------------------------------------------
// Client code
// ------------------------------------------------------------
//
// We avoid naming this variable "navigator" because browsers
// already provide a global navigator object at window.navigator.
// ------------------------------------------------------------

const mapNavigator = new MapNavigator();

// Calculate a driving route.
const drivingRoute = mapNavigator.createRoute(
  universityCampus,
  regionalAirport,
  'driving',
);

console.log('\nDriving route:');
console.log(drivingRoute);

// Calculate a walking route.
//
// The same MapNavigator object now executes a completely
// different routing algorithm.
const walkingRoute = mapNavigator.createRoute(
  universityCampus,
  regionalAirport,
  'walking',
);

console.log('\nWalking route:');
console.log(walkingRoute);

// Calculate a cycling route.
const cyclingRoute = mapNavigator.createRoute(
  universityCampus,
  regionalAirport,
  'cycling',
);

console.log('\nCycling route:');
console.log(cyclingRoute);

// Calculate a public-transit route.
const publicTransitRoute = mapNavigator.createRoute(
  universityCampus,
  regionalAirport,
  'public-transit',
);

console.log('\nPublic-transit route:');
console.log(publicTransitRoute);
