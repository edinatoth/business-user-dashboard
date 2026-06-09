import { Component, type ErrorInfo, type ReactNode } from 'react';

type AiSummaryErrorBoundaryProps = {
  children: ReactNode;
};

type AiSummaryErrorBoundaryState = {
  hasError: boolean;
};

export class AiSummaryErrorBoundary extends Component<
  AiSummaryErrorBoundaryProps,
  AiSummaryErrorBoundaryState
> {
  state: AiSummaryErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): AiSummaryErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AI summary render error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="ai-boundary-fallback" role="alert">
          <p className="eyebrow">AI Decision Support</p>
          <h2>The AI summary could not be displayed</h2>
          <p>
            The user list is still available. Refresh the analysis or try again
            later.
          </p>
        </section>
      );
    }

    return this.props.children;
  }
}
