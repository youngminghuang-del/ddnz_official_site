export const ANALYTICS_TEST_QUERY_PARAM = 'ddnz_test';
export const ANALYTICS_TEST_SESSION_KEY = 'ddnz_analytics_test_session';
export const ANALYTICS_TEST_CAMPAIGN_PREFIX = 'codex_validation';

type AnalyticsTestModeInput = {
  search: string;
  sessionDisabled: boolean;
};

type AnalyticsTestMode = {
  disabled: boolean;
  persistSessionDisabled: boolean;
};

export function resolveAnalyticsTestMode({
  search,
  sessionDisabled,
}: AnalyticsTestModeInput): AnalyticsTestMode {
  const params = new URLSearchParams(search);
  const explicitMode = params.get(ANALYTICS_TEST_QUERY_PARAM)?.toLowerCase();

  if (explicitMode === '0' || explicitMode === 'false' || explicitMode === 'off') {
    return { disabled: false, persistSessionDisabled: false };
  }

  if (explicitMode === '1' || explicitMode === 'true' || explicitMode === 'on') {
    return { disabled: true, persistSessionDisabled: true };
  }

  const campaign = params.get('utm_campaign')?.toLowerCase() || '';
  if (campaign.startsWith(ANALYTICS_TEST_CAMPAIGN_PREFIX)) {
    return { disabled: true, persistSessionDisabled: true };
  }

  return {
    disabled: sessionDisabled,
    persistSessionDisabled: sessionDisabled,
  };
}

export function isLocalAnalyticsHostname(hostname: string) {
  const normalizedHostname = hostname.toLowerCase();
  return (
    normalizedHostname === 'localhost' ||
    normalizedHostname === '127.0.0.1' ||
    normalizedHostname === '::1' ||
    normalizedHostname === '0.0.0.0' ||
    normalizedHostname.endsWith('.localhost') ||
    normalizedHostname.endsWith('.local')
  );
}
