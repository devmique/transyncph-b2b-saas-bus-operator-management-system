import L from 'leaflet'

export const terminalIcon = L.divIcon({
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -34],
  html: `
    <div style="
      width:32px;height:32px;
      display:flex;align-items:center;justify-content:center;
      position:relative;
    ">
      <!-- pin body -->
      <div style="
        width:28px;height:28px;border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        background:#2563eb;border:2px solid #93c5fd;
        box-shadow:0 2px 8px rgba(37,99,235,0.4);
        display:flex;align-items:center;justify-content:center;
      ">
        <!-- icon inside pin -->
        <svg style="transform:rotate(45deg);width:13px;height:13px;" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="1" y="3" width="15" height="13" rx="2"/>
          <path d="M16 8h4l3 5v3h-7V8z"/>
          <circle cx="5.5" cy="18.5" r="2.5"/>
          <circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
      </div>
    </div>
  `,
})

export const busIcon = (vehicleNumber?: string) =>
  L.divIcon({
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
    html: `
      <div style="position:relative;width:40px;height:40px;display:flex;align-items:center;justify-content:center;">
        <span style="position:absolute;inset:0;border-radius:50%;background:rgba(59,130,246,0.25);animation:bus-pulse 1.6s ease-out infinite;"></span>
        <div style="width:26px;height:26px;border-radius:50%;background:#2563eb;border:2.5px solid #93c5fd;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 3px rgba(37,99,235,0.3);font-size:10px;font-weight:700;color:#fff;font-family:monospace;letter-spacing:-0.5px;line-height:1;z-index:1;">
          ${vehicleNumber ? vehicleNumber.slice(-3) : '🚌'}
        </div>
      </div>
      <style>
        @keyframes bus-pulse {
          0%   { transform:scale(0.8); opacity:0.8; }
          100% { transform:scale(2.2); opacity:0; }
        }
      </style>
    `,
  })