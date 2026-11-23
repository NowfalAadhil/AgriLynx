import type { Crop, CropId } from '../types'

export const CROP_IDS: CropId[] = ['tomato', 'rice', 'cotton', 'groundnut']

export const CROPS: Record<CropId, Crop> = {
  tomato: {
    id: 'tomato',
    name: 'Tomato',
    scientific: 'Solanum lycopersicum',
    stages: ['Seedling', 'Vegetative growth', 'Flowering', 'Fruit set', 'Fruit ripening'],
    summary: 'A warm-season fruiting vegetable that is sensitive to both heat stress and uneven moisture.',
    environment: [
      'Flowering and fruit set can be affected when temperatures stay high or drop sharply.',
      'Persistently humid conditions with wet foliage tend to favour foliar diseases.',
      'Good airflow around plants helps leaves dry faster.',
    ],
    soilMoisture: [
      'Even moisture is generally preferred; large swings between dry and wet are a common stress factor.',
      'Water demand rises during flowering and fruit development.',
    ],
    stress: ['Heat stress (flower drop)', 'Irregular watering (fruit disorders)', 'Foliar blight-type diseases', 'Whitefly and leaf-curl problems', 'Fruit borers'],
    insights: [
      'Compare drip or irrigation timing with the soil moisture trend rather than a single reading.',
      'Check the underside of leaves when humidity stays high for several days.',
    ],
    monitoring: ['Soil moisture at root depth', 'Daytime peak temperature', 'Humidity during wet spells', 'Leaf and fruit condition'],
  },
  rice: {
    id: 'rice',
    name: 'Rice',
    scientific: 'Oryza sativa',
    stages: ['Nursery', 'Transplanting', 'Tillering', 'Panicle initiation', 'Flowering', 'Grain filling'],
    summary: 'A water-intensive cereal; water management and temperature around flowering are especially important.',
    environment: [
      'High temperatures around flowering can reduce grain set.',
      'Warm, humid conditions can favour fungal diseases such as blast-type problems.',
    ],
    soilMoisture: [
      'Many systems keep soil saturated or shallowly flooded; some use alternate wetting and drying.',
      'Soil moisture sensors in flooded fields behave differently from those in upland crops, so thresholds need local calibration.',
    ],
    stress: ['Water shortage at critical stages', 'Heat during flowering', 'Blast and sheath diseases', 'Planthoppers and stem borers', 'Nutrient imbalance'],
    insights: [
      'Water level and growth stage together matter more than a single moisture value.',
      'Scouting for pests is most useful at tillering and after warm, humid spells.',
    ],
    monitoring: ['Water depth / soil saturation', 'Temperature at flowering', 'Humidity and leaf wetness', 'Tiller and leaf condition'],
  },
  cotton: {
    id: 'cotton',
    name: 'Cotton',
    scientific: 'Gossypium hirsutum',
    stages: ['Germination', 'Squaring', 'Flowering', 'Boll development', 'Boll opening'],
    summary: 'A warm-climate fibre crop that tolerates some dryness but is sensitive to water stress at flowering and boll development.',
    environment: [
      'Very high temperatures during flowering can cause square and flower shedding.',
      'Excess humidity near boll maturity may encourage boll rot.',
    ],
    soilMoisture: [
      'Moisture stress during flowering and boll development can reduce yield potential.',
      'Overwatering and waterlogging can also harm roots.',
    ],
    stress: ['Moisture stress at flowering', 'Bollworm complex', 'Sucking pests (whitefly, aphids, jassids)', 'Square / boll shedding', 'Leaf-curl diseases'],
    insights: [
      'Regular scouting is the main tool for catching bollworm and sucking pests early.',
      'Review irrigation timing around flowering using soil moisture trends.',
    ],
    monitoring: ['Soil moisture trend', 'Daytime peak temperature', 'Square and boll retention', 'Pest scouting counts'],
  },
  groundnut: {
    id: 'groundnut',
    name: 'Groundnut',
    scientific: 'Arachis hypogaea',
    stages: ['Germination', 'Vegetative growth', 'Flowering and pegging', 'Pod development', 'Maturity'],
    summary: 'A legume that sets pods underground; pegging and pod development are sensitive to soil moisture and soil condition.',
    environment: [
      'Humid, wet spells can favour leaf-spot and rust diseases.',
      'Warm conditions are generally suitable, but extreme heat can affect flowering.',
    ],
    soilMoisture: [
      'Moisture stress during pegging and pod development can reduce pod fill.',
      'Waterlogging should be avoided; well-drained soil is generally preferred.',
    ],
    stress: ['Drought at pegging / pod stage', 'Leaf spot and rust', 'Collar and root rots', 'Leaf miner, thrips and aphids', 'Soil-borne pests (e.g. white grub)'],
    insights: [
      'Pod development is a key window for consistent soil moisture.',
      'Humid spells are a good trigger for extra leaf inspection.',
    ],
    monitoring: ['Soil moisture at pegging / pod stage', 'Humidity during wet spells', 'Leaf spotting', 'Drainage after rain'],
  },
}
