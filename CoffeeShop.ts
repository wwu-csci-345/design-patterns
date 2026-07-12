/*
 * Coffee Customization Without the Decorator Pattern
 *
 * In this design, one class is responsible for:
 *
 * - Representing the basic coffee
 * - Tracking selected ingredients
 * - Calculating the total price
 * - Building the order description
 * - Enforcing ingredient-related rules
 *
 * This approach works for a small number of ingredients, but the class
 * becomes increasingly complicated as more options and behaviors are added.
 */

/*
 * Represents the available coffee sizes.
 */
enum CoffeeSize {
  Small = 'Small',
  Medium = 'Medium',
  Large = 'Large',
}

/*
 * Configuration object used to describe a coffee order.
 *
 * Each optional ingredient is represented by a boolean flag.
 */
interface CoffeeOptions {
  size: CoffeeSize;
  hasMilk: boolean;
  hasSugar: boolean;
  hasWhippedCream: boolean;
  hasCaramel: boolean;
}

/*
 * Public interface used by the client.
 */
interface Coffee {
  getDescription(): string;
  getCost(): number;
}

/*
 * ConfigurableCoffee contains both the core coffee behavior and all
 * optional ingredient behavior.
 *
 * This class is not using the Decorator pattern.
 *
 * Instead of wrapping the coffee with separate ingredient objects,
 * it uses conditionals to determine which ingredients are included.
 */
class ConfigurableCoffee implements Coffee {
  /*
   * The complete coffee configuration is stored directly in the class.
   */
  constructor(private readonly options: CoffeeOptions) {}

  /*
   * Builds a description of the coffee.
   *
   * This method must know about every possible ingredient.
   * Each time a new ingredient is added, this method must be modified.
   */
  getDescription(): string {
    let description = `${this.options.size} coffee`;

    /*
     * Add each selected ingredient to the description.
     */
    if (this.options.hasMilk) {
      description += ', milk';
    }

    if (this.options.hasSugar) {
      description += ', sugar';
    }

    if (this.options.hasWhippedCream) {
      description += ', whipped cream';
    }

    if (this.options.hasCaramel) {
      description += ', caramel';
    }

    return description;
  }

  /*
   * Calculates the total cost of the coffee.
   *
   * The method begins with the base price for the selected size and then
   * adds the price of every selected ingredient.
   */
  getCost(): number {
    let totalCost = this.getBasePrice();

    /*
     * Ingredient prices are hard-coded directly into this class.
     */
    if (this.options.hasMilk) {
      totalCost += 0.5;
    }

    if (this.options.hasSugar) {
      totalCost += 0.25;
    }

    if (this.options.hasWhippedCream) {
      totalCost += 0.75;
    }

    if (this.options.hasCaramel) {
      totalCost += 0.65;
    }

    return totalCost;
  }

  /*
   * Returns the base price according to the selected coffee size.
   *
   * This is another responsibility placed inside the same class.
   */
  private getBasePrice(): number {
    switch (this.options.size) {
      case CoffeeSize.Small:
        return 2.0;

      case CoffeeSize.Medium:
        return 2.5;

      case CoffeeSize.Large:
        return 3.0;

      default:
        /*
         * This protects the program if an invalid size somehow
         * reaches this method.
         */
        throw new Error('Unsupported coffee size.');
    }
  }
}

/*
 * Helper function used to display an order.
 */
function printCoffeeOrder(coffee: Coffee): void {
  console.log(`Order: ${coffee.getDescription()}`);
  console.log(`Cost: $${coffee.getCost().toFixed(2)}`);
  console.log();
}

/*
 * Client Code
 */

/*
 * Order 1:
 *
 * A small plain coffee with no additional ingredients.
 */
const plainCoffee: Coffee = new ConfigurableCoffee({
  size: CoffeeSize.Small,
  hasMilk: false,
  hasSugar: false,
  hasWhippedCream: false,
  hasCaramel: false,
});

printCoffeeOrder(plainCoffee);

/*
 * Order 2:
 *
 * A medium coffee with milk and sugar.
 */
const milkAndSugarCoffee: Coffee = new ConfigurableCoffee({
  size: CoffeeSize.Medium,
  hasMilk: true,
  hasSugar: true,
  hasWhippedCream: false,
  hasCaramel: false,
});

printCoffeeOrder(milkAndSugarCoffee);

/*
 * Order 3:
 *
 * A large coffee with milk, sugar, whipped cream, and caramel.
 */
const fullyLoadedCoffee: Coffee = new ConfigurableCoffee({
  size: CoffeeSize.Large,
  hasMilk: true,
  hasSugar: true,
  hasWhippedCream: true,
  hasCaramel: true,
});

printCoffeeOrder(fullyLoadedCoffee);
