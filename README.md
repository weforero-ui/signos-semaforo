# SignosSemáforo 🚦 (Validador Rápido de Signos Vitales)

**Universidad de Boyacá**  
**Facultad de Ciencias de la Salud • Programa de Enfermería (4.° Semestre)**  
**Materia:** IA Generativa: del Prompt al Producto (Entregable 7% - Tercer Corte)  
**Estudiante / Responsable:** William Esteban Forero Ojeda (Cód. 66625059)  
**Docente:** Santiago Correal  

---

## 1. El Problema y Contexto Clínico

Durante la transición de las clases teóricas a las primeras prácticas hospitalarias en Tunja (Hospital San Rafael, Clínica de los Andes, etc.) y laboratorios de simulación clínica, los estudiantes de 4.° semestre nos enfrentamos a situaciones de estrés, lentitud e incertidumbre al interpretar los signos vitales tomados a los pacientes: ¿están en rango normal, presentan una alteración leve que requiera vigilancia o representan una alteración crítica que deba reportarse de urgencia a la jefa de servicio o al docente supervisor?

**SignosSemáforo** resuelve esta necesidad proporcionando una herramienta ágil, visual y educativa que valida instantáneamente los parámetros vitales en **población adulta**, clasifica el riesgo bajo el código universal de semáforo, calcula la **Presión Arterial Media (PAM)** para vigilar la perfusión tisular y estructura el registro clínico bajo el formato **SOAPIE**.

---

## 2. Novedades y Optimizaciones Clínicas Incorporadas

### 1. Cálculo de Presión Arterial Media (PAM)
* **Fórmula:** $\text{PAM} = \frac{\text{PAS} + 2 \times \text{PAD}}{3}$.
* **Rango fisiológico normal:** $70 - 105\text{ mmHg}$.
* **Alerta Crítica de Hipoperfusión:** Cuando la $\text{PAM} < 65\text{ mmHg}$, se activa un banner de alerta rojo informando riesgo de daño isquémico orgánico y renal para intervención inmediata.

### 2. Validaciones y Seguridad de Datos
* **Seguridad tensional:** Impide y alerta si la Presión Sistólica es menor o igual a la Diastólica ($\text{PAS} \le \text{PAD}$) o si se ingresan valores negativos.
* **Control de Pulsioximetría:** Bloquea valores de $\text{SpO}_2 > 100\%$ o cifras negativas.
* **Frecuencias y Temperatura:** Valida que la Frecuencia Cardíaca ($\text{FC} > 0$) y Respiratoria ($\text{FR} > 0$) sean positivas, y que la Temperatura se encuentre en rangos biológicos coherentes ($25.0 - 45.0\text{ }^\circ\text{C}$).
* Mensajes de advertencia en rojo claro debajo de cada campo con animación y texto explicativo.

### 3. Nota de Enfermería en Formato SOAPIE Estandarizado
Organización estructurada lista para copiar y pegar en el Kardex e Historia Clínica:
* **[S] Subjetivo:** Manifestación del paciente adulto en reposo al momento del control.
* **[O] Objetivo:** Lista completa de cifras tomadas con su semáforo, altitud de referencia ($\text{Tunja } 2.810\text{ msnm}$ o Nivel del mar) y la **PAM calculada**.
* **[A] Análisis:** Juicio clínico de enfermería según el semáforo consolidado (Verde: hemodinamia estable; Amarillo: alteración limítrofe/observación; Rojo: alerta crítica de servicio o hipoperfusión).
* **[P / I] Plan e Intervenciones:** Acciones prioritarias (reevaluación en 15–30 min en amarillo, o aviso verbal inmediato a supervisión/docente en rojo).
* **[E] Evaluación:** Seguimiento de enfermería en el turno.
* Firma institucional: William Esteban Forero Ojeda (Cód. 66625059).

