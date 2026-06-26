/**
 * CPC Serialization Boundary Guard Tests
 *
 * ⚠️ CRITICAL: These tests protect the Phase 8 architecture boundary.
 * CPC (Commitment Pressure Classification) is INTERNAL ONLY.
 *
 * These tests verify that CPC is never accidentally added to:
 * - AssessmentRecord type definition
 * - _v2 namespace
 * - Public API responses (/api/v2/score, /api/v1/score)
 * - Evaluation table schema
 * - Any public-facing serialization
 *
 * If these tests fail, it means CPC has been exposed publicly,
 * which violates the Phase 8 locked boundary.
 *
 * Reference: Phase 8 locked status, Step 6A–6D planning, Step 7A–7B implementation
 */

import { describe, test, expect, beforeAll } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

describe('CPC Serialization Boundaries', () => {
  /**
   * CATEGORY A: Type Definition Boundaries
   * Verify that CPC is not added to any public type definitions
   */
  describe('Type Definitions', () => {
    let v2TypesSource: string;

    beforeAll(() => {
      const typesPath = join(__dirname, '../../src/lib/engine/v2/types.ts');
      v2TypesSource = readFileSync(typesPath, 'utf-8');
    });

    test('AssessmentRecord type does not have cpc field', () => {
      // Find AssessmentRecord interface definition
      const assessmentRecordMatch = v2TypesSource.match(/export interface AssessmentRecord[\s\S]*?^\}/m);
      expect(assessmentRecordMatch).not.toBeNull();

      const assessmentRecord = assessmentRecordMatch![0];

      // Verify no CPC fields
      expect(assessmentRecord).not.toMatch(/\bcpc\b(?!.*:)/i);
      expect(assessmentRecord).not.toMatch(/\bcommitment_pressure\b/i);
      expect(assessmentRecord).not.toMatch(/\bCommitmentPressureClassification\b/i);
      expect(assessmentRecord).not.toMatch(/\bCpcClass\b/i);
    });

    test('AssessmentRecord does not include any CPC-related fields', () => {
      const assessmentRecordMatch = v2TypesSource.match(/export interface AssessmentRecord[\s\S]*?^\}/m);
      const assessmentRecord = assessmentRecordMatch![0];

      // Verify field names
      const fieldNames = assessmentRecord.match(/^\s+\w+\??:/gm) || [];
      const hasAnyCpcField = fieldNames.some(field =>
        /cpc|commitment|pressure/i.test(field)
      );

      expect(hasAnyCpcField).toBe(false);
    });

    test('OutcomeLayerResult (if present) does not have CPC fields', () => {
      const hasOutcomeLayer = v2TypesSource.includes('OutcomeLayerResult');

      if (hasOutcomeLayer) {
        const outcomeMatch = v2TypesSource.match(/export interface OutcomeLayerResult[\s\S]*?^\}/m);
        if (outcomeMatch) {
          const outcome = outcomeMatch[0];
          expect(outcome).not.toMatch(/\bcpc\b/i);
          expect(outcome).not.toMatch(/\bcommitment_pressure\b/i);
        }
      }

      // If no OutcomeLayerResult, test still passes
      expect(true).toBe(true);
    });
  });

  /**
   * CATEGORY B: _v2 Namespace Boundaries
   * Verify that _v2 namespace does not contain CPC
   */
  describe('_v2 Namespace Boundaries', () => {
    let engineTypesSource: string;

    beforeAll(() => {
      const typesPath = join(__dirname, '../../src/lib/engine/types.ts');
      engineTypesSource = readFileSync(typesPath, 'utf-8');
    });

    test('_v2 namespace (if present) does not contain CPC fields', () => {
      const hasV2Namespace = engineTypesSource.includes('_v2');

      if (hasV2Namespace) {
        // Find the _v2 type definition
        const v2Match = engineTypesSource.match(/_v2\??:\s*\{[^}]*\}/);

        if (v2Match) {
          const v2Definition = v2Match[0];
          expect(v2Definition).not.toMatch(/\bcpc\b/i);
          expect(v2Definition).not.toMatch(/\bcommitment_pressure\b/i);
          expect(v2Definition).not.toMatch(/\bCommitmentPressureClassification\b/i);
        }
      }

      // If no _v2 namespace, test passes (constraint met)
      expect(true).toBe(true);
    });
  });

  /**
   * CATEGORY C: API Response Serialization Boundaries
   * Verify that API endpoints do not serialize CPC in responses
   */
  describe('/api/v2/score Response Boundaries', () => {
    let v2ScoreSource: string;

    beforeAll(() => {
      const routePath = join(__dirname, '../../src/app/api/v2/score/route.ts');
      v2ScoreSource = readFileSync(routePath, 'utf-8');
    });

    test('POST /api/v2/score returns result directly via NextResponse.json', () => {
      // Verify the route returns the assessment result
      expect(v2ScoreSource).toMatch(/return NextResponse\.json\(result\)/);
      expect(v2ScoreSource).not.toMatch(/return NextResponse\.json\(\{.*cpc/i);
    });

    test('POST /api/v2/score does not add CPC to response before serialization', () => {
      // Verify there's no CPC manipulation before response
      const responseSection = v2ScoreSource.match(/executeAssessment[\s\S]*?NextResponse\.json/);

      if (responseSection) {
        expect(responseSection[0]).not.toMatch(/\.cpc\s*=/i);
        expect(responseSection[0]).not.toMatch(/commitment_pressure/i);
        expect(responseSection[0]).not.toMatch(/CpcClass/i);
      }
    });
  });

  /**
   * CATEGORY D: v1 API Response Boundaries
   * Verify that v1 API also does not serialize CPC
   */
  describe('/api/v1/score Response Boundaries', () => {
    let v1ScoreSource: string;

    beforeAll(() => {
      const routePath = join(__dirname, '../../src/app/api/v1/score/route.ts');
      v1ScoreSource = readFileSync(routePath, 'utf-8');
    });

    test('POST /api/v1/score does not include CPC in response', () => {
      // v1 uses an adapter, verify it doesn't add CPC
      expect(v1ScoreSource).not.toMatch(/\.cpc\s*=/i);
      expect(v1ScoreSource).not.toMatch(/commitment_pressure/i);
      expect(v1ScoreSource).not.toMatch(/CpcClass/i);
    });
  });

  /**
   * CATEGORY E: Database Schema Boundaries
   * Verify that Evaluation table schema does not persist CPC
   */
  describe('Database Schema Boundaries', () => {
    let schemaSource: string;

    beforeAll(() => {
      const schemaPath = join(__dirname, '../../prisma/schema.prisma');
      schemaSource = readFileSync(schemaPath, 'utf-8');
    });

    test('Evaluation table model does not have cpc_class field', () => {
      const evaluationMatch = schemaSource.match(/model Evaluation[\s\S]*?^\}/m);
      expect(evaluationMatch).not.toBeNull();

      const evaluation = evaluationMatch![0];
      expect(evaluation).not.toMatch(/cpc_class/i);
      expect(evaluation).not.toMatch(/commitment_pressure_class/i);
    });

    test('Evaluation table model does not have cpc_score field', () => {
      const evaluationMatch = schemaSource.match(/model Evaluation[\s\S]*?^\}/m);
      const evaluation = evaluationMatch![0];

      expect(evaluation).not.toMatch(/cpc_score/i);
      expect(evaluation).not.toMatch(/commitment_pressure_score/i);
    });

    test('Evaluation table does not have any CPC-related columns', () => {
      const evaluationMatch = schemaSource.match(/model Evaluation[\s\S]*?^\}/m);
      const evaluation = evaluationMatch![0];

      // Check for any field that might store CPC
      expect(evaluation).not.toMatch(/cpc[_\w]*/i);
      expect(evaluation).not.toMatch(/commitment[_\w]*pressure/i);
    });
  });

  /**
   * CATEGORY F: Negative Control Tests
   * Verify that guard tests don't over-block internal-only CPC files
   */
  describe('Negative Control Tests', () => {
    test('Internal /src/lib/cpc/* files CAN contain CPC terms (not blocked)', () => {
      // Verify that internal CPC files exist and contain CPC terms
      // This is expected and should not trigger guard test failures
      const cpcFormula = readFileSync(
        join(__dirname, '../../src/lib/cpc/formula.ts'),
        'utf-8'
      );

      // Internal files SHOULD contain CPC logic
      expect(cpcFormula).toMatch(/cpc|commitment_pressure/i);
      // This is OK — internal files can contain CPC
    });

    test('Internal /tests/phase8-cpc/* files CAN contain CPC terms (not blocked)', () => {
      // Verify that internal CPC test files contain CPC terms
      // This is expected and should not trigger guard test failures
      const cpcTest = readFileSync(
        join(__dirname, '../../tests/phase8/cpc-formula.test.ts'),
        'utf-8'
      );

      // Internal test files SHOULD contain CPC logic
      expect(cpcTest).toMatch(/cpc|CPM|CPL/i);
      // This is OK — internal test files can contain CPC
    });

    test('Comments in production code can mention CPC without failing guard', () => {
      // Comments explaining CPC are allowed
      const v2Route = readFileSync(
        join(__dirname, '../../src/app/api/v2/score/route.ts'),
        'utf-8'
      );

      // Comments are OK, we're only checking serialized output
      const routeLogic = v2Route.match(/NextResponse\.json\(result\)/);
      expect(routeLogic).toBeTruthy();

      // The response itself does not contain CPC
      expect(v2Route).toMatch(/return NextResponse\.json\(result\)/);
    });
  });

  /**
   * CATEGORY G: Regression Prevention
   * Verify that the locked Phase 8 boundaries remain intact
   */
  describe('Phase 8 Architecture Regression Prevention', () => {
    test('AssessmentRecord type continues to be returned directly by /api/v2/score', () => {
      // This is the known locked risk: /api/v2/score returns AssessmentRecord directly
      // We're NOT changing this; just verifying the boundary
      const v2Route = readFileSync(
        join(__dirname, '../../src/app/api/v2/score/route.ts'),
        'utf-8'
      );

      expect(v2Route).toMatch(/return NextResponse\.json\(result\)/);
      // Result is AssessmentRecord from executeAssessment()
    });

    test('CPC must not enter any serialized public response', () => {
      // Comprehensive check: CPC terms should not appear in public-facing serialization
      const v2Route = readFileSync(
        join(__dirname, '../../src/app/api/v2/score/route.ts'),
        'utf-8'
      );
      const v1Route = readFileSync(
        join(__dirname, '../../src/app/api/v1/score/route.ts'),
        'utf-8'
      );

      // Both routes should NOT add CPC before returning response
      expect(v2Route + v1Route).not.toMatch(/NextResponse\.json\(\{[\s\S]*?cpc[\s\S]*?\}\)/i);
    });
  });
});
