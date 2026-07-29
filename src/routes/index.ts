import { Router } from 'express';
import authRoutes from './auth.routes';
import propertiesRoutes from './properties.routes';
import listingsRoutes from './listings.routes';
import leadsRoutes from './leads.routes';
import inquiriesRoutes from './inquiries.routes';
import favoritesRoutes from './favorites.routes';
import transactionsRoutes from './transactions.routes';
import blogsRoutes from './blogs.routes';
import interiorsRoutes from './interiors.routes';
import professionalsRoutes from './professionals.routes';
import serviceRequestsRoutes from './service-requests.routes';
import uploadsRoutes from './uploads.routes';
import propertyHistoryRoutes from './property-history.routes';
import searchHistoryRoutes from './searchHistory.routes';
import alertsRoutes from './alerts.routes';
import membershipRoutes from './membership.routes';
import userActivityRoutes from './user-activity.routes';
import referralsRoutes from './referrals.routes';
import couponsRoutes from './coupons.routes';
import profileRoutes from './profile.routes';
import loansRoutes from './loans.routes';

const router = Router();

// ─── API Health Check ─────────────────────────────────────────────────────────
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'HomeVistaa API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// ─── Route Mounts ─────────────────────────────────────────────────────────────
router.use('/auth', authRoutes);
router.use('/properties', propertiesRoutes);
router.use('/listings', listingsRoutes);
router.use('/leads', leadsRoutes);
router.use('/inquiries', inquiriesRoutes);
router.use('/favorites', favoritesRoutes);
router.use('/transactions', transactionsRoutes);
router.use('/blogs', blogsRoutes);
router.use('/interiors', interiorsRoutes);
router.use('/professionals', professionalsRoutes);
router.use('/service-requests', serviceRequestsRoutes);
router.use('/uploads', uploadsRoutes);
router.use('/property-history', propertyHistoryRoutes);
router.use('/search-history', searchHistoryRoutes);
router.use('/alerts', alertsRoutes);
router.use('/membership', membershipRoutes);
router.use('/user-activity', userActivityRoutes);
router.use('/referrals', referralsRoutes);
router.use('/coupons', couponsRoutes);
router.use('/profile', profileRoutes);
router.use('/loans', loansRoutes);

export default router;
