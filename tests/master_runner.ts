import path from 'node:path';
import { setupTestEnvironment } from './setup';
import { harness } from './test_harness';
import { runTier1BuildAndAssetsTests } from './tier1_build_assets';
import { runTier1CommandsTests } from './tier1_commands';
import { runTier1UILifecycleTests } from './tier1_ui_lifecycle';
import { runTier2BoundariesTests } from './tier2_boundaries';
import { runTier3CombinationsTests } from './tier3_combinations';
import { runTier4ScenariosTests } from './tier4_scenarios';
import { runChallenger2StressSuite } from './challenger2_ui_lifecycle_stress';
import { runChallenger1StressSuite } from '../test_probe';

export async function runAllTests(projectRoot: string) {
  setupTestEnvironment();

  console.log(`================================================================`);
  console.log(`🚀 ARYAN PRASAD LINUX TERMINAL PORTFOLIO — MASTER E2E TEST RUNNER`);
  console.log(`Root: ${projectRoot}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`================================================================`);

  // Tier 1
  await runTier1BuildAndAssetsTests(projectRoot);
  await runTier1CommandsTests();
  await runTier1UILifecycleTests();

  // Tier 2
  await runTier2BoundariesTests();

  // Tier 3
  await runTier3CombinationsTests();

  // Tier 4
  await runTier4ScenariosTests();

  // Challenger 1 Stress Suite
  await runChallenger1StressSuite(projectRoot);

  // Challenger 2 Stress Suite
  await runChallenger2StressSuite(projectRoot);

  const allPassed = harness.printOverallSummary();

  return {
    passed: allPassed,
    summaries: harness.getAllSummaries(),
  };
}
