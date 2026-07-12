// different methods of a document's lifecycle
interface DocumentState {
  submitForReview(document: DocumentConcrete): void;
  publish(document: DocumentConcrete): void;
  archive(document: DocumentConcrete): void;
  getName(): string;
}

// concrete document class that implements the DocumentState interface
class DocumentConcrete {
  //different states of the document
  // initial state is draft
  private state: 'draft' | 'review' | 'published' | 'archived' = 'draft';

  // method to submit the document for review
  submitForReview(): void {
    if (this.state === 'draft') {
      this.state = 'review';
      console.log('Document submitted for review.');
    } else {
      console.log('Cannot submit for review.');
    }
  }

  // method to publish the document
  publish(): void {
    if (this.state === 'review') {
      this.state = 'published';
      console.log('Document published.');
    } else {
      console.log('Cannot publish document.');
    }
  }

  // method to archive the document
  archive(): void {
    if (this.state === 'published') {
      this.state = 'archived';
      console.log('Document archived.');
    } else {
      console.log('Cannot archive document.');
    }
  }
}
