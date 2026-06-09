import { render, screen } from '@testing-library/react';
import type React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AiSummaryErrorBoundary } from './AiSummaryErrorBoundary';

function BrokenAiSummary(): React.JSX.Element {
  throw new Error('Broken AI summary');
}

describe('AiSummaryErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <AiSummaryErrorBoundary>
        <p>AI summary is healthy.</p>
      </AiSummaryErrorBoundary>
    );

    expect(screen.getByText('AI summary is healthy.')).toBeVisible();
  });

  it('renders a fallback when a child throws during render', () => {
    render(
      <AiSummaryErrorBoundary>
        <BrokenAiSummary />
      </AiSummaryErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeVisible();
    expect(
      screen.getByRole('heading', {
        name: 'The AI summary could not be displayed',
      })
    ).toBeVisible();
    expect(screen.getByText(/The user list is still available/)).toBeVisible();
  });
});
