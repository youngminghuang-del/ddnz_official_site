const JOURNEY_ACTIONS = new Set([
  'select_configuration', 'model_change', 'compare_products', 'read_guide',
  'specification_change', 'open_videos', 'select_video_stage', 'play_video',
  'open_calculator', 'calculator_change', 'create_brief', 'copy_brief',
  'download_brief', 'continue_inquiry',
]);

// Only fixed action names leave this feature. Never forward state, DOM events or URLs.
export function screenProtectorJourneyAnalytics(action) {
  if (typeof action !== 'string' || !JOURNEY_ACTIONS.has(action)) return null;
  return {
    event: 'screen_protector_journey',
    params: { content_group: 'screen_protectors', journey_action: action },
  };
}

export function localizedScreenProtectorJourneyAnalytics(locale, action) {
  if (!['zh','es','ar','ru','fr','pt','tr'].includes(locale)
    || !['select_configuration', 'create_brief', 'continue_inquiry'].includes(action)) return null;
  const payload = screenProtectorJourneyAnalytics(action);
  return { event: payload.event, params: { ...payload.params, content_language: locale } };
}

/** @param {(action: string) => void} [onAction] @param {AbortSignal} [signal] */
export function createScreenProtectorActionReporter(onAction, signal) {
  return action => {
    if (signal?.aborted || typeof onAction !== 'function' || !screenProtectorJourneyAnalytics(action)) return;
    try { onAction(action); } catch {
      // Optional telemetry must not interrupt the buyer's action.
    }
  };
}
