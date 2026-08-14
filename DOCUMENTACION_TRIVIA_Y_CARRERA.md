# 📚 DOCUMENTACIÓN TÉCNICA Y FUNCIONAL: TRIVIA JURÍDICA & HACÉ TU CARRERA
**Proyecto**: DND Derecho (Plataforma Estudiantil - Facultad de Ciencias Jurídicas y Sociales, UNLP)  
**Fecha de actualización**: Agosto 2026  
**Tecnologías**: React, TypeScript, Vite, Tailwind CSS, Supabase (PostgreSQL / Edge Functions), Google Gemini IA.

---

## 🏛️ PARTE 1: LA TRIVIA JURÍDICA (DND TRIVIA)

### 1. Visión General y Objetivo
La **Trivia Jurídica** es un ecosistema interactivo de estudio, evaluación y gamificación competitiva creado para estudiantes de Derecho de la UNLP. Cuenta con un banco de **más de 1.800 preguntas académicas de opción múltiple** organizadas de 1º a 5º año, cubriendo materias fundamentales como *Derecho Romano*, *Derecho Civil (I a V)*, *Derecho Penal (I y II)*, *Derecho Constitucional*, *Derecho Administrativo (I y II)*, *Derecho Internacional*, *Derecho Procesal*, etc.

---

### 2. Modos de Juego

#### A. Práctica Individual (Entrenamiento)
* **Estructura**: Partidas de 10 preguntas por sesión.
* **Filtros**: Permite elegir materias específicas o el modo *"Todas las materias"*.
* **Mecánica de Tiempo y Racha**: 25 segundos por pregunta con bonificación por velocidad de respuesta y multiplicador de racha (*streak* de hasta x3).
* **Tutor Inteligente con IA (Gemini)**: En caso de error, el estudiante puede presionar el botón de consulta pedagógica para que la IA le brinde una explicación breve y clara de por qué su opción era incorrecta y cuál es el fundamento normativo/doctrinal exacto.

#### B. Duelos 1v1 en Tiempo Real (Duelistas)
* **Emparejamiento**: Sistema de emparejamiento aleatorio o mediante creación de salas privadas con código de invitación.
* **Competencia**: 5 preguntas simultáneas contra otro estudiante con barra de progreso, conteo de aciertos en vivo y animaciones de victoria/derrota.
* **Impacto en Ranking**: Ganar duelos suma puntos de rango; perderlos resta puntos de la escala de clasificación.

#### C. Parcial Flash IA (Generador Inteligente Incremental)
* **Función**: Genera exámenes tipo parcial universitario de 5 preguntas sobre cualquier tema o materia ingresada por el alumno.
* **Algoritmo de Coincidencia Exacta (`findExactMatchingQuestions`)**: Filtrado estricto que previene cruces indebidos entre materias similares (ej. *Penal I* vs *Penal II*, *Civil I* vs *Civil III*).
* **Auto-Persistencia Continua**: Cada vez que la IA de Gemini formula preguntas nuevas para un tema o materia con pocas preguntas en el catálogo, estas se guardan automáticamente en la tabla `trivia_preguntas` de Supabase con `aprobado: true`. Esto hace que **el banco de preguntas crezca y se autoenriquezca continuamente** con cada uso de los estudiantes.

#### D. Desafío Diario
* Un set diario de 10 preguntas idénticas para todos los usuarios con tabla de posiciones del día.

---

### 3. Sistema de Puntos, Penalizaciones y Escala de Rangos

#### Puntuación y Penalizaciones
* **Acierto Base**: 100 puntos por respuesta correcta.
* **Multiplicador de Racha**: Sube progresivamente con respuestas consecutivas acertadas.
* **Bonus de Velocidad**: Puntos adicionales por responder en los primeros segundos.
* **Penalización por Pérdida de Duelos**: Caída de puntuación de rango al ser derrotado en 1v1.
* **Penalización por Desempeño**: Fallar más del 50% de las preguntas de una partida resta puntos en la escala competitiva para fomentar el estudio riguroso.

#### Escala Jerárquica de Rangos
1. **Estudiante Novato** (0 – 299 pts)
2. **Estudiante de Grado** (300 – 699 pts)
3. **Procurador/a** (700 – 1.199 pts)
4. **Abogado/a Matriculado/a** (1.200 – 1.999 pts)
5. **Especialista en Derecho** (2.000 – 2.999 pts)
6. **Magíster / Fiscal** (3.000 – 4.199 pts)
7. **Juez de Primera Instancia** (4.200 – 5.499 pts)
8. **Camarista** (5.500 – 6.999 pts)
9. **Ministro de la Corte Suprema / Doctor en Derecho** (7.000+ pts)

---

### 4. Temporadas Competitivas, Resets y Reloj en Vivo

