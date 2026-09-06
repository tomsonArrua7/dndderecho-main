-- Limpieza del banco de preguntas viejo.
--
-- El banco pasa a vivir exclusivamente en el repositorio
-- (src/data/bancoPreguntas.generated.ts, generado desde los documentos de
-- cátedra). Estas tablas quedaban como fuente paralela y desactualizada:
--
--   * trivia_preguntas      -> la app la consultaba con columnas que no existen
--                              en su esquema ("materia", "aprobado"), así que la
--                              lectura fallaba siempre y se descartaba en silencio.
--                              También acumulaba preguntas generadas por IA.
--   * db_trivia_questions   -> cargada por la migración 20260811000000, nunca leída
--                              por el cliente.
--
-- Se vacían para que no haya dos bancos conviviendo. El contenido de
-- db_trivia_questions es reproducible desde esa migración si hiciera falta.

DELETE FROM public.trivia_preguntas;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'db_trivia_questions'
    ) THEN
        EXECUTE 'DELETE FROM public.db_trivia_questions';
    END IF;
END $$;

-- Las salas de duelo abiertas guardan los ids de las 5 preguntas sorteadas.
-- Con el banco nuevo esos ids dejan de existir, así que las salas que todavía
-- no terminaron quedarían sin preguntas. Se eliminan; el historial de duelos
-- ya finalizados se conserva.
DELETE FROM public.trivia_duelos
WHERE status <> 'finalizado'
  AND NOT (player1_completed AND player2_completed);
