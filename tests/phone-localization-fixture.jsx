import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import InquiryPlanCard from '../src/features/screen-protectors/InquiryPlanCard.tsx';

// Keep router and card in one tsx module graph so they share the same context.
export function PlanCardFixture({ plan = null, missing = false, entry = '/' }) {
  return <MemoryRouter initialEntries={[entry]}><InquiryPlanCard plan={plan} missing={missing} onRemove={() => {}} /></MemoryRouter>;
}
