import type { AiSummary } from '../types/User';

type AiSummaryCardProps = {
  summary: AiSummary;
};

export function AiSummaryCard({ summary }: AiSummaryCardProps) {
  return (
    <section className="ai-summary-card">
      <div className="ai-summary-card__header">
        <div>
          <p className="eyebrow">AI Decision Support</p>
          <h2>User Summary</h2>
        </div>
        <span>{summary.riskLevel} risk</span>
      </div>

      <p className="ai-summary-overview">{summary.overview}</p>

      <div className="ai-stats-grid">
        <div>
          <span>Total</span>
          <strong>{summary.stats.totalUsers}</strong>
        </div>
        <div>
          <span>Active</span>
          <strong>{summary.stats.activeUsers}</strong>
        </div>
        <div>
          <span>Inactive</span>
          <strong>{summary.stats.inactiveUsers}</strong>
        </div>
        <div>
          <span>Admin</span>
          <strong>{summary.stats.adminUsers}</strong>
        </div>
      </div>

      <div className="ai-insights">
        <section className="ai-insight-panel">
          <h3>Risks</h3>
          <ul className="ai-risk-list">
            {summary.risks.map((risk) => (
              <li key={risk}>{risk}</li>
            ))}
          </ul>
        </section>

        <section className="ai-insight-panel ai-insight-panel--recommendations">
          <h3>User Recommendations</h3>
          <div className="recommendation-list">
            {summary.recommendations.map((recommendation, index) => (
              <article className="recommendation-card" key={recommendation}>
                <span>{index + 1}</span>
                <p>{recommendation}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
