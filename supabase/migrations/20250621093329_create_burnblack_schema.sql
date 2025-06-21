-- BurnBlack Tax Management Platform - Comprehensive Database Schema
-- Migration: Create all tables and relationships for tax management system

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');
CREATE TYPE gender_type AS ENUM ('MALE', 'FEMALE', 'OTHER');
CREATE TYPE marital_status_type AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED');
CREATE TYPE itr_type AS ENUM ('ITR1', 'ITR2', 'ITR3', 'ITR4');
CREATE TYPE itr_status AS ENUM ('GENERATED', 'DOWNLOADED', 'FILED', 'PROCESSED');
CREATE TYPE transaction_type AS ENUM ('credit', 'debit');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed');

-- ========================================
-- CORE USER MANAGEMENT
-- ========================================

-- Users table - Core user management
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    role user_role DEFAULT 'USER',
    email_verified BOOLEAN DEFAULT false,
    email_verification_date TIMESTAMP,
    last_verification_email_sent TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Personal Details
CREATE TABLE personal_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(255),
    middle_name VARCHAR(255),
    last_name VARCHAR(255),
    dob DATE,
    gender gender_type,
    marital_status marital_status_type,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact Details
CREATE TABLE contact_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255),
    phone VARCHAR(20),
    pan_number VARCHAR(10),
    aadhar_number VARCHAR(12),
    alternative_email VARCHAR(255),
    alternative_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Address Details
CREATE TABLE address_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    flat_no VARCHAR(255),
    premise_name VARCHAR(255),
    road VARCHAR(255),
    area VARCHAR(255),
    pincode VARCHAR(10),
    country VARCHAR(255),
    state VARCHAR(255),
    city VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bank Details
CREATE TABLE bank_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_number VARCHAR(50),
    ifsc_code VARCHAR(11),
    bank_name VARCHAR(255),
    account_type VARCHAR(50),
    account_holder_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- INCOME SOURCES
-- ========================================

-- Form 16 Data (Salary Income)
CREATE TABLE form16_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    employer_name VARCHAR(255),
    employer_tan VARCHAR(10),
    employer_category VARCHAR(100),
    total_tax DECIMAL(15,2),
    gross_salary DECIMAL(15,2),
    notified_income DECIMAL(15,2),
    salary_breakup JSONB,
    perquisites_amount DECIMAL(15,2),
    perquisites JSONB,
    profit_amount DECIMAL(15,2),
    profits_in_lieu JSONB,
    notified_country JSONB,
    notified_income_other_country DECIMAL(15,2),
    previous_year_income_tax DECIMAL(15,2),
    exempt_allowance DECIMAL(15,2),
    exempt_allowance_breakup JSONB,
    balance DECIMAL(15,2),
    standard_deduction DECIMAL(15,2),
    professional_tax DECIMAL(15,2),
    relief_under_89 DECIMAL(15,2),
    income_claimed DECIMAL(15,2),
    address JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Properties (House Property Income)
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    property_index VARCHAR(50),
    property_type VARCHAR(100),
    net_taxable_income DECIMAL(15,2),
    house_address JSONB,
    owner_details JSONB,
    tax_savings JSONB,
    rental_income_details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Capital Gains
CREATE TABLE capital_gains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    asset_type VARCHAR(100), -- Stocks, Mutual Funds, Gold, etc.
    asset_sub_type VARCHAR(100),
    date_of_sale DATE,
    date_of_purchase DATE,
    description TEXT,
    sale_price DECIMAL(15,2),
    transfer_expenses DECIMAL(15,2),
    purchase_price DECIMAL(15,2),
    stt_paid BOOLEAN DEFAULT false,
    total_profit DECIMAL(15,2),
    indexation_cost DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Interest Income
