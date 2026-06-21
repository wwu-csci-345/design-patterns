class PurchasingService {
  handleStockChange(
    productId: string,
    quantity: number,
    reorderLevel: number,
  ): void {
    if (quantity <= reorderLevel) {
      console.log(
        `[Purchasing] Creating purchase request for ${productId}. ` +
          `Current quantity: ${quantity}`,
      );
    }
  }
}

class OperationsDashboard {
  handleStockChange(
    productId: string,
    quantity: number,
    reorderLevel: number,
  ): void {
    const status = quantity <= reorderLevel ? 'LOW STOCK' : 'NORMAL';

    console.log(`[Dashboard] ${productId}: ${quantity} units - ${status}`);
  }
}

class WarehouseInventory {
  private stock = new Map<string, number>();

  // Direct dependencies on concrete observer classes
  private purchasingService: PurchasingService;
  private operationsDashboard: OperationsDashboard;

  constructor(
    purchasingService: PurchasingService,
    operationsDashboard: OperationsDashboard,
  ) {
    this.purchasingService = purchasingService;
    this.operationsDashboard = operationsDashboard;
  }

  updateStock(productId: string, quantity: number, reorderLevel: number): void {
    if (quantity < 0) {
      throw new Error('Quantity cannot be negative.');
    }

    this.stock.set(productId, quantity);

    console.log(`[Inventory] ${productId} updated to ${quantity} units.`);

    // Manually notify each concrete observer
    this.purchasingService.handleStockChange(productId, quantity, reorderLevel);

    this.operationsDashboard.handleStockChange(
      productId,
      quantity,
      reorderLevel,
    );
  }
}

// Usage example
const purchasingService = new PurchasingService();
const operationsDashboard = new OperationsDashboard();

const inventory = new WarehouseInventory(
  purchasingService,
  operationsDashboard,
);

inventory.updateStock('LAPTOP-15', 18, 10);
inventory.updateStock('LAPTOP-15', 7, 10);
