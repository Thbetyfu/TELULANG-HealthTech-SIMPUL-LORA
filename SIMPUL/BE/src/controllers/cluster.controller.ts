import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { KMeansClusteringService } from '../services/kmeans-clustering.service';
import { OLSRegressionService } from '../services/ols-regression.service';
import { ChartRendererService } from '../services/chart-renderer.service';
import { OLSPredictionInput } from '../schemas/cluster.schema';

export class ClusterController {
  private chartRenderer: ChartRendererService;

  constructor(
    private kmeansService: KMeansClusteringService,
    private olsService: OLSRegressionService
  ) {
    this.chartRenderer = new ChartRendererService(olsService, kmeansService);
  }

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

  getProvinces = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const provinces = await this.kmeansService.listProvinces();
      res.status(StatusCodes.OK).json({
        status: 'success',
        count: provinces.length,
        data: provinces
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Serves Server-Side Generated OLS Regression SVG Chart directly.
   */
  getOLSSvgChart = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const svgContent = this.chartRenderer.generateOLSRegressionSVG();
      res.setHeader('Content-Type', 'image/svg+xml');
      res.status(StatusCodes.OK).send(svgContent);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Serves Server-Side Generated Discrepancy Audit SVG Report directly.
   */
  getDiscrepancySvgReport = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const svgContent = this.chartRenderer.generateDiscrepancyReportSVG();
      res.setHeader('Content-Type', 'image/svg+xml');
      res.status(StatusCodes.OK).send(svgContent);
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
