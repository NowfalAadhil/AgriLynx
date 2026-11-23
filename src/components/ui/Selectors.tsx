import { CROPS, CROP_IDS } from '../../data/crops'
import { FIELDS, FIELD_IDS } from '../../data/fields'
import { useApp } from '../../context/AppContext'
import { Segmented } from './primitives'

export function CropSelector() {
  const { crop, setCrop } = useApp()
  return <Segmented label="Select crop" value={crop} onChange={setCrop} options={CROP_IDS.map((c) => ({ value: c, label: CROPS[c].name }))} />
}

export function FieldSelector() {
  const { field, setField } = useApp()
  return <Segmented label="Select field" value={field} onChange={setField} options={FIELD_IDS.map((f) => ({ value: f, label: FIELDS[f].name }))} />
}
