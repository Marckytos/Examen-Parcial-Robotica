// Constantes del robot
const L1 = 0.12; // 12 cm en metros
const L2 = 0.12; // 12 cm en metros
const PINZA_LENGTH = 0.02; // 2 cm en metros

// Cinemática Directa: De ángulos a posición (q -> x)
function cinematicaDirecta(q1, q2) {
    const x = L1 * Math.cos(q1) + L2 * Math.cos(q1 + q2);
    const y = L1 * Math.sin(q1) + L2 * Math.sin(q1 + q2);
    return { x, y };
}

// Cinemática Inversa: De posición a ángulos (x -> q)
function cinematicaInversa(xd, yd) {
    const c2 = (xd*xd + yd*yd - L1*L1 - L2*L2) / (2 * L1 * L2);
    
    // Verificar si está en espacio de trabajo
    if (Math.abs(c2) > 1) {
        return null; // Fuera del espacio de trabajo
    }
    
    const s2_pos = Math.sqrt(1 - c2*c2);
    const s2_neg = -s2_pos;
    
    // Dos soluciones posibles (configuración codo arriba/abajo)
    const q2_pos = Math.atan2(s2_pos, c2);
    const q2_neg = Math.atan2(s2_neg, c2);
    
    const q1_pos = Math.atan2(yd, xd) - Math.atan2(L2 * s2_pos, L1 + L2 * c2);
    const q1_neg = Math.atan2(yd, xd) - Math.atan2(L2 * s2_neg, L1 + L2 * c2);
    
    return { q1: q1_pos, q2: q2_pos }; // Retornamos una solución
}

// Verificación de espacio de trabajo
function enEspacioTrabajo(x, y) {
    const dist = Math.sqrt(x*x + y*y);
    return dist <= (L1 + L2) && dist >= Math.abs(L1 - L2);
}