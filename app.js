/**
 * SignosSemáforo - Validador Rápido de Signos Vitales (Solo Adultos)
 * Optimizaciones Clínicas: Cálculo de PAM, Validaciones de Seguridad, Notas SOAPIE y Turno Nocturno
 * Universidad de Boyacá - Facultad de Ciencias de la Salud
 * Estudiante: William Esteban Forero Ojeda (Cód. 66625059)
 * Docente: Santiago Correal
 */

// ============================================================
// 1. EVALUACIONES CLÍNICAS Y CÁLCULO DE PAM
// ============================================================

/**
 * Calcula y evalúa la Presión Arterial Media (PAM)
 * Fórmula: PAM = (PAS + 2*PAD) / 3
 * Normal: 70 - 105 mmHg | Alerta Hipoperfusión: < 65 mmHg
 */
function calcularYEvaluarPAM(pas, pad) {
  if (isNaN(pas) || isNaN(pad) || pas <= pad || pas <= 0 || pad <= 0) {
    return null;
  }

  const pam = (pas + (2 * pad)) / 3;
  const pamRedondeada = Math.round(pam * 10) / 10;

  let status = 'green';
  let badge = 'Normal (70–105 mmHg)';
  let alertaHipoperfusion = false;
  let mensajeAlerta = '';

  if (pamRedondeada < 65) {
    status = 'red';
    badge = 'Alerta: Hipoperfusión (<65)';
    alertaHipoperfusion = true;
    mensajeAlerta = '⚠️ Alerta de Hipoperfusión Tisular (PAM < 65 mmHg): Riesgo de isquemia miocárdica y daño renal.';
  } else if (pamRedondeada < 70) {
    status = 'yellow';
    badge = 'Límite Bajo (65–69 mmHg)';
  } else if (pamRedondeada >= 70 && pamRedondeada <= 105) {
    status = 'green';
    badge = 'Normal (Perfusión adecuada)';
  } else {
    // Mayor a 105 mmHg
    status = 'yellow';
    badge = 'Elevada (>105 mmHg)';
  }

  return {
    valor: pamRedondeada,
    status: status,
    badge: badge,
    alertaHipoperfusion: alertaHipoperfusion,
    mensajeAlerta: mensajeAlerta
  };
}

/**
 * Evalúa la Presión Arterial en Adultos con validación de seguridad (PAS > PAD)
 */
function evaluarPA(pas, pad) {
  if (isNaN(pas) && isNaN(pad)) return null;

  if (isNaN(pas) || isNaN(pad)) {
    return {
      status: 'neutral',
      badge: 'Incompleto',
      detail: 'Ingrese tanto Sistólica (PAS) como Diastólica (PAD)',
      cardClass: ''
    };
  }

  // Validación de seguridad clínica: PAS debe ser estrictamente mayor a PAD
  if (pas <= pad) {
    return {
      status: 'neutral',
      badge: 'Inconsistencia',
      detail: 'Cifras inconsistentes: La PAS debe ser mayor que la PAD.',
      cardClass: 'card-border-red'
    };
  }

  // Alerta Crítica (Rojo)
  if (pas < 80 || pad < 50) {
    return {
      status: 'red',
      badge: 'Alerta: Hipotensión Severa',
      detail: 'Hipotensión marcada. Riesgo inminente de shock o hipoperfusión. Avisar de inmediato.',
      cardClass: 'card-border-red'
    };
  }
  if (pas >= 180 || pad >= 120) {
    return {
      status: 'red',
      badge: 'Alerta: Crisis Hipertensiva',
      detail: 'Cifras en rango de crisis hipertensiva. Notificar de urgencia para valoración médica.',
      cardClass: 'card-border-red'
    };
  }
  if (pas >= 140 || pad >= 90) {
    return {
      status: 'red',
      badge: 'Alerta: Hipertensión Grado 2',
      detail: 'Hipertensión arterial significativa. Notificar a supervisión clínica.',
      cardClass: 'card-border-red'
    };
  }

  // Alteración Leve (Amarillo)
  if ((pas >= 80 && pas < 90) || (pad >= 50 && pad < 60)) {
    return {
      status: 'yellow',
      badge: 'Alteración: Hipotensión Leve',
      detail: 'Presión limítrofe baja. Vigilar sintomatología (mareo, palidez, frialdad distal).',
      cardClass: 'card-border-yellow'
    };
  }
  if ((pas >= 121 && pas <= 139) || (pad >= 81 && pad <= 89)) {
    return {
      status: 'yellow',
      badge: 'Alteración: Presión Elevada',
      detail: 'Prehipertensión / PA elevada. Reposar al paciente 5 min y corroborar brazalete.',
      cardClass: 'card-border-yellow'
    };
  }

  // Normal (Verde)
  if (pas >= 90 && pas <= 120 && pad >= 60 && pad <= 80) {
    return {
      status: 'green',
      badge: 'Normal (Normotensión)',
      detail: 'Presión arterial óptima dentro de parámetros fisiológicos esperados para adulto.',
      cardClass: 'card-border-green'
    };
  }

  return {
    status: 'yellow',
    badge: 'Discrepancia tensional',
    detail: 'Revisar colocación del tensiómetro y brazalete acorde a contextura.',
    cardClass: 'card-border-yellow'
  };
}