CREATE TABLE interest_income (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    source_type VARCHAR(100), -- Savings, FD, etc.
    bank_name VARCHAR(255),
    account_number VARCHAR(50),
    interest_amount DECIMAL(15,2),
    tds_deducted DECIMAL(15,2),
    financial_year VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dividend Income
CREATE TABLE dividend_income (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255),
    dividend_amount DECIMAL(15,2),
    tax_deducted DECIMAL(15,2),
    date_received DATE,
    share_quantity INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- BUSINESS & PROFESSIONAL INCOME
-- ========================================

-- Business Income
CREATE TABLE business_income (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255),
    business_type VARCHAR(100),
    business_address TEXT,
    gross_receipts DECIMAL(15,2),
    total_income DECIMAL(15,2),
    business_expenses DECIMAL(15,2),
    net_profit DECIMAL(15,2),
    depreciation_claimed DECIMAL(15,2),
    presumptive_income DECIMAL(15,2),
    section_44ad BOOLEAN DEFAULT false,
    section_44ae BOOLEAN DEFAULT false,
    audit_required BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Professional Income
CREATE TABLE professional_income (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    profession_type VARCHAR(100),
    gross_receipts DECIMAL(15,2),
    total_expenses DECIMAL(15,2),
    net_profit DECIMAL(15,2),
    section_44ada BOOLEAN DEFAULT false,
    presumptive_income DECIMAL(15,2),
    audit_required BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Profit & Loss Statements
CREATE TABLE profit_loss (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_income_id UUID REFERENCES business_income(id) ON DELETE CASCADE,
    year VARCHAR(10),
    income JSONB, -- {businessIncome, otherIncome, totalIncome}
    expenses JSONB, -- {directExpenses, indirectExpenses, depreciation, totalExpenses}
    net_profit DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Balance Sheets
CREATE TABLE balance_sheets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_income_id UUID REFERENCES business_income(id) ON DELETE CASCADE,
    year VARCHAR(10),
    assets JSONB, -- {fixedAssets, currentAssets, totalAssets}
    liabilities JSONB, -- {capital, currentLiabilities, totalLiabilities}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Depreciation Entries
CREATE TABLE depreciation_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_income_id UUID REFERENCES business_income(id) ON DELETE CASCADE,
    asset_name VARCHAR(255),
    asset_category VARCHAR(100),
    purchase_date DATE,
    purchase_cost DECIMAL(15,2),
    depreciation_rate DECIMAL(5,2),
    accumulated_depreciation DECIMAL(15,2),
    written_down_value DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- VIRTUAL ASSETS & OTHER INCOME
-- ========================================

-- Crypto/VDA Income
CREATE TABLE crypto_income (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    asset_type VARCHAR(100), -- Cryptocurrency, NFT
    coin_name VARCHAR(100),
    purchase_date DATE,
    sale_date DATE,
    purchase_price DECIMAL(15,2),
    sale_price DECIMAL(15,2),
    quantity DECIMAL(15,8),
    exchange_name VARCHAR(100),
    transaction_hash VARCHAR(255),
    profit DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agricultural Income
CREATE TABLE agricultural_income (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    land_area DECIMAL(10,2),
    location VARCHAR(255),
    crop_type VARCHAR(100),
    annual_income DECIMAL(15,2),
    expenses DECIMAL(15,2),
    net_income DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exempt Income
CREATE TABLE exempt_income (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    income_type VARCHAR(100),
    description TEXT,
    amount DECIMAL(15,2),
    section VARCHAR(20), -- Section under which exempt
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- TAX SAVING & DEDUCTIONS
-- ========================================

-- Tax Saving Investments
CREATE TABLE tax_saving_investments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    section_80c DECIMAL(15,2) DEFAULT 0 CHECK (section_80c <= 150000),
    savings_interest_80tta DECIMAL(15,2) DEFAULT 0,
    pension_contribution_80ccc DECIMAL(15,2) DEFAULT 0 CHECK (pension_contribution_80ccc <= 150000),
    nps_employee_contribution DECIMAL(15,2) DEFAULT 0,
    nps_employer_contribution DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Donations (80G)
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_name VARCHAR(255),
    donation_type VARCHAR(100),
    amount DECIMAL(15,2),
    date DATE,
    receipt_number VARCHAR(100),
    eligible_amount DECIMAL(15,2),
    deduction_percentage DECIMAL(5,2),
    section VARCHAR(10), -- 80G, 80GGA, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medical Insurance (80D)
CREATE TABLE medical_insurance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    policy_type VARCHAR(100),
    insured_persons VARCHAR(255),
    premium_paid DECIMAL(15,2),
    eligible_amount DECIMAL(15,2),
    policy_number VARCHAR(100),
    insurance_company VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tax Paid Records
CREATE TABLE tax_paid (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tax_type VARCHAR(100), -- TDS, Advance Tax, Self Assessment
    amount DECIMAL(15,2),
    date DATE,
    challan_number VARCHAR(100),
    bank_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- FINANCIAL MANAGEMENT
-- ========================================

-- Wallet
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    balance DECIMAL(15,2) DEFAULT 0 CHECK (balance >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wallet Transactions
CREATE TABLE wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    transaction_type transaction_type NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    razorpay_payment_id VARCHAR(255),
    razorpay_order_id VARCHAR(255),
    status transaction_status DEFAULT 'pending',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- ITR GENERATION & TAX SUMMARY
-- ========================================

-- ITR Generations
CREATE TABLE itr_generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    itr_type itr_type NOT NULL,
    assessment_year VARCHAR(10) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    checksum VARCHAR(255) UNIQUE NOT NULL,
    json_data JSONB NOT NULL,
    status itr_status DEFAULT 'GENERATED',
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    downloaded_at TIMESTAMP
);

-- Tax Summary
CREATE TABLE tax_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assessment_year VARCHAR(10),
    total_income DECIMAL(15,2),
    total_deductions DECIMAL(15,2),
    taxable_income DECIMAL(15,2),
    tax_liability DECIMAL(15,2),
    tax_paid DECIMAL(15,2),
    refund_amount DECIMAL(15,2),
    filing_status VARCHAR(50),
    filing_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_form16_data_user_id ON form16_data(user_id);
CREATE INDEX idx_properties_user_id ON properties(user_id);
CREATE INDEX idx_capital_gains_user_id ON capital_gains(user_id);
CREATE INDEX idx_crypto_income_user_id ON crypto_income(user_id);
CREATE INDEX idx_donations_user_id ON donations(user_id);
CREATE INDEX idx_medical_insurance_user_id ON medical_insurance(user_id);
CREATE INDEX idx_tax_paid_user_id ON tax_paid(user_id);
CREATE INDEX idx_interest_income_user_id ON interest_income(user_id);
CREATE INDEX idx_dividend_income_user_id ON dividend_income(user_id);
CREATE INDEX idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX idx_itr_generations_user_id ON itr_generations(user_id);
CREATE INDEX idx_itr_generations_assessment_year ON itr_generations(assessment_year);

-- ========================================
-- TRIGGERS AND FUNCTIONS
-- ========================================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_personal_details_updated_at BEFORE UPDATE ON personal_details FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_details_updated_at BEFORE UPDATE ON contact_details FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_address_details_updated_at BEFORE UPDATE ON address_details FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bank_details_updated_at BEFORE UPDATE ON bank_details FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_form16_data_updated_at BEFORE UPDATE ON form16_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_capital_gains_updated_at BEFORE UPDATE ON capital_gains FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_income_updated_at BEFORE UPDATE ON business_income FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_professional_income_updated_at BEFORE UPDATE ON professional_income FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tax_summaries_updated_at BEFORE UPDATE ON tax_summaries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();