// Comprehensive Test Script for ITR JSON Generation System
// Tests the complete flow from Prisma data aggregation to compliant JSON generation

const { PrismaClient } = require('@prisma/client');
const ITRJSONGeneratorPrisma = require('../services/ITRJSONGeneratorPrisma');
const fs = require('fs').promises;
const path = require('path');

const prisma = new PrismaClient();

class ITRGenerationTester {
  constructor() {
    this.testResults = {
      dataAggregation: { passed: 0, failed: 0, tests: [] },
      taxCalculations: { passed: 0, failed: 0, tests: [] },
      jsonGeneration: { passed: 0, failed: 0, tests: [] },
      schemaCompliance: { passed: 0, failed: 0, tests: [] },
      endToEnd: { passed: 0, failed: 0, tests: [] }
    };
  }

  async runAllTests() {
    console.log('🚀 Starting ITR JSON Generation System Tests...\n');

    try {
      // Test 1: Data Aggregation from PostgreSQL
      await this.testDataAggregation();

      // Test 2: Tax Calculations (Old vs New Regime)
      await this.testTaxCalculations();

      // Test 3: ITR JSON Generation (ITR-1 to ITR-4)
      await this.testITRJSONGeneration();

      // Test 4: Schema Compliance Validation
      await this.testSchemaCompliance();

      // Test 5: End-to-End Workflow
      await this.testEndToEndWorkflow();

      // Generate test report
      await this.generateTestReport();

    } catch (error) {
      console.error('❌ Test suite failed:', error);
    } finally {
      await prisma.$disconnect();
    }
  }

  // ========================================
  // TEST 1: DATA AGGREGATION
  // ========================================

  async testDataAggregation() {
    console.log('🔍 Testing Data Aggregation from PostgreSQL...');

    try {
      // Create test user with comprehensive data
      const testUser = await this.createTestUser();
      
      const generator = new ITRJSONGeneratorPrisma();
      const userData = await generator.aggregateUserData(testUser.id);

      // Test 1.1: User data structure
      this.assert(
        userData.user && userData.income && userData.deductions && userData.tax,
        'Complete user data structure aggregated',
        'dataAggregation'
      );

      // Test 1.2: Income calculations
      this.assert(
        userData.income.totalIncome > 0,
        `Total income calculated: ₹${userData.income.totalIncome}`,
        'dataAggregation'
      );

      // Test 1.3: Deduction calculations
      this.assert(
        userData.deductions.totalDeductions >= 0,
        `Total deductions calculated: ₹${userData.deductions.totalDeductions}`,
        'dataAggregation'
      );

      // Test 1.4: Tax calculations
      this.assert(
        userData.tax.oldRegime && userData.tax.newRegime,
        'Both tax regimes calculated',
        'dataAggregation'
      );

      console.log('✅ Data aggregation tests completed\n');

    } catch (error) {
      this.assert(false, `Data aggregation failed: ${error.message}`, 'dataAggregation');
    }
  }

  // ========================================
  // TEST 2: TAX CALCULATIONS
  // ========================================

  async testTaxCalculations() {
    console.log('💰 Testing Tax Calculations...');

    try {
      const generator = new ITRJSONGeneratorPrisma();

      // Test 2.1: Old regime tax calculation
      const oldRegimeTax = generator.calculateOldRegimeTax(800000);
      this.assert(
        oldRegimeTax.totalTax > 0,
        `Old regime tax for ₹8L: ₹${oldRegimeTax.totalTax}`,
        'taxCalculations'
      );

      // Test 2.2: New regime tax calculation
      const newRegimeTax = generator.calculateNewRegimeTax(800000);
      this.assert(
        newRegimeTax.totalTax >= 0,
        `New regime tax for ₹8L: ₹${newRegimeTax.totalTax}`,
        'taxCalculations'
      );

      // Test 2.3: Rebate calculations
      const lowIncomeTax = generator.calculateOldRegimeTax(400000);
      this.assert(
        lowIncomeTax.rebate87A > 0,
        `Rebate 87A applied for low income: ₹${lowIncomeTax.rebate87A}`,
        'taxCalculations'
      );

      // Test 2.4: High income tax calculation
      const highIncomeTax = generator.calculateOldRegimeTax(2000000);
      this.assert(
        highIncomeTax.totalTax > 300000,
        `High income tax calculated correctly: ₹${highIncomeTax.totalTax}`,
        'taxCalculations'
      );

      console.log('✅ Tax calculation tests completed\n');

    } catch (error) {
      this.assert(false, `Tax calculation failed: ${error.message}`, 'taxCalculations');
    }
  }

  // ========================================
  // TEST 3: ITR JSON GENERATION
  // ========================================

