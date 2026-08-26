import { runOLSUntTests } from './ols.test';
import { runKMeansUnitTests } from './kmeans.test';

export function runAllHealthTechTests() {
  console.log('=== HEALTHTECH AUTOMATED TEST SUITE ===');
  
  const olsResult = runOLSUntTests();
  console.log(`[OLS Test]: ${olsResult.passed ? 'PASSED' : 'FAILED'} - ${olsResult.message}`);

  const kmeansResult = runKMeansUnitTests();
  console.log(`[K-Means Test]: ${kmeansResult.passed ? 'PASSED' : 'FAILED'} - ${kmeansResult.message}`);

  const allPassed = olsResult.passed && kmeansResult.passed;
  console.log(`=== SUMMARY: ${allPassed ? 'ALL TESTS PASSED (100%)' : 'SOME TESTS FAILED'} ===`);

  return { allPassed, olsResult, kmeansResult };
}

// Browser & Universal Environment Test Execution Helper
export const testSummary = runAllHealthTechTests();

