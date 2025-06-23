-- Supabase Database Schema for BurnBlack Tax Management Platform
-- Run these commands in your Supabase SQL editor

-- User profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tax returns
CREATE TABLE IF NOT EXISTS tax_returns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  financial_year TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'processing', 'completed', 'rejected')),
  itr_type TEXT DEFAULT 'ITR-1', -- ITR-1, ITR-2, ITR-3, etc.
  
  -- Personal Details
  personal_details JSONB DEFAULT '{}',
  
  -- Income Sources
  salary_income JSONB DEFAULT '{}',
  house_property JSONB DEFAULT '{}',
  capital_gains JSONB DEFAULT '{}',
  business_income JSONB DEFAULT '{}',
  other_income JSONB DEFAULT '{}',
  
  -- Deductions
  tax_saving_investments JSONB DEFAULT '{}',
  deductions_80c JSONB DEFAULT '{}',
  other_deductions JSONB DEFAULT '{}',
  
  -- Tax Computation
  gross_total_income DECIMAL(15,2) DEFAULT 0,
  total_deductions DECIMAL(15,2) DEFAULT 0,
  taxable_income DECIMAL(15,2) DEFAULT 0,
  tax_liability DECIMAL(15,2) DEFAULT 0,
  tax_paid DECIMAL(15,2) DEFAULT 0,
  refund_amount DECIMAL(15,2) DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Documents
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tax_return_id UUID REFERENCES tax_returns(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  document_type TEXT NOT NULL, -- 'form16', 'bank_statement', 'investment_proof', etc.
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tax calculations history
CREATE TABLE IF NOT EXISTS tax_calculations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tax_return_id UUID REFERENCES tax_returns(id) ON DELETE CASCADE NOT NULL,
  calculation_type TEXT NOT NULL, -- 'auto', 'manual', 'revised'
  calculation_data JSONB NOT NULL,
  result JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Payment transactions
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tax_return_id UUID REFERENCES tax_returns(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method TEXT, -- 'razorpay', 'stripe', etc.
  payment_id TEXT UNIQUE,
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Row Level Security Policies

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Tax returns policies
CREATE POLICY "Users can view their own tax returns" ON tax_returns
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tax returns" ON tax_returns
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tax returns" ON tax_returns
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tax returns" ON tax_returns
  FOR DELETE USING (auth.uid() = user_id);

-- Documents policies
CREATE POLICY "Users can view their own documents" ON documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents" ON documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents" ON documents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" ON documents
  FOR DELETE USING (auth.uid() = user_id);

-- Tax calculations policies
CREATE POLICY "Users can view their own tax calculations" ON tax_calculations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tax calculations" ON tax_calculations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Payments policies
CREATE POLICY "Users can view their own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments" ON payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payments" ON payments
  FOR UPDATE USING (auth.uid() = user_id);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tax_returns_user_id ON tax_returns(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_returns_financial_year ON tax_returns(financial_year);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_tax_return_id ON documents(tax_return_id);
CREATE INDEX IF NOT EXISTS idx_tax_calculations_user_id ON tax_calculations(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);

-- Create a function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tax_returns_updated_at BEFORE UPDATE ON tax_returns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();