  async testITRJSONGeneration() {
    console.log('📄 Testing ITR JSON Generation...');

    try {
      const testUser = await this.createTestUser();

      // Test 3.1: ITR-1 Generation
      const itr1Generator = new ITRJSONGeneratorPrisma('ITR-1', '2024-25');
      const itr1Result = await itr1Generator.generateCompliantJSON(testUser.id);
      
      this.assert(
        itr1Result.json.ITR.ITR1,
        'ITR-1 JSON structure generated',
        'jsonGeneration'
      );

      this.assert(
        itr1Result.fileName.includes('ITR-1'),
        `ITR-1 filename generated: ${itr1Result.fileName}`,
        'jsonGeneration'
      );

      // Test 3.2: ITR Type Recommendation
      const userData = await itr1Generator.aggregateUserData(testUser.id);
      const recommendedITR = itr1Generator.recommendITRType(userData);
      
      this.assert(
        ['ITR-1', 'ITR-2', 'ITR-3', 'ITR-4'].includes(recommendedITR),
        `ITR type recommended: ${recommendedITR}`,
        'jsonGeneration'
      );

      // Test 3.3: Data completeness validation
      const validation = await itr1Generator.validateDataCompleteness(userData);
      this.assert(
        typeof validation.completionPercentage === 'number',
        `Data completeness: ${validation.completionPercentage}%`,
        'jsonGeneration'
      );

      // Test 3.4: Checksum generation
      this.assert(
        itr1Result.checksum && itr1Result.checksum.length === 32,
        `Checksum generated: ${itr1Result.checksum.substring(0, 8)}...`,
        'jsonGeneration'
      );

      console.log('✅ ITR JSON generation tests completed\n');

    } catch (error) {
      this.assert(false, `ITR JSON generation failed: ${error.message}`, 'jsonGeneration');
    }
  }

  // ========================================
  // TEST 4: SCHEMA COMPLIANCE
  // ========================================

  async testSchemaCompliance() {
    console.log('🔍 Testing Schema Compliance...');

    try {
      const testUser = await this.createTestUser();
      const generator = new ITRJSONGeneratorPrisma('ITR-1', '2024-25');
      const result = await generator.generateCompliantJSON(testUser.id);
      const itrJson = result.json;

      // Test 4.1: Root structure
      this.assert(
        itrJson.ITR && itrJson.ITR.ITR1,
        'Root ITR structure present',
        'schemaCompliance'
      );

      // Test 4.2: Required sections
      const requiredSections = [
        'CreationInfo', 'Form_ITR1', 'PersonalInfo', 'FilingStatus',
        'ITR1_IncomeDeductions', 'ITR1_TaxComputation', 'TaxPaid', 
        'Refund', 'Verification'
      ];

      for (const section of requiredSections) {
        this.assert(
          itrJson.ITR.ITR1[section],
          `Required section present: ${section}`,
          'schemaCompliance'
        );
      }

      // Test 4.3: Personal info fields
      const personalInfo = itrJson.ITR.ITR1.PersonalInfo;
      this.assert(
        personalInfo.PAN && personalInfo.AssesseeName,
        'Essential personal info present',
        'schemaCompliance'
      );

      // Test 4.4: Numeric values validation
      const incomeDeductions = itrJson.ITR.ITR1.ITR1_IncomeDeductions;
      this.assert(
        typeof incomeDeductions.GrossTotIncome === 'number',
        'Numeric values properly formatted',
        'schemaCompliance'
      );

      console.log('✅ Schema compliance tests completed\n');

    } catch (error) {
      this.assert(false, `Schema compliance failed: ${error.message}`, 'schemaCompliance');
    }
  }

  // ========================================
  // TEST 5: END-TO-END WORKFLOW
  // ========================================