/**
 * Evalúa la Frecuencia Cardíaca (lpm) en Adultos
 */
function evaluarFC(fc) {
  if (isNaN(fc)) return null;
  if (fc <= 0) return null;

  if (fc < 50) {
    return {
      status: 'red',
      badge: 'Alerta: Bradicardia Severa',
      detail: 'Menor a 50 lpm. Evaluar perfusión periférica, estado de alerta y avisar de inmediato.',
      cardClass: 'card-border-red'
    };
  }
  if (fc >= 120) {
    return {
      status: 'red',
      badge: 'Alerta: Taquicardia Severa',
      detail: 'Mayor o igual a 120 lpm. Descartar dolor, fiebre, hipovolemia o arritmia.',
      cardClass: 'card-border-red'
    };
  }
  if (fc >= 50 && fc < 60) {
    return {
      status: 'yellow',
      badge: 'Alteración: Bradicardia Leve',
      detail: '50–59 lpm. Frecuente en deportistas o por fármacos cronotrópicos negativos.',
      cardClass: 'card-border-yellow'
    };
  }
  if (fc > 100 && fc < 120) {
    return {
      status: 'yellow',
      badge: 'Alteración: Taquicardia Leve',
      detail: '101–119 lpm. Valorar estado emocional, dolor o esfuerzo previo.',
      cardClass: 'card-border-yellow'
    };
  }
  if (fc >= 60 && fc <= 100) {
    return {
      status: 'green',
      badge: 'Normal (Normocardia)',
      detail: '60–100 lpm. Frecuencia y ritmo de pulso en rango esperado para adulto.',
      cardClass: 'card-border-green'
    };
  }

  return null;
}

/**
 * Evalúa la Frecuencia Respiratoria (rpm) en Adultos
 */
function evaluarFR(fr) {
  if (isNaN(fr)) return null;
  if (fr <= 0) return null;

  if (fr < 10) {
    return {
      status: 'red',
      badge: 'Alerta: Bradipnea Severa',
      detail: 'Menor a 10 rpm. Depresión respiratoria crítica. Requiere asistencia inmediata.',
      cardClass: 'card-border-red'
    };
  }
  if (fr >= 25) {
    return {
      status: 'red',
      badge: 'Alerta: Taquipnea Severa',
      detail: 'Mayor o igual a 25 rpm. Signo temprano de dificultad ventilatoria o sepsis.',
      cardClass: 'card-border-red'
    };
  }
  if (fr >= 10 && fr <= 11) {
    return {
      status: 'yellow',
      badge: 'Alteración: Bradipnea Leve',
      detail: '10–11 rpm. Monitorizar patrón y profundidad ventilatoria.',
      cardClass: 'card-border-yellow'
    };
  }
  if (fr >= 21 && fr <= 24) {
    return {
      status: 'yellow',
      badge: 'Alteración: Taquipnea Leve',
      detail: '21–24 rpm. Observar uso de musculatura accesoria o aleteo.',
      cardClass: 'card-border-yellow'
    };
  }
  if (fr >= 12 && fr <= 20) {
    return {
      status: 'green',
      badge: 'Normal (Eupnea)',
      detail: '12–20 rpm. Patrón ventilatorio regular, rítmico y sin tirajes.',
      cardClass: 'card-border-green'
    };
  }

  return null;
}

/**
 * Evalúa la Temperatura Corporal (°C) en Adultos
 */
