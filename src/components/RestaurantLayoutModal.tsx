import { useState, useEffect } from "react";

const tables = [
  { id: 1, x: 40, y: 60, seats: 4, status: 'available' },
  { id: 2, x: 140, y: 60, seats: 2, status: 'occupied' },
  { id: 3, x: 240, y: 60, seats: 6, status: 'available' },
  { id: 4, x: 40, y: 140, seats: 4, status: 'reserved' },
  { id: 5, x: 140, y: 140, seats: 8, status: 'available' },
  { id: 6, x: 240, y: 140, seats: 2, status: 'available' },
  { id: 7, x: 90, y: 220, seats: 4, status: 'cleaning' },
  { id: 8, x: 190, y: 220, seats: 6, status: 'available' },
];

function Door({ x, y, rotation = 0 }: { x: number; y: number; rotation?: number }) {
  return (
    <div
      style={{
        position: "absolute",
        width: 40,
        height: 8,
        backgroundColor: "#8b7355",
        borderRadius: 2,
        left: x,
        top: y,
        transform: `rotate(${rotation}deg)`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }}
      aria-label="Door"
    />
  );
}

function Window({ x, y, rotation = 0 }: { x: number; y: number; rotation?: number }) {
  return (
    <div
      style={{
        position: "absolute",
        width: 40,
        height: 16,
        backgroundColor: "#f0f8ff",
        border: "1px solid #c5d3e0",
        borderRadius: 2,
        left: x,
        top: y,
        transform: `rotate(${rotation}deg)`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
      aria-label="Window"
    />
  );
}

function Counter({ x, y }: { x: number; y: number }) {
  return (
    <div
      style={{
        position: "absolute",
        width: 180,
        height: 25,
        backgroundColor: "#8b7355",
        borderRadius: 4,
        left: x,
        top: y,
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
      }}
      aria-label="Service Counter"
    >
      <span
        style={{
          color: "white",
          fontWeight: "500",
          fontSize: 11,
          lineHeight: "25px",
          paddingLeft: 8,
          userSelect: "none",
        }}
      >
        Service Counter
      </span>
    </div>
  );
}

function Plant({ x, y }: { x: number; y: number }) {
  return (
    <div
      style={{
        position: "absolute",
        width: 20,
        height: 20,
        left: x,
        top: y,
      }}
      aria-label="Plant decoration"
    >
      <div style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#228b22',
        borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
        boxShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        border: '1px solid #006400'
      }} />
      <div style={{
        position: 'absolute',
        width: 4,
        height: 8,
        backgroundColor: '#8B4513',
        bottom: -2,
        left: '50%',
        transform: 'translateX(-50%)',
        borderRadius: '0 0 2px 2px'
      }} />
    </div>
  );
}

function Table({
  id,
  x,
  y,
  seats,
  status,
  selected,
  onClick,
}: {
  id: number;
  x: number;
  y: number;
  seats: number;
  status: string;
  selected: boolean;
  onClick: () => void;
}) {
  const getStatusColor = () => {
    switch (status) {
      case 'available': return selected ? '#2c1810' : '#ffffff';
      case 'occupied': return '#e85a4f';
      case 'reserved': return '#d4a574';
      case 'cleaning': return '#9b9b9b';
      default: return '#ffffff';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'available': return '✓';
      case 'occupied': return '●';
      case 'reserved': return '◯';
      case 'cleaning': return '⧗';
      default: return '';
    }
  };

  const isClickable = status === 'available';

  return (
    <button
      onClick={isClickable ? onClick : undefined}
      disabled={!isClickable}
      aria-label={`Table ${id} - ${seats} seats - ${status}`}
      className={`absolute rounded-full flex flex-col items-center justify-center font-medium text-sm transition-all duration-200 ${
        isClickable 
          ? selected 
            ? "text-white shadow-lg border-2 border-amber-700" 
            : "border border-stone-300 hover:shadow-md cursor-pointer hover:border-amber-600"
          : "cursor-not-allowed opacity-60"
      }`}
      style={{ 
        left: x, 
        top: y, 
        width: seats <= 2 ? 60 : seats <= 4 ? 70 : seats <= 6 ? 80 : 90,
        height: seats <= 2 ? 60 : seats <= 4 ? 70 : seats <= 6 ? 80 : 90,
        backgroundColor: getStatusColor(),
        boxShadow: selected ? '0 0 12px rgba(180, 165, 116, 0.4)' : '0 1px 4px rgba(0,0,0,0.1)'
      }}
      type="button"
    >
      <div className="text-lg font-bold">{id}</div>
      <div className="text-xs opacity-80">{seats} seats</div>
      <div className="text-lg mt-1">{getStatusText()}</div>
    </button>
  );
}

