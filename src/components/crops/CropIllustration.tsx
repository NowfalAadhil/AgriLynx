import type { CropId } from '../../types'

const leaf = (x: number, y: number, r: number, s = 1) => (
  <ellipse cx={x} cy={y} rx={26 * s} ry={10 * s} transform={`rotate(${r} ${x} ${y})`} fill="#65A879" />
)

/** Original flat illustrations (not photographs). */
export function CropIllustration({ crop, className = '' }: { crop: CropId; className?: string }) {
  return (
    <svg viewBox="0 0 400 240" className={className} role="img" aria-label={`Illustration of ${crop} plant`} preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="240" fill="#E8F3EA" />
      <circle cx="330" cy="55" r="22" fill="#F4E7C0" />
      <rect y="178" width="400" height="62" fill="#9B7B5C" />
      <rect y="178" width="400" height="8" fill="#7E6249" />
      {crop === 'tomato' && (
        <g>
          <path d="M200 180V70" stroke="#2D6A4F" strokeWidth="5" strokeLinecap="round" />
          <path d="M200 140l-45-30M200 120l50-28M200 95l-40-24" stroke="#2D6A4F" strokeWidth="3.5" strokeLinecap="round" />
          {leaf(150, 105, -25)}{leaf(160, 70, -20)}{leaf(255, 90, 25)}{leaf(205, 60, 0, 0.9)}
          {[[165, 150], [232, 135], [212, 160]].map(([x, y], i) => (
            <g key={i}><circle cx={x} cy={y} r="16" fill="#C8553D" /><path d={`M${x - 7} ${y - 13}l7 4 7-4`} stroke="#2D6A4F" strokeWidth="3" fill="none" strokeLinecap="round" /></g>
          ))}
          <path d="M175 180v-14M205 180v-30" stroke="#2D6A4F" strokeWidth="2" />
        </g>
      )}
      {crop === 'rice' && (
        <g strokeLinecap="round" fill="none">
          {[120, 160, 200, 240, 280].map((x, i) => (
            <g key={x}>
              <path d={`M${x} 180C${x} 120 ${x + 5 + i * 3} 80 ${x + 28} ${64 + i * 4}`} stroke="#4E9068" strokeWidth="4" />
              <path d={`M${x + 2} 150C${x + 20} 130 ${x + 30} 120 ${x + 40} 112`} stroke="#65A879" strokeWidth="3" />
              {[0, 1, 2, 3, 4].map((k) => (
                <ellipse key={k} cx={x + 28 + k * 2.5} cy={64 + i * 4 + k * 7} rx="3.4" ry="6" fill="#D9B65A" stroke="none" transform={`rotate(${25 + k * 6} ${x + 28 + k * 2.5} ${64 + i * 4 + k * 7})`} />
              ))}
            </g>
          ))}
          <path d="M0 196h400M0 212h400" stroke="#7FA5BF" strokeWidth="3" opacity=".5" />
        </g>
      )}
      {crop === 'cotton' && (
        <g>
          <path d="M200 182V60" stroke="#4E7A5B" strokeWidth="5" strokeLinecap="round" />
          <path d="M200 150l-55-30M200 125l60-32M200 100l-35-22" stroke="#4E7A5B" strokeWidth="3.5" strokeLinecap="round" />
          {leaf(135, 118, -25)}{leaf(270, 90, 25)}{leaf(155, 76, -20, 0.9)}{leaf(210, 55, 0, 0.8)}
          {[[150, 140], [250, 112], [195, 95]].map(([x, y], i) => (
            <g key={i}>
              <path d={`M${x - 14} ${y + 10}l14-18 14 18z`} fill="#7E6249" />
              {[[-8, -6], [8, -6], [0, -14], [-3, 0], [5, 0]].map(([dx, dy], k) => <circle key={k} cx={x + dx} cy={y + dy} r="9" fill="#FFFFFF" stroke="#DCE6DD" strokeWidth="1" />)}
            </g>
          ))}
        </g>
      )}
      {crop === 'groundnut' && (
        <g>
          {[150, 200, 250].map((x, i) => (
            <g key={x}>
              <path d={`M${x} 180V${120 - i * 6}`} stroke="#2D6A4F" strokeWidth="4" strokeLinecap="round" />
              {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy], k) => (
                <ellipse key={k} cx={x + sx * 15} cy={115 - i * 6 + sy * 9} rx="14" ry="8" transform={`rotate(${sx * sy * 30} ${x + sx * 15} ${115 - i * 6 + sy * 9})`} fill={k % 2 ? '#65A879' : '#4E9068'} />
              ))}
              <path d={`M${x} 182v22`} stroke="#7E6249" strokeWidth="2" />
              <g fill="#D8B98A" stroke="#B8945F" strokeWidth="1.5">
                <ellipse cx={x - 6} cy="212" rx="12" ry="7" /><ellipse cx={x + 12} cy="206" rx="11" ry="6.5" />
              </g>
            </g>
          ))}
        </g>
      )}
    </svg>
  )
}
