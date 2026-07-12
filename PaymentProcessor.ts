/*
 * A modern payment processor.
 *
 * Its method accepts an amount in dollars.
 */
class ModernPaymentProcessor {
  pay(amountInDollars: number): void {
    console.log(
      `Modern payment processor charged $${amountInDollars.toFixed(2)}.`,
    );
  }
}

/*
 * A legacy payment gateway.
 *
 * Its interface is incompatible with ModernPaymentProcessor because:
 *
 * 1. It uses a different method name.
 * 2. It expects the amount in cents instead of dollars.
 * 3. It requires a currency code.
 */
class LegacyPaymentGateway {
  makePayment(amountInCents: number, currencyCode: string): void {
    console.log(
      `Legacy payment gateway processed ${amountInCents} cents in ${currencyCode}.`,
    );
  }
}

/*
 * The checkout service directly depends on both concrete payment classes.
 *
 * Because no adapter is used, CheckoutService must know:
 *
 * - Which payment system is being used.
 * - Which method should be called.
 * - Which unit each payment system expects.
 * - Which extra parameters the legacy system requires.
 */
class CheckoutService {
  private readonly modernProcessor: ModernPaymentProcessor;
  private readonly legacyGateway: LegacyPaymentGateway;

  constructor(
    modernProcessor: ModernPaymentProcessor,
    legacyGateway: LegacyPaymentGateway,
  ) {
    this.modernProcessor = modernProcessor;
    this.legacyGateway = legacyGateway;
  }

  /*
   * Processes checkout using the modern payment processor.
   *
   * This method can pass the amount directly because the modern processor
   * already expects dollars.
   */
  checkoutWithModernProcessor(amountInDollars: number): void {
    this.validateAmount(amountInDollars);

    console.log(`Starting modern checkout for $${amountInDollars.toFixed(2)}.`);

    this.modernProcessor.pay(amountInDollars);

    console.log('Modern checkout completed.');
  }

  /*
   * Processes checkout using the legacy payment gateway.
   *
   * The checkout service must perform provider-specific translation because
   * there is no adapter to isolate this responsibility.
   */
  checkoutWithLegacyGateway(
    amountInDollars: number,
    currencyCode: string,
  ): void {
    this.validateAmount(amountInDollars);

    console.log(`Starting legacy checkout for $${amountInDollars.toFixed(2)}.`);

    /*
     * The legacy gateway expects cents rather than dollars.
     *
     * This conversion logic is now part of CheckoutService, even though
     * converting payment formats is not really a checkout responsibility.
     */
    const amountInCents = Math.round(amountInDollars * 100);

    /*
     * CheckoutService must call the legacy-specific method and provide
     * the additional currency argument.
     */
    this.legacyGateway.makePayment(amountInCents, currencyCode);

    console.log('Legacy checkout completed.');
  }

  /*
   * Shared validation logic.
   */
  private validateAmount(amountInDollars: number): void {
    if (!Number.isFinite(amountInDollars)) {
      throw new Error('The checkout amount must be a finite number.');
    }

    if (amountInDollars <= 0) {
      throw new Error('The checkout amount must be greater than zero.');
    }
  }
}

/*
 * Create the concrete payment systems.
 */
const modernProcessor = new ModernPaymentProcessor();
const legacyGateway = new LegacyPaymentGateway();

/*
 * CheckoutService must receive both concrete dependencies.
 */
const checkoutService = new CheckoutService(modernProcessor, legacyGateway);

/*
 * The caller must choose a provider-specific checkout method.
 */
checkoutService.checkoutWithModernProcessor(49.99);

console.log('--------------------');

checkoutService.checkoutWithLegacyGateway(49.99, 'USD');
