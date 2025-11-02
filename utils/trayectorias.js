// utils/trayectorias.js

// Generar coeficientes para polinomio de 5° orden
function generarPolinomioQuintico(qi, qf, qpi, qpf, qppi, qppf, ti, tf) {
    const T = tf - ti;
    const T2 = T * T;
    const T3 = T2 * T;
    const T4 = T3 * T;
    const T5 = T4 * T;

    const a0 = qi;
    const a1 = qpi;
    const a2 = qppi / 2;
    
    const A = qf - (a0 + a1 * T + a2 * T2);
    const B = qpf - (a1 + 2 * a2 * T);
    const C = qppf - 2 * a2;

    const a3 = (10 * A / T3) - (4 * B / T2) + (C / (2 * T));
    const a4 = (-15 * A / T4) + (7 * B / T3) - (C / T2);
    const a5 = (6 * A / T5) - (3 * B / T4) + (C / (2 * T3));

    return [a0, a1, a2, a3, a4, a5];
}

// Evaluar polinomio en tiempo t
function evaluarPolinomio(coeficientes, t, ti) {
    const tau = t - ti;
    const [a0, a1, a2, a3, a4, a5] = coeficientes;
    
    return a0 + 
           a1 * tau + 
           a2 * tau * tau + 
           a3 * tau * tau * tau + 
           a4 * tau * tau * tau * tau + 
           a5 * tau * tau * tau * tau * tau;
}

// Generar trayectoria completa
export function generarTrayectoriaCompleta(posicionInicial, posicionDeseada, ti = 0, tf = 20, numPuntos = 100) {
    const deltaT = (tf - ti) / numPuntos;
    const trayectoria = [];
    const trayectoriaArticular = { q1: [], q2: [] };

    // Generar trayectoria cartesiana con polinomios de 5° orden
    const coefX = generarPolinomioQuintico(
        posicionInicial.x, posicionDeseada.x,
        0, 0, 0, 0, ti, tf
    );
    
    const coefY = generarPolinomioQuintico(
        posicionInicial.y, posicionDeseada.y,
        0, 0, 0, 0, ti, tf
    );

    for (let i = 0; i <= numPuntos; i++) {
        const t = ti + i * deltaT;
        const x = evaluarPolinomio(coefX, t, ti);
        const y = evaluarPolinomio(coefY, t, ti);
        
        trayectoria.push({ x, y });

        // Calcular ángulos correspondientes
        const angulos = cinematicaInversa(x, y);
        if (angulos) {
            trayectoriaArticular.q1.push({ tiempo: t, valor: angulos.q1 });
            trayectoriaArticular.q2.push({ tiempo: t, valor: angulos.q2 });
        }
    }

    return { trayectoriaCartesiana: trayectoria, trayectoriaArticular };
}