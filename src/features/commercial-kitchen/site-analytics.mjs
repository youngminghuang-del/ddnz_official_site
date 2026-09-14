// Only aggregate counts and approved action names may enter the site's tracker.
export function kitchenExplorationAnalytics(action) {
  if (!['kitchen-journey', 'kitchen-guide', 'kitchen-category', 'add_to_list', 'add_assortment', 'plan_margin', 'model_entry', 'compare_models', 'start_brief'].includes(action)) return null;
  return { event: 'kitchen_exploration', params: { content_group: 'commercial_kitchen', exploration_action: action } };
}

export function kitchenCategoryAnalytics(category, action) {
  if (!['ice-machines', 'electric-fryers', 'electric-griddles'].includes(category)
    || !['compare_models', 'select_model', 'start_brief', 'price_context', 'read_guide', 'browse_range'].includes(action)) return null;
  return { event: 'kitchen_category_action', params: { content_group: 'commercial_kitchen', equipment_category: category, exploration_action: action } };
}

export function kitchenInquiryAnalytics(detail, preferences) {
  if (preferences?.tracking !== true || detail?.mode !== 'production') return null;
  const actions = ['submit_success', 'submit_error', 'whatsapp_draft', 'email_draft'];
  if (!actions.includes(detail.action)) return null;
  const productCount = Number(detail.productCount), unitCount = Number(detail.unitCount);
  if (!Number.isInteger(productCount) || productCount < 1 || productCount > 26
    || !Number.isInteger(unitCount) || unitCount < productCount || unitCount > 26 * 9999) return null;
  return {
    event: detail.action === 'submit_success' ? 'generate_lead' : 'kitchen_inquiry',
    params: { form_id: 'commercial_kitchen', inquiry_action: detail.action, product_count: productCount, unit_count: unitCount },
  };
}