function StatusLegend() {
  const statuses = [
    { status: 'available', color: '#ffffff', border: '#d1c7b7', text: 'Available', icon: '✓' },
    { status: 'occupied', color: '#e85a4f', border: '#c44339', text: 'Occupied', icon: '●' },
    { status: 'reserved', color: '#d4a574', border: '#b8935f', text: 'Reserved', icon: '◯' },
    { status: 'cleaning', color: '#9b9b9b', border: '#7a7a7a', text: 'Cleaning', icon: '⧗' },
  ];

  return (
    <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
      {statuses.map(({ status, color, border, text, icon }) => (
        <div key={status} className="flex items-center gap-2">
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2"
            style={{ backgroundColor: color, borderColor: border }}
          >
            {icon}
          </div>
          <span className="text-gray-700">{text}</span>
        </div>
      ))}
    </div>
  );
}

export default function RestaurantLayoutModal({
  selectedTable,
  onSelect,
  isOpen,
  onClose,
}: {
  selectedTable: string;
  onSelect: (tableNumber: string) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [hoveredTable, setHoveredTable] = useState<number | null>(null);

  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      window.addEventListener("keydown", onEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener("keydown", onEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const selectedTableData = tables.find(t => t.id === parseInt(selectedTable));

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-md z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed z-50 top-1/2 left-1/2 bg-white rounded-2xl shadow-2xl p-6 max-w-[450px] w-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 scale-100"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-semibold text-stone-800 mb-1">Table Selection</h3>
            <p className="text-sm text-stone-600">Choose an available table for your reservation</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-stone-600 text-2xl font-light leading-none hover:text-stone-800 transition-colors p-1"
          >
            ×
          </button>
        </div>

        {/* Restaurant Floor Plan */}
        <div
          style={{
            position: "relative",
            backgroundColor: "#faf9f7",
            border: "2px solid #d4c5b0",
            borderRadius: 12,
            width: 400,
            height: 340,
            margin: "0 auto 20px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
          aria-label="Restaurant floor plan"
        >
          {/* Subtle grid pattern */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(212,197,176,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212,197,176,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            borderRadius: 10
          }} />

          {/* Doors */}
          <Door x={180} y={-12} />
          <Door x={-12} y={140} rotation={90} />
          <Door x={378} y={140} rotation={90} />

          {/* Windows */}
          <Window x={80} y={-22} />
          <Window x={240} y={-22} />
          <Window x={-17} y={80} rotation={90} />
          <Window x={378} y={80} rotation={90} />

          {/* Plants removed for cleaner look */}

          {/* Counter */}
          <Counter x={110} y={285} />

          {/* Tables */}
          {tables.map((table) => (
            <div
              key={table.id}
              onMouseEnter={() => setHoveredTable(table.id)}
              onMouseLeave={() => setHoveredTable(null)}
            >
              <Table
                id={table.id}
                x={table.x}
                y={table.y}
                seats={table.seats}
                status={table.status}
                selected={selectedTable === String(table.id)}
                onClick={() => onSelect(String(table.id))}
              />
              {hoveredTable === table.id && table.status !== 'available' && (
                <div
                  className="absolute bg-black text-white text-xs px-2 py-1 rounded shadow-lg z-10 pointer-events-none"
                  style={{
                    left: table.x + 50,
                    top: table.y - 10,
                    transform: 'translateX(-50%)'
                  }}
                >
                  {table.status === 'occupied' && 'Currently occupied'}
                  {table.status === 'reserved' && 'Reserved for another party'}
                  {table.status === 'cleaning' && 'Being cleaned'}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Status Legend */}
        <StatusLegend />

        {/* Selected Table Info */}
        {selectedTableData && (
          <div className="mt-4 p-3 bg-stone-50 rounded-lg border border-stone-200">
            <h4 className="font-medium text-stone-700 mb-2">Selected Table Details</h4>
            <div className="text-sm text-stone-600">
              <p><strong>Table:</strong> #{selectedTableData.id}</p>
              <p><strong>Capacity:</strong> {selectedTableData.seats} guests</p>
              <p><strong>Status:</strong> {selectedTableData.status}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg font-medium hover:bg-stone-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (selectedTable) {
                onClose();
                // Here you could add additional logic for confirming the selection
              }
            }}
            disabled={!selectedTable || !selectedTableData || selectedTableData.status !== 'available'}
            className="flex-1 px-4 py-2 bg-stone-700 text-white rounded-lg font-medium hover:bg-stone-800 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors"
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </>
  );
}