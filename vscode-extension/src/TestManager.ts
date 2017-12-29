/**
 * Test suite interface
 */
export interface TestSuite {
  name: string;
  tests: Test[];
}

/**
 * Support test states
 */
export enum TestState {
  Discovered, Succeeded, Failed
}

/**
 * Test interface (represents a test in a test suite)
 */
export interface Test {
  name: string;
  state: TestState;
}

/**
 * Manages and stores tests
 */
export class TestManager {
  private suites: TestSuite[] = [];

  /**
   * Returns the discovered test suites
   */
  get TestSuites() {
    return this.suites;
  }

  /**
   * Applies a test discovery
   * @param suites All test suites
   */
  applyDiscovery(suites: TestSuite[]) {
    this.suites = suites;
  }

  /**
   * Applies a new test status to a specific test
   * @param testSuite Test suite name
   * @param testName  Test name
   * @param succeeded Whether or not the test succeeded
   */
  applyTestStatus(testSuite: string, testName: string, succeeded: boolean) {
    // TODO: Use Map instead
    for (const suite of this.suites) {
      if (suite.name !== testSuite) {
        continue;
      }

      for (const test of suite.tests) {
        if (test.name !== testName) {
          continue;
        }

        test.state = succeeded ? TestState.Succeeded : TestState.Failed;
        return test;
      }
      break;
    }

    return null;
  }
}
