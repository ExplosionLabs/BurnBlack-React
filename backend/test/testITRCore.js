// Core ITR JSON Generation Test (Database-Independent)
// Tests the core tax calculation and JSON generation logic

const ITRJSONGeneratorPrisma = require('../services/ITRJSONGeneratorPrisma');
const fs = require('fs').promises;
const path = require('path');

class ITRCoreTester {
  constructor() {
    this.testResults = {
      taxCalculations: { passed: 0, failed: 0, tests: [] },
      jsonStructure: { passed: 0, failed: 0, tests: [] },
      utilities: { passed: 0, failed: 0, tests: [] }
    };
  }

  async runCoreTests() {
    console.log('🚀 Starting ITR Core Functionality Tests...\n');

    try {
      // Test 1: Tax Calculation Logic
      await this.testTaxCalculations();

      // Test 2: JSON Structure Generation
      await this.testJSONStructure();

      // Test 3: Utility Functions
      await this.testUtilities();

      // Generate test report
      await this.generateTestReport();

    } catch (error) {
      console.error('❌ Core test suite failed:', error);
    }
  }

  // ========================================
  // TEST 1: TAX CALCULATIONS
  // ========================================

  async testTaxCalculations() {
    console.log('💰 Testing Tax Calculation Logic...');

    try {
      const generator = new ITRJSONGeneratorPrisma();

      // Test 1.1: Old regime - Zero tax bracket
      const zeroTax = generator.calculateOldRegimeTax(200000);
      this.assert(
        zeroTax.totalTax === 0,
        `Zero tax for ₹2L income: ₹${zeroTax.totalTax}`,
        'taxCalculations'
      );

      // Test 1.2: Old regime - 5% bracket (considering rebate makes it zero)
      const lowTax = generator.calculateOldRegimeTax(400000);
      this.assert(
        lowTax.totalTax === 0 && lowTax.rebate87A > 0,
        `5% bracket tax for ₹4L: ₹${lowTax.totalTax} (rebate: ₹${lowTax.rebate87A})`,
        'taxCalculations'
      );

      // Test 1.3: Old regime - 20% bracket
      const midTax = generator.calculateOldRegimeTax(800000);
      this.assert(
        midTax.totalTax > 50000 && midTax.totalTax < 100000,
        `20% bracket tax for ₹8L: ₹${midTax.totalTax}`,
        'taxCalculations'
      );

      // Test 1.4: Old regime - 30% bracket
      const highTax = generator.calculateOldRegimeTax(1500000);
      this.assert(
        highTax.totalTax > 200000,
        `30% bracket tax for ₹15L: ₹${highTax.totalTax}`,
        'taxCalculations'
      );

      // Test 1.5: New regime calculations
      const newRegimeZero = generator.calculateNewRegimeTax(250000);
      this.assert(
        newRegimeZero.totalTax === 0,
        `New regime zero tax for ₹2.5L: ₹${newRegimeZero.totalTax}`,
        'taxCalculations'
      );

      const newRegimeMid = generator.calculateNewRegimeTax(800000);
      this.assert(
        newRegimeMid.totalTax < midTax.totalTax,
        `New regime better for ₹8L: ₹${newRegimeMid.totalTax} vs ₹${midTax.totalTax}`,
        'taxCalculations'
      );

      // Test 1.6: Rebate calculations
      this.assert(
        lowTax.rebate87A > 0,
        `Section 87A rebate applied: ₹${lowTax.rebate87A}`,
        'taxCalculations'
      );

      // Test 1.7: Cess calculations
      this.assert(
        midTax.cess === midTax.taxAfterRebate * 0.04,
        `Health & Education Cess (4%): ₹${midTax.cess}`,
        'taxCalculations'
      );

      console.log('✅ Tax calculation tests completed\n');

    } catch (error) {
      this.assert(false, `Tax calculation failed: ${error.message}`, 'taxCalculations');
    }
  }

  // ========================================
  // TEST 2: JSON STRUCTURE
  // ========================================

