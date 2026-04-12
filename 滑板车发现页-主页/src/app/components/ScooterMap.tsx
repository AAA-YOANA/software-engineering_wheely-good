import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export type ScooterStatus = 'available' | 'low-battery' | 'in-use';

export interface Scooter {
  id: string;
  position: [number, number];
  battery: number;
  status: ScooterStatus;
  image: string;
}

interface ScooterMapProps {
  scooters: Scooter[];
  onScooterClick: (scooter: Scooter) => void;
  selectedScooterId?: string;
}

// 创建自定义图标
const createScooterIcon = (status: ScooterStatus, isSelected: boolean) => {
  let color = '#10b981'; // 绿色 - 可用
  
  if (status === 'low-battery') {
    color = '#f59e0b'; // 橙色 - 低电量
  } else if (status === 'in-use') {
    color = '#6b7280'; // 灰色 - 使用中
  }
  
  const iconHtml = `
    <div style="
      width: 40px;
      height: 40px;
      background: ${color};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: ${isSelected ? '3px solid #3b82f6' : '3px solid white'};
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transition: all 0.3s ease;
    ">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="7" width="16" height="10" rx="2" ry="2"/>
        <line x1="22" y1="11" x2="22" y2="13"/>
        ${status === 'available' ? '<line x1="6" y1="11" x2="14" y2="11"/><line x1="6" y1="15" x2="14" y2="15"/>' : ''}
        ${status === 'low-battery' ? '<line x1="6" y1="11" x2="10" y2="11"/><line x1="6" y1="15" x2="10" y2="15"/>' : ''}
      </svg>
    </div>
  `;
  
  return L.divIcon({
    html: iconHtml,
    className: 'custom-scooter-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

export function ScooterMap({ scooters, onScooterClick, selectedScooterId }: ScooterMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  // 初始化地图
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const center: [number, number] = scooters.length > 0
      ? [
          scooters.reduce((sum, s) => sum + s.position[0], 0) / scooters.length,
          scooters.reduce((sum, s) => sum + s.position[1], 0) / scooters.length,
        ]
      : [39.9042, 116.4074];

    const map = L.map(mapContainerRef.current).setView(center, 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 更新标记
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const currentMarkers = markersRef.current;

    // 移除不存在的标记
    const scooterIds = new Set(scooters.map(s => s.id));
    currentMarkers.forEach((marker, id) => {
      if (!scooterIds.has(id)) {
        marker.remove();
        currentMarkers.delete(id);
      }
    });

    // 添加或更新标记
    scooters.forEach((scooter) => {
      const existingMarker = currentMarkers.get(scooter.id);
      const icon = createScooterIcon(scooter.status, scooter.id === selectedScooterId);

      if (existingMarker) {
        // 更新现有标记
        existingMarker.setIcon(icon);
        existingMarker.setLatLng(scooter.position);
      } else {
        // 创建新标记
        const marker = L.marker(scooter.position, { icon })
          .addTo(map)
          .on('click', () => onScooterClick(scooter));
        currentMarkers.set(scooter.id, marker);
      }
    });

    // 调整地图视图以包含所有标记
    if (scooters.length > 0) {
      const bounds = L.latLngBounds(scooters.map(s => s.position));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [scooters, selectedScooterId, onScooterClick]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
}