function evaluarTemp(temp) {
  if (isNaN(temp)) return null;
  if (temp < 25 || temp > 45) return null;

  if (temp < 35.5) {
    return {
      status: 'red',
      badge: 'Alerta: Hipotermia',
      detail: 'Menor a 35.5 °C. Proteger con mantas térmicas e informar inmediatamente.',
      cardClass: 'card-border-red'
    };
  }
  if (temp >= 38.0) {
    return {
      status: 'red',
      badge: 'Alerta: Fiebre (Pirexia)',
      detail: 'Mayor o igual a 38.0 °C. Reportar para medios físicos o antipiréticos ordenados.',
      cardClass: 'card-border-red'
    };
  }
  if (temp >= 37.6 && temp <= 37.9) {
    return {
      status: 'yellow',
      badge: 'Alteración: Febrícula',
      detail: '37.6–37.9 °C. Estado febrícula. Reevaluar en 30 minutos y vigilar hidratación.',
      cardClass: 'card-border-yellow'
    };
  }
  if (temp >= 35.5 && temp < 36.0) {
    return {
      status: 'yellow',
      badge: 'Alteración: Hipotermia Leve',
      detail: '35.5–35.9 °C. Abrigamiento adecuado y corroborar termómetro.',
      cardClass: 'card-border-yellow'
    };
  }
  if (temp >= 36.0 && temp <= 37.5) {
    return {
      status: 'green',
      badge: 'Normal (Afebril / Normotermia)',
      detail: '36.0–37.5 °C. Temperatura corporal en equilibrio homeostático.',
      cardClass: 'card-border-green'
    };
  }

  return null;
}

/**
 * Evalúa la Saturación de Oxígeno (%) según Altitud
 */
function evaluarSpO2(spo2, modoAltitud) {
  if (isNaN(spo2)) return null;
  if (spo2 < 0 || spo2 > 100) return null;

  const esTunja = (modoAltitud === 'tunja');

  if (esTunja) {
    if (spo2 < 85) {
      return {
        status: 'red',
        badge: 'Alerta: Hipoxemia Severa',
        detail: 'Menor al 85% en Tunja (2.810 m). Compromiso de oxigenación. Avisar urgente.',
        cardClass: 'card-border-red'
      };
    }
    if (spo2 >= 85 && spo2 < 90) {
      return {
        status: 'yellow',
        badge: 'Alteración: Hipoxemia Leve (Altura)',
        detail: '85–89% en Tunja. Valorar patrón respiratorio y permeabilidad de vía aérea.',
        cardClass: 'card-border-yellow'
      };
    }
    if (spo2 >= 90 && spo2 <= 100) {
      return {
        status: 'green',
        badge: 'Normal (Aceptable en Tunja)',
        detail: '≥ 90%. Saturación adecuada para altitud de Tunja (2.810 msnm).',
        cardClass: 'card-border-green'
      };
    }
  } else {
    if (spo2 < 90) {
      return {
        status: 'red',
        badge: 'Alerta: Hipoxemia Severa',
        detail: 'Menor a 90%. Alerta para el servicio. Requiere oxigenoterapia inmediata.',
        cardClass: 'card-border-red'
      };
    }
    if (spo2 >= 90 && spo2 <= 94) {
      return {
        status: 'yellow',
        badge: 'Alteración: Hipoxemia Leve/Moderada',
        detail: '90–94%. Valorar perfusión periférica, frío distal o esmalte de uñas.',
        cardClass: 'card-border-yellow'
      };
    }
    if (spo2 >= 95 && spo2 <= 100) {
      return {
        status: 'green',
        badge: 'Normal (Normosaturación)',
        detail: '95–100%. Saturación arterial de oxígeno óptima a nivel del mar.',
        cardClass: 'card-border-green'
      };
    }
  }

  return {
    status: 'yellow',
    badge: 'Lectura atípica',
    detail: 'Verificar adecuada colocación del sensor del oxímetro.',
    cardClass: 'card-border-yellow'
  };
}


// ============================================================
// 2. CONTROLADORES DEL DOM Y ELEMENTOS
// ============================================================

const inputPAS = document.getElementById('input-pas');
const inputPAD = document.getElementById('input-pad');
const inputFC = document.getElementById('input-fc');
const inputFR = document.getElementById('input-fr');
const inputTemp = document.getElementById('input-temp');
const inputSpO2 = document.getElementById('input-spo2');
const selectAltitude = document.getElementById('altitude-mode');

// Badges y Feedbacks
const badgePA = document.getElementById('badge-pa');
const feedbackPA = document.getElementById('feedback-pa');
const cardPA = document.getElementById('card-pa');

const badgeFC = document.getElementById('badge-fc');
const feedbackFC = document.getElementById('feedback-fc');
const cardFC = document.getElementById('card-fc');

const badgeFR = document.getElementById('badge-fr');
const feedbackFR = document.getElementById('feedback-fr');
const cardFR = document.getElementById('card-fr');

const badgeTemp = document.getElementById('badge-temp');
const feedbackTemp = document.getElementById('feedback-temp');
const cardTemp = document.getElementById('card-temp');

const badgeSpO2 = document.getElementById('badge-spo2');
const feedbackSpO2 = document.getElementById('feedback-spo2');
const cardSpO2 = document.getElementById('card-spo2');

// Elementos de Error de Validación
const errorPA = document.getElementById('error-pa');
const errorFC = document.getElementById('error-fc');
const errorFR = document.getElementById('error-fr');
const errorTemp = document.getElementById('error-temp');
const errorSpO2 = document.getElementById('error-spo2');

