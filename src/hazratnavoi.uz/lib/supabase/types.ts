export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      news: {
        Row: {
          id: string
          title: string
          content: string
          image_url: string | null
          created_at: string
          updated_at: string
          published: boolean
          author_id: string | null
        }
        Insert: {
          id?: string
          title: string
          content: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
          published?: boolean
          author_id?: string | null
        }
        Update: {
          id?: string
          title?: string
          content?: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
          published?: boolean
          author_id?: string | null
        }
      }
      qa_pairs: {
        Row: {
          id: string
          question: string
          answer: string
          category: string | null
          order: number
          created_at: string
          published: boolean
        }
        Insert: {
          id?: string
          question: string
          answer: string
          category?: string | null
          order?: number
          created_at?: string
          published?: boolean
        }
        Update: {
          id?: string
          question?: string
          answer?: string
          category?: string | null
          order?: number
          created_at?: string
          published?: boolean
        }
      }
      prayer_times: {
        Row: {
          id: string
          date: string
          fajr: string
          sunrise: string
          dhuhr: string
          asr: string
          maghrib: string
          isha: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          date: string
          fajr: string
          sunrise: string
          dhuhr: string
          asr: string
          maghrib: string
          isha: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          date?: string
          fajr?: string
          sunrise?: string
          dhuhr?: string
          asr?: string
          maghrib?: string
          isha?: string
          created_at?: string
          updated_at?: string
        }
      }
      imam_messages: {
        Row: {
          id: string
          title: string
          content: string
          audio_url: string | null
          video_url: string | null
          created_at: string
          published: boolean
        }
        Insert: {
          id?: string
          title: string
          content: string
          audio_url?: string | null
          video_url?: string | null
          created_at?: string
          published?: boolean
        }
        Update: {
          id?: string
          title?: string
          content?: string
          audio_url?: string | null
          video_url?: string | null
          created_at?: string
          published?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
