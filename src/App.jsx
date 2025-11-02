// App.js actualizado
import React, { useState, useEffect } from 'react';
import RobotVisualization from './components/RobotVisualization.jsx';
import GraficasTrayectoria from './components/GraficasTrayectoria.jsx';
import { generarTrayectoriaCompleta } from './utils/trayectorias.js';
import { cinematicaDirecta, cinematicaInversa, enEspacioTrabajo } from './utils/cinematica.js';
import './RobotApp.css';

const RobotApp = () => {
    const [posicionDeseada, setPosicionDeseada] = useState({ x: 0.14, y: 0.14 });
    const [angulosActuales, setAngulosActuales] = useState({ q1: Math.PI/2, q2: 0 });
    const [posicionActual, setPosicionActual] = useState({ x: 0.14, y: 0.14 });
    const [error, setError] = useState('');
    const [trayectoriaCartesiana, setTrayectoriaCartesiana] = useState([]);
    const [trayectoriaArticular, setTrayectoriaArticular] = useState({ q1: [], q2: [] });

    // Actualizar posición cuando cambian los ángulos
    useEffect(() => {
        const nuevaPos = cinematicaDirecta(angulosActuales.q1, angulosActuales.q2);
        setPosicionActual(nuevaPos);
    }, [angulosActuales]);

    // Mover a posición deseada
    const moverAPosicion = (xd, yd) => {
        if (!enEspacioTrabajo(xd, yd)) {
            setError(`Punto (${xd.toFixed(3)}, ${yd.toFixed(3)}) fuera del espacio de trabajo`);
            return;
        }
        
        const nuevosAngulos = cinematicaInversa(xd, yd);
        if (nuevosAngulos) {
            setAngulosActuales(nuevosAngulos);
            setError('');
            
            // Generar trayectoria
            const { trayectoriaCartesiana: trayectoria, trayectoriaArticular: articular } = 
                generarTrayectoriaCompleta(posicionActual, { x: xd, y: yd });
            
            setTrayectoriaCartesiana(trayectoria);
            setTrayectoriaArticular(articular);
        }
    };

    // Ir a posición inicial
    const irAPosicionInicial = () => {
        const nuevosAngulos = { q1: Math.PI/2, q2: 0 };
        setAngulosActuales(nuevosAngulos);
        setPosicionDeseada({ x: 0.14, y: 0.14 });
        setError('');
        setTrayectoriaCartesiana([]);
        setTrayectoriaArticular({ q1: [], q2: [] });
    };

    return (
        <div className="robot-app">
            <header className="app-header">
                <h1>Simulador de Robot Planar 2 GDL</h1>
                <p>Control y Visualización de Trayectorias</p>
            </header>
            
            <div className="contenedor-principal">
                <div className="panel-control">
                    <h3>Control del Robot</h3>
                    
                    <div className="control-grupo">
                        <label>Coordenada X deseada (m):</label>
                        <input 
                            type="number" 
                            step="0.01"
                            min="-0.24"
                            max="0.24"
                            value={posicionDeseada.x}
                            onChange={(e) => setPosicionDeseada({
                                ...posicionDeseada, 
                                x: parseFloat(e.target.value) || 0
                            })}
                        />
                    </div>
                    
                    <div className="control-grupo">
                        <label>Coordenada Y deseada (m):</label>
                        <input 
                            type="number" 
                            step="0.01"
                            min="0"
                            max="0.24"
                            value={posicionDeseada.y}
                            onChange={(e) => setPosicionDeseada({
                                ...posicionDeseada, 
                                y: parseFloat(e.target.value) || 0
                            })}
                        />
                    </div>
                    
                    <div className="botones-grupo">
                        <button onClick={() => moverAPosicion(posicionDeseada.x, posicionDeseada.y)}>
                            Mover a Posición Deseada
                        </button>
                        
                        <button onClick={irAPosicionInicial}>
                            ⬅️ Posición Inicial
                        </button>
                    </div>
                    
                    {error && (
                        <div className="error-mensaje">
                            ⚠️ {error}
                        </div>
                    )}
                    
                    <div className="info-actual">
                        <h4>Información Actual:</h4>
                        <p><strong>Posición actual TCP:</strong></p>
                        <p>X: {posicionActual.x.toFixed(3)} m</p>
                        <p>Y: {posicionActual.y.toFixed(3)} m</p>
                    </div>
                </div>

                <div className="visualizacion-robot">
                    <RobotVisualization 
                        q1={angulosActuales.q1}
                        q2={angulosActuales.q2}
                        trayectoria={trayectoriaCartesiana}
                    />
                </div>
            </div>

            <GraficasTrayectoria 
                trayectoriaArticular={trayectoriaArticular}
            />
        </div>
    );
};

export default RobotApp;