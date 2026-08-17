import { OLSModelMetricsEntity } from '../models/cluster.model';
import { OLSPredictionInput } from '../schemas/cluster.schema';

export class OLSRegressionService {
  // Grounded OLS Model parameters from the competition paper SEC_(SD2026020000224)
  private readonly modelMetrics: OLSModelMetricsEntity = {
    interceptBeta0: 14.20,
    pharmacistCoeffBeta1: 22.94,     // Significant Predictor (p = 0.010)
    accreditationCoeffBeta2: 12.21,  // Control Variable (p = 0.251)
    roadIndexCoeffBeta3: 7.32,       // Control Variable (p = 0.430)
    hdiCoeffBeta4: 0.61,             // Control Variable (p = 0.177)
    adjustedR2: 0.8001,             // 80.0% Variance Explained
    fStatistic: 34.03,              // p < 0.001
    pValue: 0.0001,
    moranI: 0.4575                  // Spatial Autocorrelation (p < 0.001)
  };

  getModelMetrics(): OLSModelMetricsEntity {
    return this.modelMetrics;
  }

  predictAvailability(input: OLSPredictionInput): {
    predictedAvailabilityY: number;
    pharmacistContributionPct: number;
    recommendation: string;
  } {
    const { pharmacistRatioX1, accreditationRateX2, roadIndexX3, humanDevelopmentIndexX4 } = input;

    // Y = Beta0 + Beta1*X1 + Beta2*X2 + Beta3*X3 + Beta4*X4
    const predictedY =
      this.modelMetrics.interceptBeta0 +
      this.modelMetrics.pharmacistCoeffBeta1 * pharmacistRatioX1 +
      (this.modelMetrics.accreditationCoeffBeta2 * (accreditationRateX2 / 100)) +
      (this.modelMetrics.roadIndexCoeffBeta3 * (roadIndexX3 / 100)) +
      (this.modelMetrics.hdiCoeffBeta4 * (humanDevelopmentIndexX4 / 100));

    const cappedY = Math.min(Math.max(predictedY, 0), 100);
    const pharmacistContrib = Number(((this.modelMetrics.pharmacistCoeffBeta1 * pharmacistRatioX1 / (cappedY || 1)) * 100).toFixed(1));

    let recommendation = 'Kapasitas SDM apoteker optimal.';
    if (pharmacistRatioX1 < 0.5) {
      recommendation = 'PRIORITAS UTAMA: Tingkatkan rasio apoteker ke minimal 0,88 per puskesmas untuk mengeliminasi risiko stockout.';
    } else if (pharmacistRatioX1 < 0.8) {
      recommendation = 'PRIORITAS SEDANG: Alokasikan apoteker tambahan di puskesmas pembantu.';
    }

    return {
      predictedAvailabilityY: Number(cappedY.toFixed(2)),
      pharmacistContributionPct: Math.min(pharmacistContrib, 100),
      recommendation
    };
  }
}
