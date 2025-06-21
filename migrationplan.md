Implementation Scope: 6 Months (Jan-June 2025)

    Phase 1: Database Migration & Core Infrastructure (Month 1-2)

    Milestone 1.1: Supabase Migration Setup
    - Set up Supabase project and Prisma ORM
    - Design comprehensive Prisma schema for all existing MongoDB models
    - Create migration scripts for data transfer from MongoDB to Supabase PostgreSQL
    - Implement authentication migration strategy

    Milestone 1.2: Enhanced Tax Calculation Engine
    - Implement tax regime comparison (Old vs New)
    - Build real-time tax calculator with live updates
    - Add marginal tax rate analysis and Section 87A rebate automation

    Phase 2: ITR JSON Generation System (Month 3-4)

    Milestone 2.1: Complete ITR JSON Builders
    - Implement ITR-1 and ITR-2 JSON generation (existing schemas)
    - Build ITR-3 JSON generator for business/professional income
    - Create ITR-4 JSON generator for presumptive taxation
    - Add comprehensive validation engine for all ITR types

    Milestone 2.2: Advanced Data Validation & User Experience
    - Real-time form validation with Indian tax rules
    - Smart deduction suggestions and optimization
    - Enhanced progress tracking and mobile responsiveness

    Phase 3: Professional Features & Advanced Processing (Month 5-6)

    Milestone 3.1: Business Income Management
    - Advanced P&L generator and balance sheet builder
    - Presumptive taxation calculators (44AD, 44AE, 44ADA)
    - Enhanced capital gains optimization with indexation

    Milestone 3.2: Document Processing & Final Polish
    - Improved OCR for Form 16 and bank statement processing
    - Advanced reporting and analytics dashboard
    - Performance optimization and testing

    Supabase Migration Strategy

    1. Prisma Schema Design

    // Enhanced Prisma schema covering all current MongoDB models
    generator client {
      provider = "prisma-client-js"
    }

    datasource db {
      provider = "postgresql"
      url      = env("SUPABASE_DATABASE_URL")
    }

    model User {
      id                          String    @id @default(cuid())
      name                        String
      phone                       String?
      email                       String    @unique
      password                    String?
      role                        Role      @default(USER)
      emailVerified               Boolean   @default(false)
      emailVerificationDate       DateTime?
      lastVerificationEmailSent   DateTime?
      createdAt                   DateTime  @default(now())
      updatedAt                   DateTime  @updatedAt

      // Relations to all user data
      personalDetails             PersonalDetail?
      contactDetails              ContactDetail?
      bankDetails                 BankDetail?
      addressDetails              AddressDetail?
      form16Data                  Form16Data[]
      properties                  Property[]
      capitalGains                CapitalGain[]
      businessIncome              BusinessIncome?
      professionalIncome          ProfessionalIncome?
      cryptoIncome                CryptoIncome[]
      taxSavingInvestments        TaxSavingInvestment?
      donations                   Donation[]
      medicalInsurance            MedicalInsurance[]
      taxPaid                     TaxPaid[]
      wallet                      Wallet?
      itrGenerations              ITRGeneration[]

      @@map("users")
    }

    model PersonalDetail {
      id            String     @id @default(cuid())
      userId        String     @unique
      firstName     String?
      middleName    String?
      lastName      String?
      dob           DateTime?
      gender        Gender?
      maritalStatus MaritalStatus?
      createdAt     DateTime   @default(now())
      updatedAt     DateTime   @updatedAt

      user User @relation(fields: [userId], references: [id], onDelete: Cascade)

      @@map("personal_details")
    }

    model ContactDetail {
      id                  String   @id @default(cuid())
      userId              String   @unique
      email               String?
      phone               String?
      panNumber           String?
      aadharNumber        String?
      alternativeEmail    String?
      alternativePhone    String?
      createdAt           DateTime @default(now())
      updatedAt           DateTime @updatedAt

      user User @relation(fields: [userId], references: [id], onDelete: Cascade)

      @@map("contact_details")
    }

    // Business Income Models for ITR-3
    model BusinessIncome {
      id                    String   @id @default(cuid())
      userId                String   @unique
      businessName          String?
      businessType          String?
      businessAddress       String?
      grossReceipts         Decimal? @db.Decimal(15, 2)
      totalIncome           Decimal? @db.Decimal(15, 2)
      businessExpenses      Decimal? @db.Decimal(15, 2)
      netProfit             Decimal? @db.Decimal(15, 2)
      depreciationClaimed   Decimal? @db.Decimal(15, 2)
      presumptiveIncome     Decimal? @db.Decimal(15, 2)
      section44AD           Boolean  @default(false)
      section44AE           Boolean  @default(false)
      auditRequired         Boolean  @default(false)
      createdAt             DateTime @default(now())
      updatedAt             DateTime @updatedAt

      user            User              @relation(fields: [userId], references: [id], onDelete: 
    Cascade)
      profitLoss      ProfitLoss?
      balanceSheet    BalanceSheet?
      depreciation    DepreciationEntry[]

      @@map("business_income")
    }

    model ProfessionalIncome {
      id                    String   @id @default(cuid())
      userId                String   @unique
      professionType        String?
      grossReceipts         Decimal? @db.Decimal(15, 2)
      totalExpenses         Decimal? @db.Decimal(15, 2)
      netProfit             Decimal? @db.Decimal(15, 2)
      section44ADA          Boolean  @default(false)
      presumptiveIncome     Decimal? @db.Decimal(15, 2)
      auditRequired         Boolean  @default(false)
      createdAt             DateTime @default(now())
      updatedAt             DateTime @updatedAt

      user User @relation(fields: [userId], references: [id], onDelete: Cascade)

      @@map("professional_income")
    }

    // ITR Generation Tracking
    model ITRGeneration {
      id              String     @id @default(cuid())
      userId          String
      itrType         ITRType
      assessmentYear  String
      fileName        String
      checksum        String     @unique
      jsonData        Json
      status          ITRStatus  @default(GENERATED)
      generatedAt     DateTime   @default(now())
      downloadedAt    DateTime?
      
      user User @relation(fields: [userId], references: [id], onDelete: Cascade)

      @@map("itr_generations")
    }

    // Enums
    enum Role {
      USER
      ADMIN
    }

    enum Gender {
      MALE
      FEMALE
      OTHER
    }

    enum MaritalStatus {
      SINGLE
      MARRIED
      DIVORCED
      WIDOWED
    }

    enum ITRType {
      ITR1
      ITR2
      ITR3
      ITR4
    }

    enum ITRStatus {
      GENERATED
      DOWNLOADED
      FILED
      PROCESSED
    }

    2. Migration Plan

    // Migration utility to transfer data from MongoDB to Supabase
    class DatabaseMigrator {
      async migrateUsers() {
        const mongoUsers = await MongoUser.find({});
        
        for (const mongoUser of mongoUsers) {
          await prisma.user.create({
            data: {
              id: mongoUser._id.toString(),
              name: mongoUser.name,
              email: mongoUser.email,
              phone: mongoUser.phone,
              role: mongoUser.role === 'admin' ? 'ADMIN' : 'USER',
              emailVerified: mongoUser.emailVerified,
              createdAt: mongoUser.createdAt,
              updatedAt: mongoUser.updatedAt
            }
          });
        }
      }

      async migrateAllData() {
        await this.migrateUsers();
        await this.migratePersonalDetails();
        await this.migrateBusinessData();
        await this.migrateCapitalGains();
        // ... continue for all models
      }
    }

    ITR-3 and ITR-4 JSON Implementation

    ITR-3 JSON Generator (Business/Professional Income)

    class ITR3Generator extends ITRJSONGenerator {
      async generateITR3(userData: UserData) {
        return {
          ITR: {
            ITR3: {
              CreationInfo: this.generateCreationInfo(),
              Form_ITR3: {
                FormName: "ITR-3",
                AssessmentYear: this.assessmentYear,
                SchemaVer: "Ver1.2"
              },
              PartA_GEN1: this.mapPersonalInfo(userData),
              PARTA_BS: this.mapBalanceSheet(userData.businessIncome?.balanceSheet),
              PARTA_PL: this.mapProfitLoss(userData.businessIncome?.profitLoss),
              ScheduleBP: this.mapBusinessProfessionalIncome(userData),
              ScheduleHP: this.mapHouseProperty(userData.properties),
              ScheduleCGFor23: this.mapCapitalGains(userData.capitalGains),
              ScheduleS: this.mapSalaryIncome(userData.form16Data),
              ScheduleOS: this.mapOtherSources(userData),
              ScheduleDEP: this.mapDepreciation(userData.businessIncome?.depreciation),
              TaxComputation: this.calculateTax(userData),
              TaxPaid: this.mapTaxPaid(userData.taxPaid),
              Verification: this.generateVerification(userData)
            }
          }
        };
      }

      private mapBusinessProfessionalIncome(userData: UserData) {
        const business = userData.businessIncome;
        return {
          BusinessProfessionDetails: [{
            BusinessNature: business?.businessType,
            BusinessName: business?.businessName,
            BusinessAddress: business?.businessAddress,
            GrossReceipts: business?.grossReceipts,
            NetProfit: business?.netProfit,
            Section44AD: business?.section44AD,
            PresumptiveIncome: business?.presumptiveIncome
          }]
        };
      }

      private mapBalanceSheet(balanceSheet: any) {
        if (!balanceSheet) return null;
        
        return {
          Assets: {
            FixedAssets: balanceSheet.assets?.fixedAssets,
            CurrentAssets: balanceSheet.assets?.currentAssets,
            TotalAssets: balanceSheet.assets?.totalAssets
          },
          Liabilities: {
            Capital: balanceSheet.liabilities?.capital,
            CurrentLiabilities: balanceSheet.liabilities?.currentLiabilities,
            TotalLiabilities: balanceSheet.liabilities?.totalLiabilities
          }
        };
      }
    }

    ITR-4 JSON Generator (Presumptive Taxation)

    class ITR4Generator extends ITRJSONGenerator {
      async generateITR4(userData: UserData) {
        return {
          ITR: {
            ITR4: {
              CreationInfo: this.generateCreationInfo(),
              Form_ITR4: {
                FormName: "ITR-4",
                AssessmentYear: this.assessmentYear,
                SchemaVer: "Ver1.2"
              },
              PersonalInfo: this.mapPersonalInfo(userData),
              FilingStatus: this.mapFilingStatus(userData),
              IncomeDeductions: this.mapPresumptiveIncome(userData),
              ScheduleBP: this.mapPresumptiveBusiness(userData),
              TaxComputation: this.calculatePresumptiveTax(userData),
              TaxPaid: this.mapTaxPaid(userData.taxPaid),
              Schedule80G: this.mapDonations(userData.donations),
              Schedule80D: this.mapMedicalInsurance(userData.medicalInsurance),
              Verification: this.generateVerification(userData)
            }
          }
        };
      }

      private mapPresumptiveBusiness(userData: UserData) {
        const business = userData.businessIncome;
        const professional = userData.professionalIncome;
        
        return {
          // Section 44AD - Business
          Section44AD: business?.section44AD ? {
            GrossTurnover: business.grossReceipts,
            PresumptiveIncome: business.grossReceipts * 0.08,
            DeclaredIncome: business.presumptiveIncome
          } : null,
          
          // Section 44ADA - Professional
          Section44ADA: professional?.section44ADA ? {
            GrossReceipts: professional.grossReceipts,
            PresumptiveIncome: professional.grossReceipts * 0.50,
            DeclaredIncome: professional.presumptiveIncome
          } : null
        };
      }
    }

    6-Month Implementation Timeline

    Month 1: Foundation & Migration

    - Week 1-2: Supabase setup and Prisma schema design
    - Week 3-4: MongoDB to Supabase migration scripts and testing

    Month 2: Core Tax Engine

    - Week 1-2: Enhanced tax calculation engine with regime comparison
    - Week 3-4: Real-time calculator and validation framework

    Month 3: ITR JSON Generation - Part 1

    - Week 1-2: ITR-1 and ITR-2 JSON generators
    - Week 3-4: Comprehensive validation and testing

    Month 4: ITR JSON Generation - Part 2

    - Week 1-2: ITR-3 JSON generator for business income
    - Week 3-4: ITR-4 JSON generator for presumptive taxation

    Month 5: Business Features

    - Week 1-2: Advanced business income management
    - Week 3-4: P&L generator and balance sheet builder

    Month 6: Polish & Launch

    - Week 1-2: Enhanced OCR and document processing
    - Week 3-4: Performance optimization, testing, and deployment

    Success Metrics

    - Data Migration: 100% successful migration with zero data loss
    - JSON Generation: All 4 ITR types generating compliant JSONs
    - Performance: <3 second page loads, <30 second JSON generation
    - User Experience: <15 minute filing time, 95%+ accuracy
    - Platform Reliability: 99.9% uptime, full mobile responsiveness

    This focused 6-month plan delivers a production-ready platform with complete ITR JSON 
    generation capabilities and modern Supabase infrastructure.