### 4. UX/UI y Experiencia Clínica
* **Modo Turno Nocturno (Dark Mode):** Botón flotante superior con icono Luna/Sol que atenúa el brillo de la pantalla durante turnos de noche en salas de hospitalización, conservando alto contraste clínico y persistiendo la preferencia del estudiante.
* **Bordes Dinámicos de Color:** Cada tarjeta de signo vital ilumina su contorno en **Verde**, **Amarillo** o **Rojo** según su estado actual con suave sombra envolvente.
* **Notificación Toast de 2 segundos:** Feedback flotante al presionar *"Copiar nota"* que confirma la copia al portapapeles durante exactamente 2 segundos.

---

## 3. Matriz Clínica de Referencia (Adultos)

| Signo Vital | Unidad | Verde (Normal) | Amarillo (Alteración Leve) | Rojo (Alerta de Servicio) |
| :--- | :---: | :---: | :---: | :---: |
| **Presión Arterial (PA)** | mmHg | PAS: 90–120<br>PAD: 60–80 | PAS: 121–139 ó PAD: 81–89<br>(PA elevada / Pre-HTA)<br>PAS: 80–89 / PAD: 50–59 (Hipotensión leve) | PAS: <80 ó PAD: <50 (Hipotensión severa)<br>PAS: ≥140 ó PAD: ≥90 (Hipertensión Grado 2)<br>PAS: ≥180 ó PAD: ≥120 (Crisis Hipertensiva) |
| **Presión Arterial Media (PAM)** | mmHg | 70 – 105 (Perfusión normal) | 65 – 69 (Límite bajo) ó > 105 (Elevada) | **< 65 (Alerta: Hipoperfusión tisular)** |
| **Frecuencia Cardíaca (FC)** | lpm | 60 – 100 (Normocardia) | 50 – 59 (Bradicardia leve)<br>101 – 119 (Taquicardia leve) | < 50 (Bradicardia severa)<br>≥ 120 (Taquicardia severa) |
| **Frecuencia Respiratoria (FR)** | rpm | 12 – 20 (Eupnea) | 10 – 11 (Bradipnea leve)<br>21 – 24 (Taquipnea leve) | < 10 (Depresión respiratoria)<br>≥ 25 (Taquipnea severa) |
| **Temperatura Corporal (T°)** | °C | 36.0 – 37.5 (Afebril) | 37.6 – 37.9 (Febrícula)<br>35.5 – 35.9 (Hipotermia leve) | ≥ 38.0 (Fiebre / Pirexia)<br>< 35.5 (Hipotermia moderada/severa) |
| **Saturación SpO₂ (Tunja 2.810m)** | % | ≥ 90% (Esperado en altura) | 85 – 89% (Hipoxemia leve) | < 85% (Hipoxemia severa) |
| **Saturación SpO₂ (Nivel del mar)** | % | 95 – 100% (Normosaturación) | 90 – 94% (Hipoxemia leve) | < 90% (Hipoxemia severa) |

---

## 4. Estructura de Archivos

```text
SignosSemaforo/
├── index.html        # UI semántica con bloque PAM, validaciones y toggle Dark Mode
├── style.css         # Clean Clinical UI + Modo Turno Nocturno + Bordes dinámicos
├── app.js            # Motor reactivo, cálculo de PAM, notas SOAPIE y Toast de 2s
├── sw.js             # Service Worker (PWA 100% Offline)
├── manifest.json     # Manifiesto para instalar como app en móvil
├── icon-192.png      # Icono 192x192 px
├── icon-512.png      # Icono 512x512 px
└── README.md         # Documentación clínica y técnica
```

---

## 5. Instrucciones de Uso

1. Abra el archivo `index.html` en su navegador o active el botón flotante **"Turno Nocturno"** en la esquina superior si está en un entorno con poca luz.
2. Digite los valores del paciente adulto. Verifique cómo la **PAM** se calcula en tiempo real y cómo los bordes de cada tarjeta cambian dinámicamente de color.
3. Si digita datos inconsistentes ($\text{PAS} \le \text{PAD}$, $\text{SpO}_2 > 100\%$, etc.), la aplicación le avisará con mensajes en rojo claro para prevenir errores de registro.
4. Presione **"Generar Nota SOAPIE"** y luego **"Copiar nota"** para pegar el informe completo en la nota de evolución de enfermería.
