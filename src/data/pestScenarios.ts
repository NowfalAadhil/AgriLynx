import type { CropId, DemoSeverity } from '../types'

export interface Scenario {
  id: string
  observation: string
  concern: string
  severity: DemoSeverity
}

/**
 * TEMPLATE LIBRARY used by the demonstration workflow.
 * A scenario is picked from this list by a hash of the file name and size.
 * It does NOT reflect the content of the uploaded image.
 */
export const SCENARIOS: Record<CropId | 'other', Scenario[]> = {
  tomato: [
    { id: 'tom-1', severity: 'low', observation: 'Example: a few leaves with minor discoloration at the edges.', concern: 'Could be nutrient imbalance, irregular watering or early stress. Needs in-person verification.' },
    { id: 'tom-2', severity: 'moderate', observation: 'Example: scattered brown leaf spots on lower leaves.', concern: 'Possible foliar disease, more likely in humid spells. Needs in-person verification.' },
    { id: 'tom-3', severity: 'high', observation: 'Example: curled leaves with small holes on several plants.', concern: 'Possible sucking-pest or chewing-pest activity. Needs in-person verification.' },
  ],
  rice: [
    { id: 'ric-1', severity: 'low', observation: 'Example: light yellowing on some leaf tips.', concern: 'Could relate to nutrient status or water management. Needs in-person verification.' },
    { id: 'ric-2', severity: 'moderate', observation: 'Example: small spindle-shaped lesions on a few leaves.', concern: 'Possible fungal leaf disease. Needs in-person verification.' },
    { id: 'ric-3', severity: 'high', observation: 'Example: patches of drying plants in one part of the field.', concern: 'Possible pest or water-stress pattern. Needs in-person verification.' },
  ],
  cotton: [
    { id: 'cot-1', severity: 'low', observation: 'Example: slight leaf edge curling on a few plants.', concern: 'Could be moisture or heat stress. Needs in-person verification.' },
    { id: 'cot-2', severity: 'moderate', observation: 'Example: small insects and honeydew-like residue on leaves.', concern: 'Possible sucking-pest presence. Needs in-person verification.' },
    { id: 'cot-3', severity: 'high', observation: 'Example: damaged squares with small entry holes.', concern: 'Possible bollworm-type feeding. Needs in-person verification.' },
  ],
  groundnut: [
    { id: 'gnt-1', severity: 'low', observation: 'Example: mild yellowing on older leaves.', concern: 'Could be nutrient, moisture or natural ageing. Needs in-person verification.' },
    { id: 'gnt-2', severity: 'moderate', observation: 'Example: dark circular spots on leaflets.', concern: 'Possible leaf-spot disease, more likely in humid spells. Needs in-person verification.' },
    { id: 'gnt-3', severity: 'high', observation: 'Example: winding mines or tunnels in leaflets.', concern: 'Possible leaf-miner activity. Needs in-person verification.' },
  ],
  other: [
    { id: 'oth-1', severity: 'low', observation: 'Example: minor leaf discoloration.', concern: 'Cause cannot be inferred from a demo. Needs in-person verification.' },
    { id: 'oth-2', severity: 'moderate', observation: 'Example: spots or marks on several leaves.', concern: 'Possible disease or pest activity. Needs in-person verification.' },
    { id: 'oth-3', severity: 'high', observation: 'Example: visible leaf damage across multiple plants.', concern: 'Possible pest or disease pressure. Needs in-person verification.' },
  ],
}

export const NEXT_STEPS: Record<DemoSeverity, string[]> = {
  low: [
    'Inspect several plants around the one photographed, not only the visible symptom.',
    'Take additional photos in daylight: whole plant, close-up, and underside of leaves.',
    'Re-check in a few days to see whether symptoms change.',
  ],
  moderate: [
    'Walk the field and inspect plants in several places to see how widespread the symptoms are.',
    'Capture additional images (whole plant, affected leaf, underside of leaf) and compare with healthy plants.',
    'Verify the symptoms with a local agricultural expert or extension service before taking action.',
  ],
  high: [
    'Inspect surrounding plants promptly to see whether the symptoms are spreading.',
    'Capture clear close-up and whole-plant images and note the location in the field.',
    'Consult a local agricultural expert or extension service (for example, a Krishi Vigyan Kendra in India) and rely on regional guidance before applying any treatment.',
  ],
}
