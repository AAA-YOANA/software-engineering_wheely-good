import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { mockScooters, ScooterStatus } from "../data/mockData";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export function ScooterMap() {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map centered on New York
    const map = L.map(mapContainerRef.current).setView([40.7589, -73.9851], 14);
    mapRef.current = map;

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Create custom icons for different statuses
    const createIcon = (status: ScooterStatus) => {
      const colors = {
        available: '#10b981',
        unavailable: '#f59e0b',
        maintenance: '#ef4444',
      };

      return L.divIcon({
        html: `
          <div style="
            background-color: ${colors[status]};
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: 12px;
              height: 12px;
              background-color: white;
              border-radius: 50%;
            "></div>
          </div>
        `,
        className: 'custom-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });
    };

    // Add markers for each scooter
    mockScooters.forEach((scooter) => {
      const icon = createIcon(scooter.status);
      const marker = L.marker([scooter.location.lat, scooter.location.lng], { icon }).addTo(map);

      const statusLabels = {
        available: 'Available',
        unavailable: 'In Use',
        maintenance: 'Maintenance',
      };

      marker.bindPopup(`
        <div style="font-family: system-ui; padding: 8px;">
          <h3 style="font-weight: bold; margin: 0 0 8px 0; font-size: 16px;">${scooter.name}</h3>
          <p style="margin: 4px 0; font-size: 14px;"><strong>ID:</strong> ${scooter.id}</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Status:</strong> ${statusLabels[scooter.status]}</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Battery:</strong> ${scooter.batteryLevel}%</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Location:</strong> ${scooter.location.address}</p>
        </div>
      `);
    });

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const stats = {
    available: mockScooters.filter(s => s.status === 'available').length,
    unavailable: mockScooters.filter(s => s.status === 'unavailable').length,
    maintenance: mockScooters.filter(s => s.status === 'maintenance').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Scooter Location Map</h1>
        <p className="text-slate-600 mt-2">
          Visual display of all scooter locations (Backlog ID 18)
        </p>
      </div>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Map Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-white shadow"></div>
              <span className="text-sm">Available ({stats.available})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-orange-500 border-2 border-white shadow"></div>
              <span className="text-sm">In Use ({stats.unavailable})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-white shadow"></div>
              <span className="text-sm">Maintenance ({stats.maintenance})</span>
            </div>
          </div>
          <p className="text-sm text-slate-600 mt-4">
            Click on any marker to view detailed scooter information
          </p>
        </CardContent>
      </Card>

      {/* Map */}
      <Card>
        <CardContent className="p-0">
          <div 
            ref={mapContainerRef} 
            className="w-full h-[600px] rounded-lg"
            style={{ minHeight: '600px' }}
          />
        </CardContent>
      </Card>

      {/* Scooter List */}
      <Card>
        <CardHeader>
          <CardTitle>All Scooter Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockScooters.map((scooter) => {
              const statusColors = {
                available: 'bg-green-100 text-green-800',
                unavailable: 'bg-orange-100 text-orange-800',
                maintenance: 'bg-red-100 text-red-800',
              };

              const statusLabels = {
                available: 'Available',
                unavailable: 'In Use',
                maintenance: 'Maintenance',
              };

              return (
                <div
                  key={scooter.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-slate-900">{scooter.name}</h3>
                      <Badge className={statusColors[scooter.status]}>
                        {statusLabels[scooter.status]}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">{scooter.location.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Battery</p>
                    <p className="text-lg font-bold text-slate-900">{scooter.batteryLevel}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}