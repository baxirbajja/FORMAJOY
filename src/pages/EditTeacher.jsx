import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/Dashboard.css';

export default function EditTeacher() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [editingTeacher, setEditingTeacher] = useState(null);

  useEffect(() => {
    fetchTeacher();
  }, [id]);

  const fetchTeacher = async () => {
    try {
      const response = await axios.get(`/api/users/${id}`);
      setEditingTeacher({
        ...response.data.data,
        password: ''
      });
    } catch (error) {
      toast.error('Échec du chargement des informations de l\'enseignant');
      navigate('/dashboard/teachers');
    }
  };

  const handleEditTeacher = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/users/${id}`, editingTeacher);
      toast.success('Enseignant mis à jour avec succès');
      navigate('/dashboard/teachers');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Échec de la mise à jour de l\'enseignant');
    }
  };

  if (user?.role !== 'admin') {
    return <div>Accès refusé</div>;
  }

  if (!editingTeacher) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>Modifier l'Enseignant</h2>
      
      <div className="dashboard-content">
        <div className="edit-user-form">
          <form onSubmit={handleEditTeacher}>
            <div className="form-group">
              <label>Nom:</label>
              <input
                type="text"
                name="nom"
                value={editingTeacher.nom}
                onChange={(e) => setEditingTeacher({...editingTeacher, nom: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Prénom:</label>
              <input
                type="text"
                name="prenom"
                value={editingTeacher.prenom}
                onChange={(e) => setEditingTeacher({...editingTeacher, prenom: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={editingTeacher.email}
                onChange={(e) => setEditingTeacher({...editingTeacher, email: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Spécialité:</label>
              <input
                type="text"
                name="specialite"
                value={editingTeacher.specialite || ''}
                onChange={(e) => setEditingTeacher({...editingTeacher, specialite: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label>Pourcentage de Profit (%):</label>
              <input
                type="number"
                name="pourcentageProfit"
                value={editingTeacher.pourcentageProfit || 0}
                onChange={(e) => setEditingTeacher({...editingTeacher, pourcentageProfit: Number(e.target.value)})}
                min="0"
                max="100"
                required
              />
            </div>





            <div className="form-group">
              <label>Salaire (DH):</label>
              <input
                type="number"
                name="salaire"
                value={editingTeacher.salaire || 0}
                onChange={(e) => setEditingTeacher({...editingTeacher, salaire: Number(e.target.value)})}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Sessions par Semaine:</label>
              <input
                type="number"
                name="sessionsParSemaine"
                value={editingTeacher.sessionsParSemaine || 0}
                onChange={(e) => setEditingTeacher({...editingTeacher, sessionsParSemaine: Number(e.target.value)})}
                min="0"
                required
              />
            </div>



            <div className="form-group">
              <label>Statut:</label>
              <select
                name="statut"
                value={editingTeacher.statut || 'actif'}
                onChange={(e) => setEditingTeacher({...editingTeacher, statut: e.target.value})}
                required
              >
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
              </select>
            </div>
            
            <div className="form-buttons">
              <button type="submit" className="btn-primary">Enregistrer</button>
              <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard/teachers')}>Annuler</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}