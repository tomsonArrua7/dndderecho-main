INSERT INTO public.materias (nombre, anio, codigo)
VALUES
  ('Introduccion al Derecho', 1, '1-INTRO'),
  ('Derecho Romano', 1, '1-ROMANO'),
  ('Derecho Politico', 1, '1-POLITICO'),
  ('Sociologia Juridica', 1, '1-SOCIO'),
  ('Derecho Civil I (Parte General)', 1, '1-CIVIL-I'),

  ('Derecho Constitucional I', 2, '2-CONST-I'),
  ('Derecho Penal I (Parte General)', 2, '2-PENAL-I'),
  ('Derecho Civil II (Obligaciones)', 2, '2-CIVIL-II'),
  ('Derecho Constitucional II', 2, '2-CONST-II'),
  ('Derecho Penal II (Parte Especial)', 2, '2-PENAL-II'),

  ('Derecho Civil III (Contratos)', 3, '3-CIVIL-III'),
  ('Derecho Procesal I', 3, '3-PROCESAL-I'),
  ('Derecho Internacional Publico', 3, '3-INT-PUB'),
  ('Derecho Civil IV (Derechos Reales)', 3, '3-CIVIL-IV'),
  ('Derecho Comercial I', 3, '3-COMERCIAL-I'),

  ('Derecho Administrativo I', 4, '4-ADMIN-I'),
  ('Derecho Procesal II', 4, '4-PROCESAL-II'),
  ('Derecho Civil V (Familia y Sucesiones)', 4, '4-CIVIL-V'),
  ('Derecho Comercial II (Sociedades)', 4, '4-COMERCIAL-II'),
  ('Derecho Administrativo II', 4, '4-ADMIN-II'),

  ('Derecho del Trabajo y la Seguridad Social', 5, '5-TRABAJO'),
  ('Derecho de la Navegacion y el Transporte', 5, '5-NAVEGACION'),
  ('Derecho de Mineria y Energia', 5, '5-MINERIA'),
  ('Derecho Agrario y Ambiental', 5, '5-AGRARIO'),
  ('Finanzas y Derecho Tributario', 5, '5-TRIBUTARIO'),

  ('Derecho Internacional Privado', 6, '6-INT-PRIV'),
  ('Filosofia del Derecho', 6, '6-FILOSOFIA'),
  ('Practica Profesional I', 6, '6-PRACTICA-I'),
  ('Practica Profesional II', 6, '6-PRACTICA-II'),
  ('Seminarios y Optativas', 6, '6-SEMINARIOS')
ON CONFLICT (nombre) DO NOTHING;
