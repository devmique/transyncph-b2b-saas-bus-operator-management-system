import L from 'leaflet'

export const terminalIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
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