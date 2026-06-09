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
          <p className="eyebrow">AI döntéstámogatás</p>
          <h2>Az AI összefoglaló nem jeleníthető meg</h2>
          <p>
            A felhasználói lista továbbra is használható. Kérlek, frissítsd az
            elemzést vagy próbáld újra később.
          </p>
        </section>
      );
    }

    return this.props.children;
  }
}
