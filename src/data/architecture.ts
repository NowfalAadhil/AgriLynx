export type ImplStatus = 'Concept' | 'Prototype' | 'Demonstration' | 'Planned'

export interface ArchLayer {
  id: string
  title: string
  status: ImplStatus
  items: string[]
  note: string
}

export const LAYERS: ArchLayer[] = [
  { id: 'field', title: 'Agricultural Field', status: 'Concept', items: ['Crop rows and soil', 'Ambient air'], note: 'The environment to be observed. No physical field is connected in this prototype.' },
  { id: 'sensors', title: 'Sensor Layer', status: 'Concept', items: ['Soil moisture sensor', 'Temperature sensor', 'Humidity sensor', 'Optional light sensor'], note: 'Proposed sensors. In the web app, their readings are simulated.' },
  { id: 'iot', title: 'IoT Controller', status: 'Planned', items: ['ESP32', 'Sensor acquisition', 'Data processing', 'Wi-Fi communication'], note: 'ESP32 integration is planned. No firmware or hardware link is shipped in this web app.' },
  { id: 'app', title: 'Data / Application Layer', status: 'Prototype', items: ['Data transmission (planned)', 'Monitoring dashboard', 'Threshold logic', 'Image-analysis workflow', 'Alert generation'], note: 'Dashboard, threshold logic and alert generation are implemented against simulated data.' },
  { id: 'ui', title: 'User Interface', status: 'Prototype', items: ['Farm Monitoring', 'Crop Intelligence', 'Pest Analysis', 'Alerts', 'Insights'], note: 'The interactive web application you are viewing.' },
]

export interface ArchCard { title: string; status: ImplStatus; body: string }

export const ARCH_CARDS: ArchCard[] = [
  { title: 'Hardware', status: 'Concept', body: 'Soil moisture, temperature and humidity sensors (plus an optional light sensor) read by an ESP32 microcontroller. Not built or tested as part of this web app.' },
  { title: 'Communication', status: 'Planned', body: 'The controller would send readings over Wi-Fi to the application layer. The app currently reads deterministic sample data instead.' },
  { title: 'Software', status: 'Prototype', body: 'React + TypeScript front end with centralised data modules, a threshold engine and persisted user settings in the browser.' },
  { title: 'Analysis', status: 'Demonstration', body: 'Threshold rules are real logic. Image analysis is a demonstration workflow: it measures basic image properties but does not run a trained model.' },
  { title: 'User interaction', status: 'Prototype', body: 'Selecting crops and fields, adjusting thresholds, managing alerts, checklists and analysis history all work and persist locally.' },
]

export interface FeatureStatus { name: string; status: 'Implemented' | 'Simulated' | 'Planned'; detail: string }

export const FEATURE_STATUS: FeatureStatus[] = [
  { name: 'Dashboard, navigation and charts', status: 'Implemented', detail: 'Interactive UI built on sample data.' },
  { name: 'Threshold logic and alert rules', status: 'Implemented', detail: 'Rules evaluate the sample readings and update when thresholds change.' },
  { name: 'Alert management', status: 'Implemented', detail: 'Search, filter, acknowledge, resolve; saved in this browser.' },
  { name: 'Crop checklist and analysis history', status: 'Implemented', detail: 'Saved in this browser (localStorage).' },
  { name: 'Image upload and in-browser image properties', status: 'Implemented', detail: 'Validation, preview, brightness and colour-ratio measurements.' },
  { name: 'Sensor readings', status: 'Simulated', detail: 'Deterministic sample data, not from physical sensors.' },
  { name: 'Pest / damage analysis result', status: 'Simulated', detail: 'Template scenario; not AI model inference.' },
  { name: 'ESP32 live data and cloud sync', status: 'Planned', detail: 'Not implemented.' },
  { name: 'Validated ML pest detection', status: 'Planned', detail: 'Not implemented.' },
]

export interface RoadmapItem { title: string; detail: string }

export const ROADMAP: RoadmapItem[] = [
  { title: 'ESP32 live integration', detail: 'Read real sensors and push data to the app.' },
  { title: 'Real-time sensor data', detail: 'Replace simulated readings with live streams.' },
  { title: 'Cloud communication', detail: 'Store and sync readings across devices.' },
  { title: 'Validated ML pest detection', detail: 'Train and evaluate a model on labelled crop images before any accuracy is claimed.' },
  { title: 'Multispectral camera integration', detail: 'Add vegetation-index imagery beyond RGB photos.' },
  { title: 'Farm analytics', detail: 'Longer-term trends and comparisons across fields.' },
  { title: 'Crop-condition history', detail: 'Track how condition changes through the season.' },
  { title: 'Weather integration', detail: 'Bring local forecasts into the monitoring view.' },
  { title: 'Irrigation decision support', detail: 'Suggest irrigation timing from moisture trends and weather.' },
  { title: 'SMS or WhatsApp notifications', detail: 'Send alerts outside the app.' },
  { title: 'Regional-language support', detail: 'Make the interface usable in local languages.' },
  { title: 'Offline monitoring', detail: 'Keep working with poor connectivity.' },
  { title: 'Multi-field management', detail: 'Manage many fields and users in one account.' },
]
