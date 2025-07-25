const DashboardModel = require('../models/dashboardModel');

exports.getDashboardSummary = async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  try {
    const base = await DashboardModel.getSummary(userId, role);
    return res.status(200).json(base);
  } catch (err) {
    console.error('❌ Dashboard summary error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getRecentOrders = async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  try {
    const orders = await DashboardModel.getRecentOrders(userId, role);
    return res.status(200).json(orders);
  } catch (err) {
    console.error('❌ Recent orders error:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
