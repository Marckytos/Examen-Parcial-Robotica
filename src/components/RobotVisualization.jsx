// components/RobotVisualization.jsx
import React from 'react';

const RobotVisualization = ({ q1, q2, trayectoria = [] }) => {
    const L1 = 0.12; // 12 cm en metros
    const L2 = 0.12; // 12 cm en metros
    const PINZA_LENGTH = 0.02; // 2 cm en metros

    // Calculamos las coordenadas de los puntos del robot
    const x1 = L1 * Math.cos(q1);
    const y1 = L1 * Math.sin(q1);
    const x2 = x1 + L2 * Math.cos(q1 + q2);
    const y2 = y1 + L2 * Math.sin(q1 + q2);

    // Configuración del SVG - escalamos para mejor visualización
    const scale = 400; // 400 píxeles por metro
    const centerX = 200;
    const centerY = 200;

    const toSVG = (x, y) => ({
        x: centerX + x * scale,
        y: centerY - y * scale // Invertimos Y para que positivo sea arriba
    });

    const p0 = toSVG(0, 0);
    const p1 = toSVG(x1, y1);
    const p2 = toSVG(x2, y2);

    // Pinza (herramienta)
    const pinzaAngle = q1 + q2;
    const pinzaEndX = x2 + PINZA_LENGTH * Math.cos(pinzaAngle);
    const pinzaEndY = y2 + PINZA_LENGTH * Math.sin(pinzaAngle);
    const pPinza = toSVG(pinzaEndX, pinzaEndY);

    return (
        <div className="robot-visualization">
            <svg 
                width="400" 
                height="400" 
                viewBox="0 0 400 400"
                style={{ border: '1px solid #ccc', background: '#f9f9f9' }}
            >
                {/* Ejes coordenados */}
                <line x1="0" x2="400" y1={centerY} y2={centerY} stroke="#ddd" strokeWidth="1" />
                <line x1={centerX} x2={centerX} y1="0" y2="400" stroke="#ddd" strokeWidth="1" />
                
                {/* Trayectoria deseada (línea punteada) */}
                {trayectoria.length > 1 && (
                    <polyline
                        points={trayectoria.map(p => {
                            const point = toSVG(p.x, p.y);
                            return `${point.x},${point.y}`;
                        }).join(' ')}
                        fill="none"
                        stroke="blue"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                    />
                )}

                {/* Eslabón 1 */}
                <line
                    x1={p0.x} y1={p0.y}
                    x2={p1.x} y2={p1.y}
                    stroke="black"
                    strokeWidth="6"
                />
                
                {/* Eslabón 2 */}
                <line
                    x1={p1.x} y1={p1.y}
                    x2={p2.x} y2={p2.y}
                    stroke="black"
                    strokeWidth="6"
                />

                {/* Pinza */}
                <line
                    x1={p2.x} y1={p2.y}
                    x2={pPinza.x} y2={pPinza.y}
                    stroke="red"
                    strokeWidth="3"
                />

                {/* Articulaciones */}
                <circle cx={p0.x} cy={p0.y} r="5" fill="blue" />
                <circle cx={p1.x} cy={p1.y} r="5" fill="blue" />
                <circle cx={p2.x} cy={p2.y} r="5" fill="red" />

                {/* Etiquetas */}
                <text x={p0.x + 10} y={p0.y - 10} fontSize="12">Base (0,0)</text>
                <text x={p2.x + 10} y={p2.y - 10} fontSize="12">
                    TCP: ({x2.toFixed(2)}, {y2.toFixed(2)})
                </text>
            </svg>
            
            <div className="robot-info">
                <p><strong>Ángulos actuales:</strong></p>
                <p>q₁: {(q1 * 180 / Math.PI).toFixed(1)}°</p>
                <p>q₂: {(q2 * 180 / Math.PI).toFixed(1)}°</p>
                <p><strong>Posición TCP:</strong></p>
                <p>X: {x2.toFixed(3)} m, Y: {y2.toFixed(3)} m</p>
            </div>
        </div>
    );
};

export default RobotVisualization;