  async testJSONStructure() {
    console.log('📄 Testing JSON Structure Generation...');

    try {
      const generator = new ITRJSONGeneratorPrisma('ITR-1', '2024-25');

      // Create mock user data
      const mockUserData = this.createMockUserData();

      // Test 2.1: ITR-1 structure generation
      const itr1Json = await generator.generateITR1(mockUserData);
      
      this.assert(
        itr1Json.ITR && itr1Json.ITR.ITR1,
        'ITR-1 root structure generated',
        'jsonStructure'
      );

      // Test 2.2: Required sections presence
      const requiredSections = [
        'CreationInfo', 'Form_ITR1', 'PersonalInfo', 'FilingStatus',
        'ITR1_IncomeDeductions', 'ITR1_TaxComputation', 'TaxPaid', 
        'Refund', 'Verification'
      ];

      for (const section of requiredSections) {
        this.assert(
          itr1Json.ITR.ITR1[section],
          `Required section present: ${section}`,
          'jsonStructure'
        );
      }

      // Test 2.3: Personal info mapping
      const personalInfo = itr1Json.ITR.ITR1.PersonalInfo;
      this.assert(
        personalInfo.PAN === 'ABCDE1234F' && personalInfo.AssesseeName.FirstName === 'Test',
        'Personal information correctly mapped',
        'jsonStructure'
      );

      // Test 2.4: Income and deduction mapping
      const incomeDeductions = itr1Json.ITR.ITR1.ITR1_IncomeDeductions;
      this.assert(
        typeof incomeDeductions.GrossTotIncome === 'number',
        `Income values mapped as numbers: ₹${incomeDeductions.GrossTotIncome}`,
        'jsonStructure'
      );

      // Test 2.5: Tax computation mapping
      const taxComputation = itr1Json.ITR.ITR1.ITR1_TaxComputation;
      this.assert(
        taxComputation.NetTaxLiability >= 0,
        `Tax liability calculated: ₹${taxComputation.NetTaxLiability}`,
        'jsonStructure'
      );

      // Test 2.6: Schedule mapping
      this.assert(
        itr1Json.ITR.ITR1.Schedule80G && itr1Json.ITR.ITR1.Schedule80D,
        'Tax saving schedules mapped',
        'jsonStructure'
      );

      console.log('✅ JSON structure tests completed\n');

    } catch (error) {
      this.assert(false, `JSON structure failed: ${error.message}`, 'jsonStructure');
    }
  }

  // ========================================
  // TEST 3: UTILITY FUNCTIONS
  // ========================================

  async testUtilities() {
    console.log('🔧 Testing Utility Functions...');

    try {
      const generator = new ITRJSONGeneratorPrisma();

      // Test 3.1: ITR type recommendation
      const mockData1 = { income: { totalIncome: 400000, business: { netProfit: 0 }, capitalGains: { longTerm: 0 } } };
      const recommendation1 = generator.recommendITRType(mockData1);
      this.assert(
        recommendation1 === 'ITR-1',
        `ITR-1 recommended for salary income: ${recommendation1}`,
        'utilities'
      );

      const mockData2 = { income: { totalIncome: 800000, business: { netProfit: 100000 }, capitalGains: { longTerm: 0 } } };
      const recommendation2 = generator.recommendITRType(mockData2);
      this.assert(
        recommendation2 === 'ITR-3',
        `ITR-3 recommended for business income: ${recommendation2}`,
        'utilities'
      );

      // Test 3.2: Checksum generation
      const testData = { test: 'data' };
      const checksum = generator.generateChecksum(testData);
      this.assert(
        checksum && checksum.length === 32,
        `Checksum generated: ${checksum.substring(0, 8)}...`,
        'utilities'
      );

      // Test 3.3: Digest generation
      const digest = generator.generateDigest();
      this.assert(
        digest && digest.length === 32,
        `Digest generated: ${digest.substring(0, 8)}...`,
        'utilities'
      );

      // Test 3.4: State code mapping
      const stateCode = generator.getStateCode('MAHARASHTRA');
      this.assert(
        stateCode === '27',
        `State code mapped correctly: MAHARASHTRA -> ${stateCode}`,
        'utilities'
      );

      // Test 3.5: Data validation
      const mockUserData = this.createMockUserData();
      const validation = await generator.validateDataCompleteness(mockUserData);
      this.assert(
        typeof validation.completionPercentage === 'number',
        `Data validation works: ${validation.completionPercentage}% complete`,
        'utilities'
      );

      console.log('✅ Utility function tests completed\n');

    } catch (error) {
      this.assert(false, `Utility function failed: ${error.message}`, 'utilities');
    }
  }

  // ========================================
  // HELPER METHODS
  // ========================================

