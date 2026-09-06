-- Duelos 1v1 por ramas del derecho.
--
-- A partir de ahora el competitivo no se juega por materia elegida a dedo sino
-- por dos ramas sorteadas: la rama fija de la semana (rota cada jueves 19:00
-- junto con el reset de 1v1) más una segunda al azar. El sorteo queda grabado
-- en la fila al crear la sala, así el rival que entra después gira la ruleta y
-- le cae exactamente el mismo resultado, sin tener que esperar a nadie.

ALTER TABLE public.trivia_duelos
    ADD COLUMN IF NOT EXISTS rama_fija TEXT,
    ADD COLUMN IF NOT EXISTS rama_azar TEXT;

COMMENT ON COLUMN public.trivia_duelos.rama_fija IS
    'Rama de la semana vigente al crear la sala (constitucional, penal, internacional, privado, administrativo).';
COMMENT ON COLUMN public.trivia_duelos.rama_azar IS
    'Segunda rama sorteada al crear la sala. Siempre distinta de rama_fija.';

-- Las salas viejas (por materia) quedan con ramas nulas y se siguen mostrando
-- con su materia original; sólo las nuevas usan el sistema de ramas.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'trivia_duelos_ramas_validas'
    ) THEN
        ALTER TABLE public.trivia_duelos
            ADD CONSTRAINT trivia_duelos_ramas_validas CHECK (
                (rama_fija IS NULL OR rama_fija IN ('constitucional', 'penal', 'internacional', 'privado', 'administrativo'))
                AND (rama_azar IS NULL OR rama_azar IN ('constitucional', 'penal', 'internacional', 'privado', 'administrativo'))
                AND (rama_fija IS NULL OR rama_azar IS NULL OR rama_fija <> rama_azar)
            );
    END IF;
END $$;