// Elementos de PAM
const pamValueEl = document.getElementById('pam-value');
const pamBadgeEl = document.getElementById('pam-badge');
const pamAlertEl = document.getElementById('pam-alert');

// Banner Global y Reporte
const bannerGlobal = document.getElementById('global-status-banner');
const bannerTitle = document.getElementById('banner-title');
const bannerDesc = document.getElementById('banner-desc');
const bannerIcon = document.getElementById('banner-icon');
const reportTextarea = document.getElementById('report-textarea');

const refAltitudeLabel = document.getElementById('ref-altitude-label');
const refSpO2Ranges = document.getElementById('ref-spo2-ranges');

// SVGs reutilizables para el banner global
const ICON_WAITING = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
const ICON_GREEN = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>`;
const ICON_YELLOW = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
const ICON_RED = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;


// ============================================================
// 3. VALIDACIÓN Y SEGURIDAD DE DATOS
// ============================================================

function mostrarErrorCampo(elementoError, mensaje) {
  if (mensaje) {
    elementoError.textContent = mensaje;
    elementoError.classList.add('show');
  } else {
    elementoError.textContent = '';
    elementoError.classList.remove('show');
  }
}

/**
 * Actualiza la UI de cada tarjeta con bordes dinámicos de semáforo
 */
function actualizarUIElemento(evaluacion, badgeEl, feedbackEl, cardEl) {
  badgeEl.className = 'traffic-badge';
  feedbackEl.className = 'clinical-feedback';
  cardEl.classList.remove('card-border-green', 'card-border-yellow', 'card-border-red');

  if (!evaluacion) {
    badgeEl.classList.add('badge-neutral');
    badgeEl.querySelector('.badge-text').textContent = 'Sin datos';
    feedbackEl.textContent = '';
    feedbackEl.classList.remove('show');
    return;
  }

  if (evaluacion.status === 'green') {
    badgeEl.classList.add('badge-green');
    feedbackEl.classList.add('fb-green', 'show');
    cardEl.classList.add('card-border-green');
  } else if (evaluacion.status === 'yellow') {
    badgeEl.classList.add('badge-yellow');
    feedbackEl.classList.add('fb-yellow', 'show');
    cardEl.classList.add('card-border-yellow');
  } else if (evaluacion.status === 'red') {
    badgeEl.classList.add('badge-red');
    feedbackEl.classList.add('fb-red', 'show');
    cardEl.classList.add('card-border-red');
  } else {
    badgeEl.classList.add('badge-neutral');
  }

  badgeEl.querySelector('.badge-text').textContent = evaluacion.badge;
  feedbackEl.textContent = evaluacion.detail;
}

/**
 * Función central de evaluación reactiva
 */
function evaluarTodosLosSignos() {
  const pasVal = inputPAS.value.trim();
  const padVal = inputPAD.value.trim();
  const fcVal = inputFC.value.trim();
  const frVal = inputFR.value.trim();
  const tempVal = inputTemp.value.trim();
  const spo2Val = inputSpO2.value.trim();

  const pas = pasVal !== '' ? parseFloat(pasVal) : NaN;
  const pad = padVal !== '' ? parseFloat(padVal) : NaN;
  const fc = fcVal !== '' ? parseFloat(fcVal) : NaN;
  const fr = frVal !== '' ? parseFloat(frVal) : NaN;
  const temp = tempVal !== '' ? parseFloat(tempVal) : NaN;
  const spo2 = spo2Val !== '' ? parseFloat(spo2Val) : NaN;
  const modoAltitud = selectAltitude.value;

  // --- VALIDACIÓN DE ERRORES EN CADA CAMPO ---
  
  // 1. SpO2: No mayor a 100% ni negativo
  let errorSpO2Msg = '';
  if (!isNaN(spo2)) {
    if (spo2 > 100) {
      errorSpO2Msg = '⚠️ SpO₂ inválida: La saturación de oxígeno no puede ser mayor al 100%.';
    } else if (spo2 < 0) {
      errorSpO2Msg = '⚠️ SpO₂ inválida: La saturación no puede ser un valor negativo.';
    }
  }
  mostrarErrorCampo(errorSpO2, errorSpO2Msg);

  // 2. PA: PAS debe ser estrictamente mayor a PAD y no negativos
  let errorPAMsg = '';
  if (!isNaN(pas) && !isNaN(pad)) {
    if (pas <= pad) {
      errorPAMsg = '⚠️ Inconsistencia clínica: La Presión Sistólica (PAS) debe ser mayor que la Diastólica (PAD).';
    } else if (pas <= 0 || pad <= 0) {
      errorPAMsg = '⚠️ Las cifras tensionales deben ser valores positivos mayores a cero.';
    }
  }
  mostrarErrorCampo(errorPA, errorPAMsg);

  // 3. FC: Frecuencias no pueden ser negativas ni cero
  let errorFCMsg = '';
  if (!isNaN(fc) && fc <= 0) {
    errorFCMsg = '⚠️ La frecuencia cardíaca debe ser un valor positivo mayor a 0 lpm.';
  }
  mostrarErrorCampo(errorFC, errorFCMsg);

  // 4. FR: No puede ser negativa ni cero
  let errorFRMsg = '';
  if (!isNaN(fr) && fr <= 0) {
    errorFRMsg = '⚠️ La frecuencia respiratoria debe ser un valor positivo mayor a 0 rpm.';
  }
  mostrarErrorCampo(errorFR, errorFRMsg);

  // 5. Temperatura: Límites fisiológicos
  let errorTempMsg = '';
  if (!isNaN(temp) && (temp < 25 || temp > 45 || temp <= 0)) {
    errorTempMsg = '⚠️ Temperatura inconsistente: Ingrese un valor válido entre 25.0 °C y 45.0 °C.';
  }
  mostrarErrorCampo(errorTemp, errorTempMsg);

  // --- EVALUACIONES CLÍNICAS INDIVIDUALES ---
  const resPA = evaluarPA(pas, pad);
  const resFC = errorFCMsg === '' ? evaluarFC(fc) : null;
  const resFR = errorFRMsg === '' ? evaluarFR(fr) : null;
  const resTemp = errorTempMsg === '' ? evaluarTemp(temp) : null;
  const resSpO2 = errorSpO2Msg === '' ? evaluarSpO2(spo2, modoAltitud) : null;

  actualizarUIElemento(resPA, badgePA, feedbackPA, cardPA);
  actualizarUIElemento(resFC, badgeFC, feedbackFC, cardFC);
  actualizarUIElemento(resFR, badgeFR, feedbackFR, cardFR);
  actualizarUIElemento(resTemp, badgeTemp, feedbackTemp, cardTemp);
  actualizarUIElemento(resSpO2, badgeSpO2, feedbackSpO2, cardSpO2);

  // --- CÁLCULO Y VISUALIZACIÓN DE PAM ---
  const resPAM = calcularYEvaluarPAM(pas, pad);
  actualizarUIPAM(resPAM, errorPAMsg !== '');

  // Consolidar estado global (incluyendo PAM si está en alerta de hipoperfusión)
  const listaResultados = [resPA, resFC, resFR, resTemp, resSpO2].filter(r => r !== null && r.status !== 'neutral');
  
  if (resPAM && resPAM.status === 'red') {
    // Si la PAM está en hipoperfusión severa (<65), forzar estado de alerta crítica
    listaResultados.push({ status: 'red', badge: resPAM.badge });
  }

  bannerGlobal.className = 'status-banner';

  if (listaResultados.length === 0) {
    bannerGlobal.classList.add('status-empty');
    bannerIcon.innerHTML = ICON_WAITING;
    bannerTitle.textContent = 'Esperando ingreso de signos vitales';
    bannerDesc.textContent = 'Ingrese los valores tomados al paciente adulto para obtener la clasificación inmediata en semáforo.';
    reportTextarea.value = '';
    return;
  }

  const tieneRojo = listaResultados.some(r => r.status === 'red');
  const tieneAmarillo = listaResultados.some(r => r.status === 'yellow');

  if (tieneRojo) {
    bannerGlobal.classList.add('banner-red');
    bannerIcon.innerHTML = ICON_RED;
    bannerTitle.textContent = 'ALERTA DE SERVICIO (ROJO) — PRIORIDAD CLÍNICA';
    bannerDesc.textContent = 'Se detectó al menos un signo vital en rango crítico o hipoperfusión. Corroborar inmediatamente e informar a docente supervisor / jefa de piso.';
  } else if (tieneAmarillo) {
    bannerGlobal.classList.add('banner-yellow');
    bannerIcon.innerHTML = ICON_YELLOW;
    bannerTitle.textContent = 'ALTERACIÓN LEVE DETECTADA (AMARILLO) — OBSERVACIÓN';
    bannerDesc.textContent = 'Uno o más signos vitales están fuera del rango normal óptimo. Reevaluar en 15–30 min y registrar evolución.';
  } else {
    bannerGlobal.classList.add('banner-green');
    bannerIcon.innerHTML = ICON_GREEN;
    bannerTitle.textContent = 'SIGNOS EN RANGO FISIOLÓGICO NORMAL (VERDE)';
    bannerDesc.textContent = 'Todos los signos registrados se encuentran estables dentro de parámetros normales esperados en adulto.';
  }

  // Generar borrador de la Nota de Enfermería en formato SOAPIE
  actualizarReporteSOAPIE({
    pas, pad, fc, fr, temp, spo2,
    resPA, resFC, resFR, resTemp, resSpO2,
    resPAM,
    tieneRojo, tieneAmarillo,
    errorPAMsg, errorSpO2Msg
  });
}

/**
 * Actualiza la caja visual de PAM
 */
function actualizarUIPAM(resPAM, hayErrorInconsistencia) {
  pamBadgeEl.className = 'pam-badge';

  if (!resPAM || hayErrorInconsistencia) {
    pamValueEl.textContent = '-- mmHg';
    pamBadgeEl.classList.add('badge-neutral');
    pamBadgeEl.textContent = 'Sin cálculo';
    pamAlertEl.style.display = 'none';
    pamAlertEl.textContent = '';
    return;
  }

  pamValueEl.textContent = `${resPAM.valor} mmHg`;

  if (resPAM.status === 'green') {
    pamBadgeEl.classList.add('badge-green');
    pamBadgeEl.textContent = resPAM.badge;
    pamAlertEl.style.display = 'none';
  } else if (resPAM.status === 'yellow') {
    pamBadgeEl.classList.add('badge-yellow');
    pamBadgeEl.textContent = resPAM.badge;
    pamAlertEl.style.display = 'none';
  } else if (resPAM.status === 'red') {
    pamBadgeEl.classList.add('badge-red');
    pamBadgeEl.textContent = resPAM.badge;
    if (resPAM.alertaHipoperfusion) {
      pamAlertEl.style.display = 'flex';
      pamAlertEl.textContent = resPAM.mensajeAlerta;
    }
  }
}


// ============================================================
// 4. GENERADOR DE NOTA DE ENFERMERÍA EN FORMATO SOAPIE
// ============================================================

/**
 * Construye la nota estandarizada en formato SOAPIE
 */
function actualizarReporteSOAPIE(datos) {
  const now = new Date();
  const fechaStr = now.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const horaStr = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true });

  const altitudTexto = selectAltitude.value === 'tunja' ? 'Altitud Tunja 2.810 msnm' : 'Nivel del mar';

  let estadoSemaforo = 'VERDE • Normal';
  let analisisClinico = 'Paciente adulto hemodinámicamente estable, afebril y con adecuada mecánica ventilatoria. Cifras dentro de límites fisiológicos normales. Perfusión tisular preservada.';
  let intervenciones = '- Continuar con el plan de cuidados de enfermería y monitorización de rutina según indicación médica.\n- Mantener medidas de confort y bioseguridad.\n- Registrar en la historia clínica del servicio.';

  if (datos.tieneRojo) {
    estadoSemaforo = 'ROJO • ALERTA CRÍTICA PARA EL SERVICIO';
    analisisClinico = 'ALERTA CRÍTICA: Se evidencian signos vitales con alteración hemodinámica o ventilatoria significativa y riesgo de compromiso clínico o hipoperfusión tisular.';
    intervenciones = '- ACCIÓN PRIORITARIA: Reportar de forma inmediata y verbal al docente supervisor y a la jefa de servicio.\n- Corroborar cifras y signos de alarma en el paciente (estado de conciencia, perfusión periférica, dolor).\n- Mantener al paciente en su unidad asistido y alistar equipo de soporte vital según indicación médica prioritaria.';
  } else if (datos.tieneAmarillo) {
    estadoSemaforo = 'AMARILLO • ALTERACIÓN LEVE / OBSERVACIÓN';
    analisisClinico = 'Se detectan parámetros vitales limítrofes o alteración leve que requiere vigilancia activa de enfermería para descartar descompensación.';
    intervenciones = '- Verificar reposo previo de 5 a 10 minutos y técnica de toma de signos vitales.\n- Programar reevaluación seriada en 15 a 30 minutos.\n- Notificar al personal de enfermería de turno para seguimiento continuo.';
  }

  let lineas = [];
  lineas.push(`============================================================`);
  lineas.push(`NOTA DE EVOLUCIÓN DE ENFERMERÍA — FORMATO SOAPIE (ADULTOS)`);
  lineas.push(`Fecha: ${fechaStr} | Hora: ${horaStr}`);
  lineas.push(`Entorno: Práctica Clínica / Simulación (${altitudTexto})`);
  lineas.push(`============================================================\n`);

  // [S] Subjetivo
  lineas.push(`[S] SUBJETIVO:`);
  lineas.push(`Paciente adulto en reposo en su unidad al momento de la ronda de signos vitales. Refiere sentirse tranquilo, consciente, orientado y sin dolor agudo imprevisto manifestado al inicio de la valoración.\n`);

  // [O] Objetivo
  lineas.push(`[O] OBJETIVO:`);
  lineas.push(`A la valoración de signos vitales en paciente adulto (${altitudTexto}):`);

  if (!isNaN(datos.pas) && !isNaN(datos.pad) && datos.errorPAMsg === '') {
    const pamTxt = datos.resPAM ? ` | PAM: ${datos.resPAM.valor} mmHg [${datos.resPAM.badge}]` : '';
    lineas.push(`• Presión Arterial (PA): ${datos.pas}/${datos.pad} mmHg [${datos.resPA.badge}]${pamTxt}`);
  } else if (!isNaN(datos.pas) || !isNaN(datos.pad)) {
    lineas.push(`• Presión Arterial (PA): Incompleta o con discrepancia`);
  }

  if (!isNaN(datos.fc) && datos.fc > 0) {
    lineas.push(`• Frecuencia Cardíaca (FC): ${datos.fc} lpm [${datos.resFC.badge}]`);
  }

  if (!isNaN(datos.fr) && datos.fr > 0) {
    lineas.push(`• Frecuencia Respiratoria (FR): ${datos.fr} rpm [${datos.resFR.badge}]`);
  }

  if (!isNaN(datos.temp) && datos.temp >= 25 && datos.temp <= 45) {
    lineas.push(`• Temperatura Corporal (T°): ${datos.temp} °C [${datos.resTemp.badge}]`);
  }

  if (!isNaN(datos.spo2) && datos.errorSpO2Msg === '') {
    lineas.push(`• Saturación de Oxígeno (SpO2): ${datos.spo2}% [${datos.resSpO2.badge}]`);
  }

  lineas.push(`\n[A] ANÁLISIS:`);
  lineas.push(`- Semáforo Clínico: ${estadoSemaforo}`);
  lineas.push(`- Interpretación: ${analisisClinico}\n`);

  lineas.push(`[P / I] PLAN E INTERVENCIONES:`);
  lineas.push(intervenciones + `\n`);

  lineas.push(`[E] EVALUACIÓN:`);
  lineas.push(`Paciente permanece en observación activa de enfermería. Se continúa monitorización y registro evolutivo.`);
  lineas.push(`------------------------------------------------------------`);
  lineas.push(`Estudiante: William Esteban Forero Ojeda (Cód. 66625059)`);
  lineas.push(`4.° Semestre de Enfermería • Universidad de Boyacá`);
  lineas.push(`Docente: Santiago Correal`);
  lineas.push(`* Registro confidencial pedagógico sin datos nominales (Habeas Data)`);
  lineas.push(`============================================================`);

  reportTextarea.value = lineas.join('\n');
}

/**
 * Botón explícito "Generar Nota SOAPIE"
 */
function generarReporte() {
  evaluarTodosLosSignos();
  const reportSection = document.getElementById('report-section');
  reportSection.scrollIntoView({ behavior: 'smooth' });
  mostrarToast('¡Nota SOAPIE generada con éxito!');
}

/**
 * Copia el reporte al portapapeles y muestra Toast de exactamente 2 segundos
 */
function copiarReporte() {
  const contenido = reportTextarea.value.trim();
  if (!contenido) {
    mostrarToast('Ingrese signos vitales antes de copiar');
    return;
  }

  const copyText = document.getElementById('copy-text');
  const btnCopy = document.getElementById('btn-copy-report');

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(contenido).then(() => {
      onCopiadoExitoso(copyText, btnCopy);
    }).catch(() => {
      copiarFallback(contenido, copyText, btnCopy);
    });
  } else {
    copiarFallback(contenido, copyText, btnCopy);
  }
}

function copiarFallback(texto, copyText, btnCopy) {
  reportTextarea.focus();
  reportTextarea.select();
  try {
    document.execCommand('copy');
    onCopiadoExitoso(copyText, btnCopy);
  } catch (err) {
    mostrarToast('Seleccione y copie manualmente');
  }
}

function onCopiadoExitoso(copyText, btnCopy) {
  copyText.textContent = '¡Copiado!';
  btnCopy.style.background = '#dcfce7';
  btnCopy.style.borderColor = '#86efac';
  
  // Mensaje exacto de notificación emergente (Toast) flotante de 2 segundos
  mostrarToast('¡Nota copiada al portapapeles con éxito!');

  setTimeout(() => {
    copyText.textContent = 'Copiar nota';
    btnCopy.style.background = '';
    btnCopy.style.borderColor = '';
  }, 2000);
}

/**
 * Notificación Toast flotante de exactamente 2 segundos
 */
let toastTimeout = null;
function mostrarToast(mensaje) {
  const toast = document.getElementById('toast');
  toast.textContent = mensaje;
  toast.classList.add('toast-show');

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  // Exactamente 2 segundos (2000 ms)
  toastTimeout = setTimeout(() => {
    toast.classList.remove('toast-show');
  }, 2000);
}

/**
 * Limpia todos los campos del formulario
 */
function limpiarFormulario() {
  inputPAS.value = '';
  inputPAD.value = '';
  inputFC.value = '';
  inputFR.value = '';
  inputTemp.value = '';
  inputSpO2.value = '';
  reportTextarea.value = '';

  // Limpiar errores
  mostrarErrorCampo(errorPA, '');
  mostrarErrorCampo(errorFC, '');
  mostrarErrorCampo(errorFR, '');
  mostrarErrorCampo(errorTemp, '');
  mostrarErrorCampo(errorSpO2, '');

  evaluarTodosLosSignos();
  mostrarToast('Campos restablecidos');
}

/**
 * Carga casos de prueba preestablecidos
 */
function cargarEjemplo(tipo) {
  if (tipo === 'normal') {
    inputPAS.value = '118';
    inputPAD.value = '76';
    inputFC.value = '72';
    inputFR.value = '16';
    inputTemp.value = '36.6';
    inputSpO2.value = '94';
  } else if (tipo === 'leve') {
    inputPAS.value = '134';
    inputPAD.value = '84';
    inputFC.value = '105';
    inputFR.value = '22';
    inputTemp.value = '37.8';
    inputSpO2.value = '88';
  } else if (tipo === 'critico') {
    // Caso de hipotensión e hipoperfusión severa
    inputPAS.value = '82';
    inputPAD.value = '52'; // PAM = (82 + 104) / 3 = 62 mmHg (<65)
    inputFC.value = '128';
    inputFR.value = '28';
    inputTemp.value = '38.9';
    inputSpO2.value = '82';
  }
  evaluarTodosLosSignos();
  mostrarToast(`Caso "${tipo.toUpperCase()}" cargado`);
}


// ============================================================
// 5. MODO TURNO NOCTURNO (DARK MODE)
// ============================================================

const btnDarkToggle = document.getElementById('btn-dark-toggle');
const nightIcon = document.getElementById('night-icon');
const nightText = document.getElementById('night-text');

const SVG_MOON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const SVG_SUN = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

function toggleModoNocturno() {
  const esDark = document.body.classList.toggle('dark-mode');
  
  if (esDark) {
    nightIcon.innerHTML = SVG_SUN;
    nightText.textContent = 'Modo Diurno';
    localStorage.setItem('signos_dark_mode', 'true');
    mostrarToast('Modo Turno Nocturno activado');
  } else {
    nightIcon.innerHTML = SVG_MOON;
    nightText.textContent = 'Turno Nocturno';
    localStorage.setItem('signos_dark_mode', 'false');
    mostrarToast('Modo Diurno activado');
  }
}

// Inicializar preferencia de modo oscuro guardada
(function initDarkMode() {
  const savedDark = localStorage.getItem('signos_dark_mode');
  if (savedDark === 'true') {
    document.body.classList.add('dark-mode');
    nightIcon.innerHTML = SVG_SUN;
    nightText.textContent = 'Modo Diurno';
  }
})();

/**
 * Actualiza leyendas de SpO2 al cambiar altitud
 */
function actualizarModoAltitud() {
  const esTunja = (selectAltitude.value === 'tunja');
  if (esTunja) {
    refAltitudeLabel.textContent = 'Tunja ~2.810 m';
    refSpO2Ranges.innerHTML = `
      <span class="ref-tag tag-green">Adecuado en altura: ≥ 90%</span>
      <span class="ref-tag tag-yellow">85 – 89% (Hipoxemia leve)</span>
      <span class="ref-tag tag-red">Alerta: &lt; 85% (Hipoxemia severa)</span>
    `;
  } else {
    refAltitudeLabel.textContent = 'Nivel del mar';
    refSpO2Ranges.innerHTML = `
      <span class="ref-tag tag-green">Normosaturación: 95 – 100%</span>
      <span class="ref-tag tag-yellow">90 – 94% (Hipoxemia leve)</span>
      <span class="ref-tag tag-red">Alerta: &lt; 90% (Hipoxemia severa)</span>
    `;
  }
  evaluarTodosLosSignos();
}

// Event Listeners reactivos
const inputs = [inputPAS, inputPAD, inputFC, inputFR, inputTemp, inputSpO2];
inputs.forEach(input => {
  input.addEventListener('input', evaluarTodosLosSignos);
});

selectAltitude.addEventListener('change', actualizarModoAltitud);

// Service Worker para funcionamiento Offline 100% (PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then(
      () => { console.log('SignosSemáforo: Service Worker activo (Offline listo)'); },
      (err) => { console.log('Service Worker no registrado:', err); }
    );
  });
}
