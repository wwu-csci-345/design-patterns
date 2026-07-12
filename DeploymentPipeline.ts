type DeploymentStatus = 'started' | 'succeeded' | 'failed';

type DeploymentEvent = {
  application: string;
  environment: string;
  status: DeploymentStatus;

  // Optional fields are included because only some deployment events need them.
  // For example, a successful deployment does not need an error message.
  errorMessage?: string;
  incidentId?: string;
};

// Observer interface.
//
// Every observer receives the same event object. The pipeline does not need
// to know what each observer does with the event.
interface DeploymentObserver {
  update(event: DeploymentEvent): void;
}

// Concrete observer #1.
//
// This observer is responsible only for sending Slack-style deployment messages.
class SlackDeploymentNotifier implements DeploymentObserver {
  update(event: DeploymentEvent): void {
    const { application, environment, status, errorMessage } = event;

    if (status === 'failed') {
      console.log(
        `[Slack] ALERT: ${application} deployment to ${environment} failed. ` +
          `Reason: ${errorMessage ?? 'Unknown error.'}`,
      );
      return;
    }

    console.log(
      `[Slack] ${application} deployment to ${environment}: ${status}`,
    );
  }
}

// Concrete observer #2.
//
// This observer is responsible only for recording deployment history.
class DeploymentAuditLogger implements DeploymentObserver {
  update(event: DeploymentEvent): void {
    const { application, environment, status, errorMessage, incidentId } =
      event;

    console.log(
      `[Audit] ${new Date().toISOString()} | ` +
        `app=${application} | env=${environment} | status=${status}`,
    );

    if (status === 'failed') {
      console.log(
        `[Audit] Failure details | ` +
          `incidentId=${incidentId ?? 'none'} | ` +
          `error=${errorMessage ?? 'none'}`,
      );
    }
  }
}

// Concrete observer #3.
//
// This observer demonstrates that new behavior can be added without changing
// DeploymentPipeline. The pipeline does not need to know that this class exists.
class PagerDutyIncidentNotifier implements DeploymentObserver {
  update(event: DeploymentEvent): void {
    const { application, environment, status, incidentId, errorMessage } =
      event;

    if (status !== 'failed') {
      return;
    }

    console.log(
      `[PagerDuty] Creating incident for ${application} in ${environment}. ` +
        `Incident ID: ${incidentId ?? 'not assigned'}. ` +
        `Reason: ${errorMessage ?? 'Unknown error.'}`,
    );
  }
}

// Subject interface.
//
// This is optional but useful for showing the formal Observer structure.
// A subject allows observers to subscribe, unsubscribe, and receive events.
interface DeploymentSubject {
  addObserver(observer: DeploymentObserver): void;
  removeObserver(observer: DeploymentObserver): void;
  notifyObservers(event: DeploymentEvent): void;
}

// Concrete subject.
//
// DeploymentPipeline owns the deployment workflow.
// It does not own Slack behavior, audit behavior, PagerDuty behavior, or any
// other observer-specific behavior.
class DeploymentPipeline implements DeploymentSubject {
  private readonly observers: DeploymentObserver[] = [];

  addObserver(observer: DeploymentObserver): void {
    this.observers.push(observer);
  }

  removeObserver(observer: DeploymentObserver): void {
    const index = this.observers.indexOf(observer);

    if (index === -1) {
      return;
    }

    this.observers.splice(index, 1);
  }

  deploy(application: string, environment: string, shouldFail: boolean): void {
    this.notifyObservers({
      application,
      environment,
      status: 'started',
    });

    console.log(`[Pipeline] Deploying ${application} to ${environment}...`);

    if (shouldFail) {
      this.notifyObservers({
        application,
        environment,
        status: 'failed',
        errorMessage: 'Database migration timed out.',
        incidentId: 'INC-2048',
      });

      return;
    }

    this.notifyObservers({
      application,
      environment,
      status: 'succeeded',
    });
  }

  notifyObservers(event: DeploymentEvent): void {
    for (const observer of this.observers) {
      observer.update(event);
    }
  }
}

// Usage

const pipeline = new DeploymentPipeline();

const slackNotifier = new SlackDeploymentNotifier();
const auditLogger = new DeploymentAuditLogger();
const pagerDutyNotifier = new PagerDutyIncidentNotifier();

// Observers are registered dynamically.
// DeploymentPipeline only knows that they implement DeploymentObserver.
pipeline.addObserver(slackNotifier);
pipeline.addObserver(auditLogger);
pipeline.addObserver(pagerDutyNotifier);

pipeline.deploy('customer-api', 'production', true);

console.log('--- Removing PagerDuty observer ---');

pipeline.removeObserver(pagerDutyNotifier);

pipeline.deploy('billing-service', 'staging', false);
