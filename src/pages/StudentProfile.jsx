import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/StudentProfile.css';

export default function StudentProfile() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nom');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchStudentDetails();
    fetchAvailableCourses();
  }, [id]);

  const fetchStudentDetails = async () => {
    try {
      const [studentRes, coursesRes] = await Promise.all([
        axios.get(`/api/users/${id}`),
        axios.get(`/api/courses/student/${id}`)
      ]);

      setStudent(studentRes.data.data);
      setCourses(coursesRes.data.data);
      setLoading(false);
    } catch (error) {
      toast.error("Échec du chargement des détails de l'étudiant");
      setLoading(false);
    }
  };

  const fetchAvailableCourses = async () => {
    try {
      const response = await axios.get('/api/courses');
      setAvailableCourses(response.data.data);
    } catch (error) {
      toast.error("Échec du chargement des cours disponibles");
    }
  };

  const handleEnrollment = async (courseId) => {
    setEnrolling(true);
    try {
      await axios.post(`/api/students/${id}/enroll/${courseId}`);
      toast.success("Inscription au cours réussie");
      fetchStudentDetails(); // Rafraîchir les détails de l'étudiant
      setShowCourseModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Échec de l'inscription au cours");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <div className="loading">Chargement...</div>;
  if (!student) return <div className="error">Étudiant non trouvé</div>;

  // Filtrer et trier les cours disponibles
  const filteredAndSortedCourses = availableCourses
    .filter(course => 
      !courses.some(enrolledCourse => enrolledCourse._id === course._id) &&
      (course.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       course.description?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'nom') {
        return sortOrder === 'asc' 
          ? a.nom?.localeCompare(b.nom || '') 
          : b.nom?.localeCompare(a.nom || '');
      } else if (sortBy === 'prix') {
        return sortOrder === 'asc' 
          ? (a.prix || 0) - (b.prix || 0) 
          : (b.prix || 0) - (a.prix || 0);
      }
      return 0;
    });

  return (
    <div className="student-profile">
      <div className="student-header">
        <h2>{student.nom} {student.prenom}</h2>
      </div>

      <div className="student-content">
        <div className="student-details">
          <p><strong>Email:</strong> {student.email}</p>
          <p><strong>Téléphone:</strong> {student.telephone || 'Non spécifié'}</p>
          <p><strong>Date de Naissance:</strong> {student.dateNaissance ? new Date(student.dateNaissance).toLocaleDateString() : 'Non spécifiée'}</p>
          <p><strong>Adresse:</strong> {student.adresse || 'Non spécifiée'}</p>
          <p><strong>Statut:</strong> {student.statut || 'Actif'}</p>
        </div>

        <div className="course-enrollment">
          <div className="enrollment-header">
            <h3>Inscrire à un Nouveau Cours</h3>
            <button 
              onClick={() => setShowCourseModal(true)}
              className="add-course-btn"
            >
              Ajouter un Cours
            </button>
          </div>

          {showCourseModal && (
            <div className="course-modal">
              <div className="modal-content">
                <div className="modal-header">
                  <h4>Sélectionner un Cours</h4>
                  <button onClick={() => setShowCourseModal(false)} className="close-btn">
                    ×
                  </button>
                </div>

                <div className="search-sort-section">
                  <input
                    type="text"
                    placeholder="Rechercher un cours..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  
                  <div className="sort-controls">
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="sort-select"
                    >
                      <option value="nom">Trier par nom</option>
                      <option value="prix">Trier par prix</option>
                    </select>
                    
                    <button 
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="sort-order-btn"
                    >
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                  </div>
                </div>

                <div className="courses-list">
                  {filteredAndSortedCourses.map(course => (
                    <div key={course._id} className="course-item">
                      <div className="course-info">
                        <h5>{course.nom}</h5>
                        <p>{course.description}</p>
                        <p><strong>Prix:</strong> {course.prix}€</p>
                        <p><strong>Durée:</strong> {course.dureeHeures} heures</p>
                      </div>
                      <button
                        onClick={() => handleEnrollment(course._id)}
                        disabled={enrolling}
                        className="enroll-btn"
                      >
                        {enrolling ? 'Inscription...' : 'Inscrire'}
                      </button>
                    </div>
                  ))}
                  {filteredAndSortedCourses.length === 0 && (
                    <p className="no-results">Aucun cours disponible</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="student-courses">
          <h3>Cours Inscrits</h3>
          {courses.length > 0 ? (
            courses.map(course => (
              <div key={course._id} className="course-card">
                <h4>{course.nom}</h4>
                <p>{course.description}</p>
                <p><strong>Prix:</strong> {course.prix}€</p>
                <p><strong>Durée:</strong> {course.dureeHeures} heures</p>
                <p><strong>Salle:</strong> {course.salle}</p>
                <p><strong>Période:</strong> {new Date(course.dateDebut).toLocaleDateString()} - {new Date(course.dateFin).toLocaleDateString()}</p>

                {course.enseignant && (
                  <div className="teacher-info">
                    <strong>Enseignant:</strong>
                    <p>{course.enseignant.nom} {course.enseignant.prenom}</p>
                  </div>
                )}

                <div className="course-schedule">
                  <strong>Horaires:</strong>
                  <ul>
                    {course.horaire.map((horaire, idx) => (
                      <li key={idx}>{horaire.jour}: {horaire.heureDebut} - {horaire.heureFin}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <p>Aucun cours inscrit</p>
          )}
        </div>
      </div>
    </div>
  );
}
