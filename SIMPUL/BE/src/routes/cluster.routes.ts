import { Router } from 'express';
import { ClusterRepository } from '../repositories/cluster.repository';
import { KMeansClusteringService } from '../services/kmeans-clustering.service';
import { OLSRegressionService } from '../services/ols-regression.service';
import { ClusterController } from '../controllers/cluster.controller';
import { validateSchema } from '../middleware/zod-validation.middleware';
import { OLSPredictionInputSchema } from '../schemas/cluster.schema';

const router = Router();

// Dependency Injection Setup
const clusterRepository = new ClusterRepository();
const kmeansService = new KMeansClusteringService(clusterRepository);
const olsService = new OLSRegressionService();
const clusterController = new ClusterController(kmeansService, olsService);

router.get('/profiles', clusterController.getClusterProfiles);
router.get('/provinces', clusterController.getProvinces);
router.get('/clusters', clusterController.getProvinces);
router.get('/ols-metrics', clusterController.getOLSMetrics);
router.get('/visuals/ols-chart.svg', clusterController.getOLSSvgChart);
router.get('/visuals/discrepancy-report.svg', clusterController.getDiscrepancySvgReport);
router.post('/predict', validateSchema(OLSPredictionInputSchema), clusterController.predictAvailability);

export default router;