* **Fecha de Inicio de Temporada**: Jueves 13 a las 19:00 hs.
* **Contador Fluyente en Tiempo Real**:
  * **Cuenta Regresiva Pre-Temporada**: Muestra el tiempo exacto restante en formato `Comienza en: Xd Xh Xm Xs`.
  * **Temporada Activa**: El reloj continúa fluyendo segundo a segundo indicando el tiempo restante para los dos ciclos de reinicio:
    1. **Reset Semanal de Duelos 1v1 (Jueves a las 19:00 hs)**: Reinicia el marcador de duelos y premia al Top 3 con Medallas Olímpicas (Oro 🥇, Plata 🥈, Bronce 🥉).
    2. **Reset Mensual del Ranking General (Día 13 a las 19:00 hs)**: Reinicia la tabla de clasificación general y los rangos mensuales.

---

### 5. Medallero Olímpico, Logros y Perfiles de Usuario

* **Medallero Estilo Olímpico**: Tabla que totaliza medallas de Oro, Plata y Bronce obtenidas en los podios semanales.
* **Medallas de Hitos y Logros**: Se otorgan por acumulación de partidas jugadas (10, 50, 100 partidas), rachas perfectas y ascensos de rango.
* **Ficha Pública de Estudiante**: Modal de inspección donde cualquier usuario puede ver el perfil, avatar, puntos, winrate, historial y medallas de otro compañero.
* **Tutorial / Guía Oficial (`TriviaGuideModal`)**: Modal explicativo con apertura automática en la primera visita del usuario, optimizado para celulares y dispositivos móviles.

---

## 🎓 PARTE 2: "HACÉ TU HISTORIA / HACÉ TU CARRERA"

Este módulo cuenta con dos herramientas fundamentales:

---

### 1. "Hacé tu Historia" (Simulador RPG de Vida Profesional)

Un juego de rol interactivo y narrativo donde el estudiante toma decisiones reales que forjan el destino de su carrera desde el ingreso a la facultad hasta la cúspide laboral.

#### A. Setup de Personaje
* **Origen Geográfico**: Selección de procedencia (Provincias argentinas o Municipios de PBA / La Plata).
* **Edad Inicial**: 18 o 25 años.
* **Skill / Habilidad Inicial**:
  * *Oratoria Persuasiva* (Bonificación en litigios y debates orales).
  * *Memoria Fotográfica* (Ventaja en códigos, leyes y exámenes).
  * *Negociación Pragmática* (Facilidad en mediaciones y acuerdos extrajudiciales).
  * *Red de Contactos* (Crecimiento acelerado en relaciones institucionales).

#### B. 5 Estadísticas Vitales Dinámicas
1. **Prestigio Profesional**: Reconocimiento en el foro y respeto de colegas/jueces.
2. **Contactos**: Red de influencia política, académica y profesional.
3. **Ética Profesional**: Integridad y cumplimiento de las normas deontológicas.
4. **Templanza**: Salud mental, equilibrio y resistencia al estrés judicial.
5. **Capital / Dinero ($ ARS)**: Fondos económicos para inversión y mantenimiento del estudio.

#### C. Etapas de Carrera y Dilemas Éticos
* Recorrido por etapas: Cursada de grado, pasantías en tribunales, primer empleo, apertura del bufete propio, litigios mediáticos, concursos en el Consejo de la Magistratura.
* Cada decisión impacta positiva o negativamente en las 5 variables y puede desatar eventos aleatorios inesperados.

#### D. Minijuegos Jurídicos Integrados
* En ciertos dilemas clave se activan preguntas técnicas de derecho sustantivo/procesal donde responder bien otorga ventajas sustanciales (ganar el juicio, evitar sanciones colegiales, etc.).

#### E. Gestión de Estudio Jurídico
* Posibilidad de contratar abogados junior, peritos, contadores, ampliar oficinas y balancear clientes corporativos lucrativos con causas pro-bono de interés público.

#### F. Múltiples Finales y Logros
* Desbloqueo de finales: *Juez de la Nación*, *Titular de Megabufete*, *Defensor de Derechos Humanos*, *Profesor Emérito*, o desenlaces adversos como la *Quiebra Económica* o *Suspensión de la Matrícula*.

---

### 2. "Plan de Estudios Interactivo" (Plan 6 y Plan 5)

* **Seguimiento Curricular Oficial**: Visualización de la malla completa de la carrera de Abogacía de la UNLP (Plan 6 vigente y Plan 5).
* **Gestión Inteligente de Correlatividades**: Bloquea o desbloquea automáticamente materias para cursar o rendir en base a las materias previas registradas (*Aprobada*, *Regular*, *Pendiente*).
* **Estadísticas de Avance**:
  * Porcentaje total de carrera completado.
  * Contador de materias aprobadas vs pendientes por año.
  * Desglose de materias por orientación y talleres de lecto-comprensión.
* **Persistencia Multi-Dispositivo**: Guardado sincronizado con Supabase y respaldo en almacenamiento local.

---

## 🛠️ ARQUITECTURA TÉCNICA

* **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion, Radix UI.
* **Backend**: Supabase (PostgreSQL con RLS, RPCs, Edge Functions en Deno).
* **Inteligencia Artificial**: API de Google Gemini para generación de parciales flash en tiempo real y tutoría explicativa de fallos.
* **Estado de Compilación**: Proyecto 100% verificado (`npm run build`), optimizado para Progressive Web App (PWA) y sincronizado en la rama `master` del repositorio GitHub.
