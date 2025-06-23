import { supabase } from '../lib/supabase'
import { User } from '@supabase/supabase-js'

// Types
export interface Profile {
  id: string
  name: string | null
  phone: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface TaxReturn {
  id: string
  user_id: string
  financial_year: string
  status: 'draft' | 'submitted' | 'processing' | 'completed' | 'rejected'
  itr_type: string
  personal_details: any
  salary_income: any
  house_property: any
  capital_gains: any
  business_income: any
  other_income: any
  tax_saving_investments: any
  deductions_80c: any
  other_deductions: any
  gross_total_income: number
  total_deductions: number
  taxable_income: number
  tax_liability: number
  tax_paid: number
  refund_amount: number
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  user_id: string
  tax_return_id: string | null
  file_name: string
  file_path: string
  file_size: number | null
  file_type: string | null
  document_type: string
  description: string | null
  created_at: string
}

// Profile Services
export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }

    return data
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      throw error
    }

    return data
  },

  async createProfile(userId: string, profileData: Partial<Profile>): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .insert([{ id: userId, ...profileData }])
      .select()
      .single()

    if (error) {
      console.error('Error creating profile:', error)
      throw error
    }

    return data
  }
}

// Tax Return Services
export const taxReturnService = {
  async getTaxReturns(userId: string): Promise<TaxReturn[]> {
    const { data, error } = await supabase
      .from('tax_returns')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching tax returns:', error)
      throw error
    }

    return data || []
  },

  async getTaxReturn(id: string): Promise<TaxReturn | null> {
    const { data, error } = await supabase
      .from('tax_returns')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching tax return:', error)
      return null
    }

    return data
  },

  async createTaxReturn(userId: string, taxReturnData: Partial<TaxReturn>): Promise<TaxReturn | null> {
    const { data, error } = await supabase
      .from('tax_returns')
      .insert([{ user_id: userId, ...taxReturnData }])
      .select()
      .single()

    if (error) {
      console.error('Error creating tax return:', error)
      throw error
    }

    return data
  },

  async updateTaxReturn(id: string, updates: Partial<TaxReturn>): Promise<TaxReturn | null> {
    const { data, error } = await supabase
      .from('tax_returns')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating tax return:', error)
      throw error
    }

    return data
  },

  async deleteTaxReturn(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('tax_returns')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting tax return:', error)
      throw error
    }

    return true
  }
}

// Document Services
export const documentService = {
  async uploadDocument(
    file: File,
    userId: string,
    documentType: string,
    taxReturnId?: string
  ): Promise<{ document: Document; fileUrl: string } | null> {
    // Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${userId}/documents/${fileName}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file)

    if (uploadError) {
      console.error('Error uploading file:', uploadError)
      throw uploadError
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath)

    // Save document metadata
    const { data: documentData, error: documentError } = await supabase
      .from('documents')
      .insert([{
        user_id: userId,
        tax_return_id: taxReturnId || null,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        file_type: file.type,
        document_type: documentType
      }])
      .select()
      .single()

    if (documentError) {
      console.error('Error saving document metadata:', documentError)
      throw documentError
    }

    return {
      document: documentData,
      fileUrl: publicUrl
    }
  },

  async getDocuments(userId: string, taxReturnId?: string): Promise<Document[]> {
    let query = supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId)

    if (taxReturnId) {
      query = query.eq('tax_return_id', taxReturnId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching documents:', error)
      throw error
    }

    return data || []
  },

  async deleteDocument(documentId: string): Promise<boolean> {
    // First get the document to find the file path
    const { data: document, error: fetchError } = await supabase
      .from('documents')
      .select('file_path')
      .eq('id', documentId)
      .single()

    if (fetchError) {
      console.error('Error fetching document for deletion:', fetchError)
      throw fetchError
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([document.file_path])

    if (storageError) {
      console.error('Error deleting file from storage:', storageError)
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId)

    if (dbError) {
      console.error('Error deleting document from database:', dbError)
      throw dbError
    }

    return true
  }
}

// Real-time subscriptions
export const subscriptionService = {
  subscribeTaxReturns(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('tax_returns_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tax_returns',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe()
  },

  subscribeDocuments(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('documents_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'documents',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe()
  }
}

// Tax calculation helpers
export const taxCalculationService = {
  calculateTax(income: number, deductions: number): {
    taxableIncome: number
    taxLiability: number
    educationCess: number
    totalTax: number
  } {
    const taxableIncome = Math.max(0, income - deductions)
    let taxLiability = 0

    // Indian tax slabs for FY 2023-24 (New Tax Regime)
    if (taxableIncome <= 250000) {
      taxLiability = 0
    } else if (taxableIncome <= 500000) {
      taxLiability = (taxableIncome - 250000) * 0.05
    } else if (taxableIncome <= 750000) {
      taxLiability = 12500 + (taxableIncome - 500000) * 0.10
    } else if (taxableIncome <= 1000000) {
      taxLiability = 37500 + (taxableIncome - 750000) * 0.15
    } else if (taxableIncome <= 1250000) {
      taxLiability = 75000 + (taxableIncome - 1000000) * 0.20
    } else if (taxableIncome <= 1500000) {
      taxLiability = 125000 + (taxableIncome - 1250000) * 0.25
    } else {
      taxLiability = 187500 + (taxableIncome - 1500000) * 0.30
    }

    const educationCess = taxLiability * 0.04 // 4% education cess
    const totalTax = taxLiability + educationCess

    return {
      taxableIncome,
      taxLiability,
      educationCess,
      totalTax
    }
  }
}

export default {
  profileService,
  taxReturnService,
  documentService,
  subscriptionService,
  taxCalculationService
}