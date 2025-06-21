// Test Runner for ITR JSON Generation System
// Executes comprehensive tests and validates the PLATFORM_UPGRADE_PLAN.md objectives

const ITRGenerationTester = require('./testITRGeneration');

async function runTests() {
  console.log('🧪 BurnBlack ITR JSON Generation System - Test Suite');
  console.log('==================================================');
  console.log('Testing PLATFORM_UPGRADE_PLAN.md Month 6 Objectives:\n');
  console.log('✓ Robust ITR filing platform');
  console.log('✓ Compliant JSON generation for IT Department');
  console.log('✓ Manual upload capability');
  console.log('✓ PostgreSQL integration with Prisma\n');

  const tester = new ITRGenerationTester();
  await tester.runAllTests();
}

runTests().catch(error => {
  console.error('Test suite execution failed:', error);
  process.exit(1);
});