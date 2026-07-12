/**
 * COMPANY STRUCTURE
 * 1. Individual employee classes do not implement a shared Employee interface.
 * 2. Manager is a separate type with different operations.
 * 3. A Manager stores individual employees and child managers separately.
 * 4. Client code must know whether it is working with:
 *    - a Developer,
 *    - a Designer,
 *    - a QA Engineer,
 *    - a Business Analyst,
 *    - or a Manager.
 * 5. Recursive operations require explicit type checks.
 */

/**
 * Represents a developer.
 *
 * This class is completely independent from the other employee classes.
 * It does not implement a shared employee abstraction.
 */
class Developer {
  constructor(
    private readonly name: string,
    private readonly salary: number,
  ) {}

  getName(): string {
    return this.name;
  }

  getSalary(): number {
    return this.salary;
  }

  printInformation(indent: string = ''): void {
    console.log(
      `${indent}Developer: ${this.name} - $${this.salary.toLocaleString()}`,
    );
  }
}

/**
 * Represents a designer.
 *
 * Notice that this class repeats much of the same code found in Developer.
 */
class Designer {
  constructor(
    private readonly name: string,
    private readonly salary: number,
  ) {}

  getName(): string {
    return this.name;
  }

  getSalary(): number {
    return this.salary;
  }

  printInformation(indent: string = ''): void {
    console.log(
      `${indent}Designer: ${this.name} - $${this.salary.toLocaleString()}`,
    );
  }
}

/**
 * Represents a quality assurance engineer.
 *
 * Again, this class repeats the same basic employee behavior.
 */
class QualityAssuranceEngineer {
  constructor(
    private readonly name: string,
    private readonly salary: number,
  ) {}

  getName(): string {
    return this.name;
  }

  getSalary(): number {
    return this.salary;
  }

  printInformation(indent: string = ''): void {
    console.log(
      `${indent}QA Engineer: ${this.name} - $${this.salary.toLocaleString()}`,
    );
  }
}

/**
 * Represents a business analyst.
 */
class BusinessAnalyst {
  constructor(
    private readonly name: string,
    private readonly salary: number,
  ) {}

  getName(): string {
    return this.name;
  }

  getSalary(): number {
    return this.salary;
  }

  printInformation(indent: string = ''): void {
    console.log(
      `${indent}Business Analyst: ${this.name} - $${this.salary.toLocaleString()}`,
    );
  }
}

/**
 * A union type representing all individual employee types.
 *
 * This is not the Composite pattern.
 *
 * It is only a convenient way to tell TypeScript that a value may be
 * one of several concrete employee classes.
 *
 * Every time a new employee type is added, this union must be updated.
 */
type IndividualEmployee =
  | Developer
  | Designer
  | QualityAssuranceEngineer
  | BusinessAnalyst;

/**
 * Represents a manager.
 *
 * Manager does not share a common interface with individual employees.
 *
 * It maintains two separate collections:
 *
 * 1. individualEmployees
 * 2. childManagers
 *
 * This separation is necessary because there is no common Component
 * abstraction that represents both employees and managers.
 */
class Manager {
  private readonly individualEmployees: IndividualEmployee[] = [];
  private readonly childManagers: Manager[] = [];

  constructor(
    private readonly name: string,
    private readonly salary: number,
    private readonly title: string,
  ) {}

  getName(): string {
    return this.name;
  }

  getSalary(): number {
    return this.salary;
  }

  getTitle(): string {
    return this.title;
  }

  /**
   * Adds an individual employee.
   *
   * This method cannot accept another Manager because Manager is not
   * part of the IndividualEmployee union.
   */
  addEmployee(employee: IndividualEmployee): void {
    this.individualEmployees.push(employee);
  }

  /**
   * Adds another manager.
   *
   * A separate method is required because managers and individual
   * employees are represented by unrelated types.
   */
  addManager(manager: Manager): void {
    this.childManagers.push(manager);
  }

  /**
   * Removes an individual employee.
   */
  removeEmployee(employee: IndividualEmployee): void {
    const index = this.individualEmployees.indexOf(employee);

    if (index !== -1) {
      this.individualEmployees.splice(index, 1);
    }
  }

  /**
   * Removes a child manager.
   */
  removeManager(manager: Manager): void {
    const index = this.childManagers.indexOf(manager);

    if (index !== -1) {
      this.childManagers.splice(index, 1);
    }
  }

  /**
   * Returns a copy of the direct individual employees.
   */
  getEmployees(): readonly IndividualEmployee[] {
    return [...this.individualEmployees];
  }

  /**
   * Returns a copy of the direct child managers.
   */
  getManagers(): readonly Manager[] {
    return [...this.childManagers];
  }

  /**
   * Calculates the total salary below this manager.
   *
   * Because managers and employees do not share a common abstraction,
   * the method must process them in two separate loops.
   */
  calculateTotalSalary(): number {
    let total = this.salary;

    // Process individual employees.
    for (const employee of this.individualEmployees) {
      total += getIndividualEmployeeSalary(employee);
    }

    // Process child managers separately.
    for (const manager of this.childManagers) {
      total += manager.calculateTotalSalary();
    }

    return total;
  }

  /**
   * Prints this manager and everything below this manager.
   *
   * Individual employees and child managers must be handled separately.
   */
  printDepartment(indent: string = ''): void {
    console.log(
      `${indent}${this.title}: ${this.name} - $${this.salary.toLocaleString()}`,
    );

    const childIndent = `${indent}    `;

    // Print individual employees.
    for (const employee of this.individualEmployees) {
      printIndividualEmployee(employee, childIndent);
    }

    // Print child managers separately.
    for (const manager of this.childManagers) {
      manager.printDepartment(childIndent);
    }
  }
}

