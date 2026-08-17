import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { KMeansClusteringService } from '../services/kmeans-clustering.service';
import { OLSRegressionService } from '../services/ols-regression.service';
import { OLSPredictionInput } from '../schemas/cluster.schema';

export class ClusterController {
  constructor(
    private kmeansService: KMeansClusteringService,
    private olsService: OLSRegressionService
  ) {}

  getClusterProfiles = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const profiles = await this.kmeansService.executeClustering();
      res.status(StatusCodes.OK).json({
        status: 'success',
        data: profiles
      });
    } catch (error) {
      next(error);
    }
  };

  getOLSMetrics = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const metrics = this.olsService.getModelMetrics();
      res.status(StatusCodes.OK).json({
        status: 'success',
        data: metrics
      });
    } catch (error) {
      next(error);
    }
  };

  predictAvailability = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input: OLSPredictionInput = req.body;
      const prediction = this.olsService.predictAvailability(input);

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: prediction
      });
    } catch (error) {
      next(error);
    }
  };
}
