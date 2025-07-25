import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import './dashboard.css';

interface Summary {
  ventes_mois: number;
  commandes: number;
  produits: number;
}

interface Order {
  commande_id: number;
  prenom: string;
  nom: string;
  dateCreer: string;
  montant: number;
  status: string;
}

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<Summary>({
    ventes_mois: 0,
    commandes: 0,
    produits: 0,
  });

  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios
      .get('http://localhost:5000/api/dashboard/summary', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSummary(res.data));

    axios
      .get('http://localhost:5000/api/dashboard/recent-orders', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data));
  }, []);

  return (
    <DashboardLayout>
      <div className="dashboard-header">
        <h1>Tableau de bord</h1>
      </div>

      <div className="dashboard-cards">
        <div className="card">
          <div className="card-value">{summary.ventes_mois.toFixed(2)} $</div>
          <div className="card-label">Ventes du mois</div>
        </div>
        <div className="card">
          <div className="card-value">{summary.commandes}</div>
          <div className="card-label">Commandes</div>
        </div>
        <div className="card">
          <div className="card-value">{summary.produits}</div>
          <div className="card-label">Produits en ligne</div>
        </div>
      </div>

      <div className="chart-box">
        <h3>Évaluation des ventes (30 jours)</h3>
        {/* Chart goes here */}
      </div>

      <div className="orders-box">
        <h3>Commandes récentes</h3>
        <table>
          <thead>
            <tr>
              <th>ID Commande</th>
              <th>Client</th>
              <th>Date</th>
              <th>Montant</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.commande_id}>
                <td>#{order.commande_id}</td>
                <td>
                  {order.prenom} {order.nom}
                </td>
                <td>{new Date(order.dateCreer).toLocaleDateString('fr-FR')}</td>
                <td>{order.montant.toFixed(2)} $</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