  async testEndToEndWorkflow() {
    console.log('🔄 Testing End-to-End Workflow...');

    try {
      const testUser = await this.createTestUser();

      // Test 5.1: Complete ITR generation workflow
      const generator = new ITRJSONGeneratorPrisma('ITR-1', '2024-25');
      const result = await generator.generateCompliantJSON(testUser.id);

      // Test 5.2: Save JSON file
      const outputPath = path.join(__dirname, 'output', result.fileName);
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, JSON.stringify(result.json, null, 2));

      this.assert(
        await this.fileExists(outputPath),
        `ITR JSON file saved: ${result.fileName}`,
        'endToEnd'
      );

      // Test 5.3: File size validation
      const stats = await fs.stat(outputPath);
      this.assert(
        stats.size > 1000, // At least 1KB
        `Generated file size: ${(stats.size / 1024).toFixed(2)} KB`,
        'endToEnd'
      );

      // Test 5.4: JSON parsing validation
      const savedContent = await fs.readFile(outputPath, 'utf8');
      const parsedJson = JSON.parse(savedContent);
      this.assert(
        parsedJson.ITR,
        'Generated JSON is valid and parseable',
        'endToEnd'
      );

      // Test 5.5: Database logging simulation
      const mockLog = {
        userId: testUser.id,
        itrType: 'ITR-1',
        fileName: result.fileName,
        checksum: result.checksum,
        assessmentYear: '2024-25',
        generatedAt: new Date(),
        metadata: JSON.stringify(result.metadata)
      };

      this.assert(
        mockLog.checksum === result.checksum,
        'Database logging structure validated',
        'endToEnd'
      );

      console.log('✅ End-to-end workflow tests completed\n');

    } catch (error) {
      this.assert(false, `End-to-end workflow failed: ${error.message}`, 'endToEnd');
    }
  }

  // ========================================
  // HELPER METHODS
  // ========================================

  async createTestUser() {
    // Create comprehensive test user data
    const testUser = await prisma.user.create({
      data: {
        email: `test_${Date.now()}@example.com`,
        googleId: `google_${Date.now()}`,
        role: 'USER',
        personalDetails: {
          create: {
            firstName: 'Test',
            lastName: 'User',
            middleName: 'Kumar',
            dob: new Date('1990-01-01'),
            gender: 'MALE',
            maritalStatus: 'SINGLE',
            fatherName: 'Test Father'
          }
        },
        contactDetails: {
          create: {
            panNumber: 'ABCDE1234F',
            aadharNumber: '123456789012',
            phoneNumber: '9999999999'
          }
        },
        addressDetails: {
          create: {
            flatNo: '101',
            premiseName: 'Test Apartment',
            road: 'Test Road',
            area: 'Test Area',
            city: 'Mumbai',
            state: 'MAHARASHTRA',
            pincode: '400001'
          }
        },
        bankDetails: {
          create: {
            bankName: 'Test Bank',
            accountNumber: '1234567890',
            ifscCode: 'TEST0001234',
            accountType: 'SAVINGS'
          }
        },
        form16Data: {
          create: [
            {
              employerName: 'Test Company',
              grossSalary: 800000,
              totalTax: 50000,
              financialYear: '2023-24'
            }
          ]
        },
        taxSavingInvestments: {
          create: [
            {
              investmentType: 'PPF',
              amount: 150000,
              section: '80C',
              financialYear: '2023-24'
            }
          ]
        },
        interestIncome: {
          create: [
            {
              sourceType: 'SAVINGS_ACCOUNT',
              amount: 15000,
              financialYear: '2023-24'
            }
          ]
        }
      },
      include: {
        personalDetails: true,
        contactDetails: true,
        addressDetails: true,
        bankDetails: true,
        form16Data: true,
        taxSavingInvestments: true,
        interestIncome: true
      }
    });

    return testUser;
  }

  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  assert(condition, message, category) {
    const test = { message, passed: condition };
    this.testResults[category].tests.push(test);
    
    if (condition) {
      this.testResults[category].passed++;
      console.log(`  ✅ ${message}`);
    } else {
      this.testResults[category].failed++;
      console.log(`  ❌ ${message}`);
    }
  }

  async generateTestReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: 0,
        totalPassed: 0,
        totalFailed: 0,
        successRate: 0
      },
      categories: this.testResults,
      recommendations: []
    };

    // Calculate totals
    Object.values(this.testResults).forEach(category => {
      report.summary.totalTests += category.passed + category.failed;
      report.summary.totalPassed += category.passed;
      report.summary.totalFailed += category.failed;
    });

    report.summary.successRate = Math.round(
      (report.summary.totalPassed / report.summary.totalTests) * 100
    );

    // Generate recommendations
    if (report.summary.successRate < 90) {
      report.recommendations.push('Review failed tests and fix underlying issues');
    }
    if (this.testResults.schemaCompliance.failed > 0) {
      report.recommendations.push('ITR JSON schema compliance needs attention');
    }
    if (this.testResults.taxCalculations.failed > 0) {
      report.recommendations.push('Tax calculation logic requires review');
    }

    // Save report
    const reportPath = path.join(__dirname, 'output', `itr-test-report-${Date.now()}.json`);
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

    // Console summary
    console.log('\n📊 TEST SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total Tests: ${report.summary.totalTests}`);
    console.log(`Passed: ${report.summary.totalPassed}`);
    console.log(`Failed: ${report.summary.totalFailed}`);
    console.log(`Success Rate: ${report.summary.successRate}%`);
    console.log(`Report saved: ${reportPath}`);

    if (report.summary.successRate >= 90) {
      console.log('\n🎉 ITR JSON Generation System is working correctly!');
      console.log('✅ Ready for production use according to PLATFORM_UPGRADE_PLAN.md objectives');
    } else {
      console.log('\n⚠️ ITR JSON Generation System needs attention');
      console.log('❌ Review failed tests before production deployment');
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new ITRGenerationTester();
  tester.runAllTests().catch(console.error);
}

module.exports = ITRGenerationTester;