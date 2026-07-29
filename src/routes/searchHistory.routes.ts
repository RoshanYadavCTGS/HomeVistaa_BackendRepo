import { Router } from 'express';
import * as searchHistoryController from '../controllers/searchHistory.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All search history routes require authentication
router.use(authenticate);

// Dashboard Summary
router.get('/summary', searchHistoryController.getDashboardSummaryController);

// Recommendations & Recently Viewed
router.get('/recommendations', searchHistoryController.getRecommendationsController);
router.get('/recently-viewed', searchHistoryController.getRecentlyViewedController);

// Saved Searches
router.post('/saved', searchHistoryController.createSavedSearchController);
router.get('/saved', searchHistoryController.getSavedSearchesController);
router.put('/saved/:id', searchHistoryController.updateSavedSearchController);
router.delete('/saved/:id', searchHistoryController.deleteSavedSearchController);

// Search History
router.post('/', searchHistoryController.saveSearch);
router.get('/', searchHistoryController.getMySearchHistory);
router.delete('/', searchHistoryController.clearAllSearches);
router.delete('/:id', searchHistoryController.deleteSearch);

export default router;
