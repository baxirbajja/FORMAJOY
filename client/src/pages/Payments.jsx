import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/Payments.css';

export default function Payments() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [studentPayments, setStudentPayments] = useState([]);
  const [teacherPayments, setTeacherPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [studentCourses, setStudentCourses] = useState({});
  const [teacherCourses, setTeacherCourses] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState('students');

  const years = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);
  
  const months = [
    { value: 1, label: 'Janvier' },
    { value: 2, label: 'Février' },
    { value: 3, label: 'Mars' },
    { value: 4, label: 'Avril' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Juin' },
    { value: 7, label: 'Juillet' },
    { value: 8, label: 'Août' },
    { value: 9, label: 'Septembre' },
    { value: 10, label: 'Octobre' },
    { value: 11, label: 'Novembre' },
    { value: 12, label: 'Décembre' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [selectedMonth, selectedYear]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchUsers(),
        fetchPayments(),
        fetchCourses()
      ]);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        const allUsers = response.data.data || [];
        setStudents(allUsers.filter(user => user.role === 'etudiant'));
        setTeachers(allUsers.filter(user => user.role === 'enseignant'));
      }
    } catch (err) {
      toast.error('Erreur lors de la récupération des utilisateurs');
      setError(err.message);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await axios.get('/api/payments', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        const allPayments = response.data.data || [];
        
        const filteredPayments = allPayments.filter(payment => 
          payment.month === selectedMonth && payment.year === selectedYear
        );
        
        setStudentPayments(filteredPayments.filter(payment => payment.recipientModel === 'Student'));
        setTeacherPayments(filteredPayments.filter(payment => payment.recipientModel === 'Teacher'));
      }
    } catch (err) {
      toast.error('Erreur lors de la récupération des paiements');
      setError(err.message);
    }
  };

  const handlePaymentStatusChange = async (paymentId, newStatus) => {
    try {
      const response = await axios.put(`/api/payments/${paymentId}`, 
        { status: newStatus },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        toast.success('Statut de paiement mis à jour avec succès');
        fetchPayments();
      }
    } catch (err) {
      toast.error('Erreur lors de la mise à jour du statut de paiement');
    }
  };

  const createPayment = async (recipientId, recipientModel) => {
    try {
      const paymentData = {
        recipient: recipientId,
        recipientModel: recipientModel,
        year: selectedYear,
        month: selectedMonth,
        status: 'en attente',
        description: `Paiement ${recipientModel === 'Student' ? 'étudiant' : 'enseignant'} - ${months.find(m => m.value === selectedMonth).label} ${selectedYear}`
      };

      const response = await axios.post('/api/payments', paymentData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        toast.success('Paiement créé avec succès');
        fetchPayments();
      }
    } catch (err) {
      toast.error('Erreur lors de la création du paiement');
    }
  };

  const hasPayment = (userId, paymentsArray) => {
    return paymentsArray.some(payment => payment.recipient._id === userId);
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setCourses(response.data.data || []);
        await fetchStudentCourses();
        await fetchTeacherCourses();
      }
    } catch (err) {
      toast.error('Erreur lors de la récupération des cours');
      setError(err.message);
    }
  };

  const fetchStudentCourses = async () => {
    try {
      const studentCoursesMap = {};
      for (const student of students) {
        const response = await axios.get(`/api/courses/student/${student._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.data.success) {
          studentCoursesMap[student._id] = response.data.data || [];
        }
      }
      setStudentCourses(studentCoursesMap);
    } catch (err) {
      toast.error('Erreur lors de la récupération des cours des étudiants');
    }
  };

  const fetchTeacherCourses = async () => {
    try {
      const teacherCoursesMap = {};
      for (const teacher of teachers) {
        const response = await axios.get(`/api/courses/teacher/${teacher._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.data.success) {
          teacherCoursesMap[teacher._id] = response.data.data || [];
        }
      }
      setTeacherCourses(teacherCoursesMap);
    } catch (err) {
      toast.error('Erreur lors de la récupération des cours des enseignants');
    }
  };

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="payments-container">
      <h1>Gestion des Paiements</h1>
      
      <div className="payment-filters">
        <div className="filter-group">
          <label>Mois:</label>
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {months.map(month => (
              <option key={month.value} value={month.value}>{month.label}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Année:</label>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="payment-tabs">
        <button 
          className={`tab-button ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          Paiements des Étudiants
        </button>
        <button 
          className={`tab-button ${activeTab === 'teachers' ? 'active' : ''}`}
          onClick={() => setActiveTab('teachers')}
        >
          Paiements des Enseignants
        </button>
      </div>
      
      {activeTab === 'students' && (
        <div className="payment-section">
          <h2>Paiements des Étudiants - {months.find(m => m.value === selectedMonth).label} {selectedYear}</h2>
          
          {students.length === 0 ? (
            <p>Aucun étudiant trouvé</p>
          ) : (
            <>
              <div className="search-sort-container">
                <input
                  type="text"
                  placeholder="Rechercher un étudiant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <table className="payments-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Email</th>
                    <th>Montant</th>
                    <th>Statut du Paiement</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students
                    .filter(student => 
                      student.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      student.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      student.email.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((student) => {
                    const payment = studentPayments.find(p => p.recipient._id === student._id);
                    
                    return (
                      <tr key={student._id}>
                        <td>{student.nom}</td>
                        <td>{student.prenom}</td>
                        <td>{student.email}</td>
                        <td>
                          {student.montantTotal ? 
                            parseFloat(student.montantTotal).toFixed(2) + ' DH'
                            : studentCourses[student._id] ? 
                              studentCourses[student._id].reduce((total, course) => {
                                return total + (course.prix ? parseFloat(course.prix) : 0);
                              }, 0).toFixed(2) + ' DH'
                              : '0.00 DH'
                          }
                        </td>
                        <td>
                          {payment ? (
                            <span className={`status-badge ${payment.status}`}>
                              {payment.status === 'en attente' && 'En attente'}
                              {payment.status === 'payé' && 'Payé'}
                              {payment.status === 'annulé' && 'Annulé'}
                            </span>
                          ) : (
                            <span className="status-badge not-created">Non créé</span>
                          )}
                        </td>
                        <td>
                          {payment ? (
                            <div className="action-buttons">
                              {payment.status !== 'payé' && (
                                <button 
                                  onClick={() => handlePaymentStatusChange(payment._id, 'payé')}
                                  className="pay-button"
                                >
                                  Marquer comme payé
                                </button>
                              )}
                              {payment.status !== 'en attente' && (
                                <button 
                                  onClick={() => handlePaymentStatusChange(payment._id, 'en attente')}
                                  className="pending-button"
                                >
                                  Marquer comme en attente
                                </button>
                              )}
                              {payment.status !== 'annulé' && (
                                <button 
                                  onClick={() => handlePaymentStatusChange(payment._id, 'annulé')}
                                  className="cancel-button"
                                >
                                  Annuler
                                </button>
                              )}
                            </div>
                          ) : (
                            <button 
                              onClick={() => createPayment(student._id, 'Student')}
                              className="create-button"
                            >
                              Créer un paiement
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
      
      {activeTab === 'teachers' && (
        <div className="payment-section">
          <h2>Paiements des Enseignants - {months.find(m => m.value === selectedMonth).label} {selectedYear}</h2>
          
          {teachers.length === 0 ? (
            <p>Aucun enseignant trouvé</p>
          ) : (
            <table className="payments-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Email</th>
                  <th>Spécialité</th>
                  <th>Salaire</th>
                  <th>Statut du Paiement</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
  {teachers
    .filter(teacher => 
      teacher.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((teacher) => {
      const payment = teacherPayments.find(p => p.recipient._id === teacher._id);
      return (
        <tr key={teacher._id}>
          <td>{teacher.nom}</td>
          <td>{teacher.prenom}</td>
          <td>{teacher.email}</td>
          <td>{teacher.specialite || 'N/A'}</td>
          <td>{teacher.salaire ? parseFloat(teacher.salaire).toFixed(2) + ' DH' : '0.00 DH'}</td>
          <td>
            {payment ? (
              <span className={`status-badge ${payment.status}`}>
                {payment.status === 'en attente' && 'En attente'}
                {payment.status === 'payé' && 'Payé'}
                {payment.status === 'annulé' && 'Annulé'}
              </span>
            ) : (
              <span className="status-badge not-created">Non créé</span>
            )}
          </td>
          <td>
            {payment ? (
              <div className="action-buttons">
                {payment.status !== 'payé' && (
                  <button 
                    onClick={() => handlePaymentStatusChange(payment._id, 'payé')}
                    className="pay-button"
                  >
                    Marquer comme payé
                  </button>
                )}
                {payment.status !== 'en attente' && (
                  <button 
                    onClick={() => handlePaymentStatusChange(payment._id, 'en attente')}
                    className="pending-button"
                  >
                    Marquer comme en attente
                  </button>
                )}
                {payment.status !== 'annulé' && (
                  <button 
                    onClick={() => handlePaymentStatusChange(payment._id, 'annulé')}
                    className="cancel-button"
                  >
                    Annuler
                  </button>
                )}
              </div>
            ) : (
              <button 
                onClick={() => createPayment(teacher._id, 'Teacher')}
                className="create-button"
              >
                Créer un paiement
              </button>
            )}
          </td>
        </tr>
      );
    })}
</tbody>

            </table>
          )}
        </div>
      )}
    </div>
  );
}
