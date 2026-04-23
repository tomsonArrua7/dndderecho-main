export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      eventos: {
        Row: {
          created_at: string
          descripcion: string | null
          fecha: string
          id: string
          materia_id: string | null
          tipo: Database["public"]["Enums"]["tipo_evento"]
          titulo: string
          user_id: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          fecha: string
          id?: string
          materia_id?: string | null
          tipo?: Database["public"]["Enums"]["tipo_evento"]
          titulo: string
          user_id: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          fecha?: string
          id?: string
          materia_id?: string | null
          tipo?: Database["public"]["Enums"]["tipo_evento"]
          titulo?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "eventos_materia_id_fkey"
            columns: ["materia_id"]
            isOneToOne: false
            referencedRelation: "materias"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          created_at: string
          id: string
          notified: boolean
          permuta_a: string
          permuta_b: string
          user_a: string
          user_b: string
        }
        Insert: {
          created_at?: string
          id?: string
          notified?: boolean
          permuta_a: string
          permuta_b: string
          user_a: string
          user_b: string
        }
        Update: {
          created_at?: string
          id?: string
          notified?: boolean
          permuta_a?: string
          permuta_b?: string
          user_a?: string
          user_b?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_permuta_a_fkey"
            columns: ["permuta_a"]
            isOneToOne: false
            referencedRelation: "permutas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_permuta_b_fkey"
            columns: ["permuta_b"]
            isOneToOne: false
            referencedRelation: "permutas"
            referencedColumns: ["id"]
          },
        ]
      }
      materias: {
        Row: {
          anio: number
          codigo: string | null
          created_at: string
          id: string
          nombre: string
        }
        Insert: {
          anio: number
          codigo?: string | null
          created_at?: string
          id?: string
          nombre: string
        }
        Update: {
          anio?: number
          codigo?: string | null
          created_at?: string
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      permutas: {
        Row: {
          activa: boolean
          comision_tiene: number
          comisiones_busca: number[]
          created_at: string
          id: string
          materia_id: string
          nombre_contacto: string
          notas: string | null
          telefono: string
          updated_at: string
          user_id: string
        }
        Insert: {
          activa?: boolean
          comision_tiene: number
          comisiones_busca: number[]
          created_at?: string
          id?: string
          materia_id: string
          nombre_contacto: string
          notas?: string | null
          telefono: string
          updated_at?: string
          user_id: string
        }
        Update: {
          activa?: boolean
          comision_tiene?: number
          comisiones_busca?: number[]
          created_at?: string
          id?: string
          materia_id?: string
          nombre_contacto?: string
          notas?: string | null
          telefono?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "permutas_materia_id_fkey"
            columns: ["materia_id"]
            isOneToOne: false
            referencedRelation: "materias"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          anio_cursada: number | null
          created_at: string
          full_name: string | null
          id: string
          telefono: string | null
          updated_at: string
        }
        Insert: {
          anio_cursada?: number | null
          created_at?: string
          full_name?: string | null
          id: string
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          anio_cursada?: number | null
          created_at?: string
          full_name?: string | null
          id?: string
          telefono?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_materias: {
        Row: {
          created_at: string
          estado: Database["public"]["Enums"]["estado_materia"]
          id: string
          materia_id: string
          nota: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          estado?: Database["public"]["Enums"]["estado_materia"]
          id?: string
          materia_id: string
          nota?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          estado?: Database["public"]["Enums"]["estado_materia"]
          id?: string
          materia_id?: string
          nota?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_materias_materia_id_fkey"
            columns: ["materia_id"]
            isOneToOne: false
            referencedRelation: "materias"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      estado_materia: "pendiente" | "cursando" | "aprobada"
      tipo_evento: "parcial" | "final" | "entrega" | "clase" | "otro"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      estado_materia: ["pendiente", "cursando", "aprobada"],
      tipo_evento: ["parcial", "final", "entrega", "clase", "otro"],
    },
  },
} as const
