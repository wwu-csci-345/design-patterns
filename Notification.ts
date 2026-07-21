export {};

// Product interface.
//
// Every notification type created by the factory method
// must implement this interface.
interface Notification {
  send(message: string): void;
}

// Concrete product.
//
// This class contains email-specific behavior.
class EmailNotification implements Notification {
  public send(message: string): void {
    console.log(`Email sent: ${message}`);
  }
}

// Concrete product.
//
// This class contains SMS-specific behavior.
class SmsNotification implements Notification {
  public send(message: string): void {
    console.log(`SMS sent: ${message}`);
  }
}

// Concrete product.
//
// A new product can be added without changing the creator's
// main notification workflow.
class PushNotification implements Notification {
  public send(message: string): void {
    console.log(`Push notification sent: ${message}`);
  }
}

// Creator.
//
// The creator declares the factory method but does not decide
// which concrete notification should be instantiated.
abstract class NotificationService {
  // Factory method.
  //
  // Subclasses override this method to select the concrete product.
  protected abstract createNotification(): Notification;

  // Shared business workflow.
  //
  // This method works only with the Notification interface.
  // It is not coupled to EmailNotification, SmsNotification,
  // or PushNotification.
  public notifyUser(message: string): void {
    console.log("Validating notification request...");

    const notification = this.createNotification();

    notification.send(message);

    console.log("Recording notification result...");
  }
}

// Concrete creator.
//
// This subclass determines that the product should be
// an EmailNotification.
class EmailNotificationService extends NotificationService {
  protected createNotification(): Notification {
    return new EmailNotification();
  }
}

// Concrete creator.
//
// This subclass determines that the product should be
// an SmsNotification.
class SmsNotificationService extends NotificationService {
  protected createNotification(): Notification {
    return new SmsNotification();
  }
}

// Concrete creator.
//
// This subclass determines that the product should be
// a PushNotification.
class PushNotificationService extends NotificationService {
  protected createNotification(): Notification {
    return new PushNotification();
  }
}

// Client code.
//
// The client works with the creator abstraction.
// It does not need to create notification products directly.
function runNotificationService(
  service: NotificationService,
  message: string,
): void {
  service.notifyUser(message);
}

runNotificationService(
  new EmailNotificationService(),
  "Your order has shipped.",
);

runNotificationService(
  new SmsNotificationService(),
  "Your verification code is 482913.",
);

runNotificationService(
  new PushNotificationService(),
  "You have a new message.",
);