/**
 * Returns the salary of an individual employee.
 *
 * The function must check every concrete employee type.
 *
 * This is one of the main problems caused by not using the Composite
 * pattern. Client or helper code must understand every concrete type.
 */
function getIndividualEmployeeSalary(employee: IndividualEmployee): number {
  if (employee instanceof Developer) {
    return employee.getSalary();
  }

  if (employee instanceof Designer) {
    return employee.getSalary();
  }

  if (employee instanceof QualityAssuranceEngineer) {
    return employee.getSalary();
  }

  if (employee instanceof BusinessAnalyst) {
    return employee.getSalary();
  }

  /**
   * This branch should be unreachable if the union type is complete.
   *
   * However, when a new employee class is introduced, this function
   * may also need to be updated.
   */
  throw new Error('Unsupported employee type.');
}

/**
 * Prints an individual employee.
 *
 * Once again, the function must explicitly recognize every concrete type.
 */
function printIndividualEmployee(
  employee: IndividualEmployee,
  indent: string,
): void {
  if (employee instanceof Developer) {
    employee.printInformation(indent);
    return;
  }

  if (employee instanceof Designer) {
    employee.printInformation(indent);
    return;
  }

  if (employee instanceof QualityAssuranceEngineer) {
    employee.printInformation(indent);
    return;
  }

  if (employee instanceof BusinessAnalyst) {
    employee.printInformation(indent);
    return;
  }

  throw new Error('Unsupported employee type.');
}

/**
 * Counts all individual employees under a manager.
 *
 * Managers and individual employees must again be processed separately.
 */
function countEmployeesUnderManager(manager: Manager): number {
  let count = manager.getEmployees().length;

  for (const childManager of manager.getManagers()) {
    // Count the child manager as an employee.
    count += 1;

    // Recursively count everyone below the child manager.
    count += countEmployeesUnderManager(childManager);
  }

  return count;
}

/**
 * Searches for a person by name.
 *
 * Because Manager and individual employees have unrelated types,
 * the search logic must separately examine both collections.
 */
function findPersonByName(
  manager: Manager,
  targetName: string,
): Manager | IndividualEmployee | null {
  // Check the current manager.
  if (manager.getName() === targetName) {
    return manager;
  }

  // Check all direct individual employees.
  for (const employee of manager.getEmployees()) {
    if (getIndividualEmployeeName(employee) === targetName) {
      return employee;
    }
  }

  // Recursively search through child managers.
  for (const childManager of manager.getManagers()) {
    const result = findPersonByName(childManager, targetName);

    if (result !== null) {
      return result;
    }
  }

  return null;
}

/**
 * Returns the name of an individual employee.
 *
 * This is another helper function that must understand every concrete
 * employee class.
 */
function getIndividualEmployeeName(employee: IndividualEmployee): string {
  if (employee instanceof Developer) {
    return employee.getName();
  }

  if (employee instanceof Designer) {
    return employee.getName();
  }

  if (employee instanceof QualityAssuranceEngineer) {
    return employee.getName();
  }

  if (employee instanceof BusinessAnalyst) {
    return employee.getName();
  }

  throw new Error('Unsupported employee type.');
}

/**
 * Client code that constructs the company.
 */

// Engineering employees
const developerAlice = new Developer('Alice', 120_000);
const developerBob = new Developer('Bob', 115_000);
const qaEngineerCarol = new QualityAssuranceEngineer('Carol', 100_000);

// Engineering manager
const engineeringManager = new Manager('David', 160_000, 'Engineering Manager');

engineeringManager.addEmployee(developerAlice);
engineeringManager.addEmployee(developerBob);
engineeringManager.addEmployee(qaEngineerCarol);

// Product employees
const designerEva = new Designer('Eva', 105_000);
const analystFrank = new BusinessAnalyst('Frank', 98_000);

// Product manager
const productManager = new Manager('Grace', 150_000, 'Product Manager');

productManager.addEmployee(designerEva);
productManager.addEmployee(analystFrank);

// CEO
const ceo = new Manager('Helen', 250_000, 'CEO');

/**
 * Because managers and individual employees use different methods,
 * the CEO must add department managers through addManager().
 */
ceo.addManager(engineeringManager);
ceo.addManager(productManager);

/**
 * Print the entire company structure.
 */
console.log('COMPANY STRUCTURE');
console.log('-----------------');

ceo.printDepartment();

/**
 * Calculate the total payroll.
 */
const totalCompanySalary = ceo.calculateTotalSalary();

console.log(`\nTotal company salary: $${totalCompanySalary.toLocaleString()}`);

/**
 * Count everyone below the CEO.
 *
 * The CEO is not included in this result because the function counts
 * only the people below the supplied manager.
 */
const peopleBelowCeo = countEmployeesUnderManager(ceo);

console.log(`People below the CEO: ${peopleBelowCeo}`);

/**
 * Search for an employee.
 */
const searchResult = findPersonByName(ceo, 'Eva');

if (searchResult === null) {
  console.log('Person not found.');
} else if (searchResult instanceof Manager) {
  console.log(
    `Found manager: ${searchResult.getName()}, ` + `${searchResult.getTitle()}`,
  );
} else {
  console.log(
    `Found individual employee: ` +
      `${getIndividualEmployeeName(searchResult)}`,
  );
}
