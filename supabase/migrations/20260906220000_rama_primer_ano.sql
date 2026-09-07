-- Nueva rama de duelos: "Primer Año".
--
-- Junta las materias de 1º año en una sola rama, para que quien recién arranca
-- la carrera pueda competir con contenido que efectivamente cursó en vez de
-- caer siempre en materias de años superiores.
--
-- Sin este cambio, el CHECK de trivia_duelos rechaza cualquier sala donde
-- 'primer_ano' salga sorteada y la creación del duelo falla en silencio.

ALTER TABLE public.trivia_duelos
    DROP CONSTRAINT IF EXISTS trivia_duelos_ramas_validas;

ALTER TABLE public.trivia_duelos
    ADD CONSTRAINT trivia_duelos_ramas_validas CHECK (
        (rama_fija IS NULL OR rama_fija IN ('constitucional', 'penal', 'internacional', 'privado', 'administrativo', 'primer_ano'))
        AND (rama_azar IS NULL OR rama_azar IN ('constitucional', 'penal', 'internacional', 'privado', 'administrativo', 'primer_ano'))
        AND (rama_fija IS NULL OR rama_azar IS NULL OR rama_fija <> rama_azar)
    );

COMMENT ON COLUMN public.trivia_duelos.rama_fija IS
    'Rama de la temporada vigente al crear la sala (constitucional, penal, internacional, privado, administrativo, primer_ano).';
COMMENT ON COLUMN public.trivia_duelos.rama_azar IS
    'Segunda rama sorteada al crear la sala. Siempre distinta de rama_fija.';
