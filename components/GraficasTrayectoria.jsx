// components/GraficasTrayectoria.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const GraficasTrayectoria = ({ trayectoriaArticular }) => {
    if (!trayectoriaArticular || trayectoriaArticular.q1.length === 0) {
        return (
            <div className="graficas-trayectoria">
                <h3>Trayectorias Articulares</h3>
                <p>No hay datos de trayectoria para mostrar</p>
            </div>
        );
    }

    // Combinar datos para las gráficas
    const datosGrafica = trayectoriaArticular.q1.map((punto, index) => ({
        tiempo: punto.tiempo,
        q1: punto.valor * 180 / Math.PI, // Convertir a grados
        q2: trayectoriaArticular.q2[index].valor * 180 / Math.PI // Convertir a grados
    }));

    return (
        <div className="graficas-trayectoria">
            <h3>Trayectorias Articulares Deseadas</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={datosGrafica}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="tiempo" 
                        label={{ value: 'Tiempo (s)', position: 'insideBottomRight', offset: -5 }}
                    />
                    <YAxis 
                        label={{ value: 'Ángulo (°)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip />
                    <Legend />
                    <Line 
                        type="monotone" 
                        dataKey="q1" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        dot={false}
                        name="q₁d (θ₁)"
                    />
                    <Line 
                        type="monotone" 
                        dataKey="q2" 
                        stroke="#82ca9d" 
                        strokeWidth={2}
                        dot={false}
                        name="q₂d (θ₂)"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default GraficasTrayectoria;