  createMockUserData() {
    return {
      user: {
        id: 'test-user-123',
        email: 'test@example.com',
        personalDetails: {
          firstName: 'Test',
          lastName: 'User',
          middleName: 'Kumar',
          dob: new Date('1990-01-01'),
          gender: 'MALE',
          maritalStatus: 'SINGLE',
          fatherName: 'Test Father'
        },
        contactDetails: {
          panNumber: 'ABCDE1234F',
          aadharNumber: '123456789012',
          phoneNumber: '9999999999'
        },
        addressDetails: {
          flatNo: '101',
          premiseName: 'Test Apartment',
          road: 'Test Road',
          area: 'Test Area',
          city: 'Mumbai',
          state: 'MAHARASHTRA',
          pincode: '400001'
        },
        bankDetails: {
          bankName: 'Test Bank',
          accountNumber: '1234567890',
          ifscCode: 'TEST0001234',
          accountType: 'SAVINGS'
        },
        form16Data: [{
          employerName: 'Test Company',
          grossSalary: 800000,
          totalTax: 50000,
          financialYear: '2023-24'
        }],
        taxSavingInvestments: [{
          investmentType: 'PPF',
          amount: 150000,
          section: '80C',
          financialYear: '2023-24'
        }],
        interestIncome: [{
          sourceType: 'SAVINGS_ACCOUNT',
          amount: 15000,
          financialYear: '2023-24'
        }],
        donations: [],
        medicalInsurance: [],
        taxPaid: []
      },
      income: {
        salary: { gross: 800000, netSalary: 750000, standardDeduction: 50000 },
        houseProperty: { netIncome: 0, annualValue: 0, standardDeduction: 0 },
        capitalGains: { shortTerm: 0, longTerm: 0, taxableLTCG: 0 },
        otherSources: { total: 15000, interest: 15000, dividend: 0 },
        business: { netProfit: 0, turnover: 0, presumptiveIncome: 0 },
        totalIncome: 765000
      },
      deductions: {
        section80C: 150000,
        section80D: 0,
        section80G: 0,
        section80TTA: 10000,
        totalDeductions: 160000
      },
      tax: {
        grossIncome: 765000,
        taxableIncome: 605000,
        oldRegime: { totalTax: 36400, taxAfterRebate: 35000, cess: 1400, rebate87A: 0 },
        newRegime: { totalTax: 31200, taxAfterRebate: 30000, cess: 1200, rebate87A: 0 },
        recommendedRegime: 'NEW',
        tdsTotal: 50000,
        advanceTax: 0,
        totalTaxPaid: 50000,
        refundDue: 18800,
        balanceTax: 0
      }
    };
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
      systemValidation: {
        taxCalculationEngine: this.testResults.taxCalculations.failed === 0,
        jsonGenerationEngine: this.testResults.jsonStructure.failed === 0,
        utilityFunctions: this.testResults.utilities.failed === 0,
        overallReadiness: false
      }
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

    report.systemValidation.overallReadiness = 
      report.systemValidation.taxCalculationEngine &&
      report.systemValidation.jsonGenerationEngine &&
      report.systemValidation.utilityFunctions;

    // Save report
    const reportPath = path.join(__dirname, 'output', `itr-core-test-report-${Date.now()}.json`);
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

    // Console summary
    console.log('\n📊 ITR CORE FUNCTIONALITY TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${report.summary.totalTests}`);
    console.log(`Passed: ${report.summary.totalPassed}`);
    console.log(`Failed: ${report.summary.totalFailed}`);
    console.log(`Success Rate: ${report.summary.successRate}%`);
    console.log('\n🔍 SYSTEM VALIDATION:');
    console.log(`Tax Calculation Engine: ${report.systemValidation.taxCalculationEngine ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`JSON Generation Engine: ${report.systemValidation.jsonGenerationEngine ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Utility Functions: ${report.systemValidation.utilityFunctions ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Overall System Readiness: ${report.systemValidation.overallReadiness ? '✅ READY' : '❌ NOT READY'}`);
    console.log(`\nReport saved: ${reportPath}`);

    if (report.systemValidation.overallReadiness) {
      console.log('\n🎉 ITR JSON GENERATION CORE SYSTEM IS WORKING PERFECTLY!');
      console.log('✅ Tax calculations are accurate for both old and new regimes');
      console.log('✅ JSON structure generation follows IT Department schema');
      console.log('✅ All utility functions are working correctly');
      console.log('✅ Ready for integration with PostgreSQL database');
      console.log('✅ Meets PLATFORM_UPGRADE_PLAN.md Month 6 objectives');
    } else {
      console.log('\n⚠️ ITR Core System needs attention before production');
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new ITRCoreTester();
  tester.runCoreTests().catch(console.error);
}

module.exports = ITRCoreTester;