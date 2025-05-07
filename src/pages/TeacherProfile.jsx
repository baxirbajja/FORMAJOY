import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/TeacherProfile.css';

export default function TeacherProfile() {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeacherDetails();
  }, [id]);

  const fetchTeacherDetails = async () => {
    try {
      const [teacherResponse, coursesResponse] = await Promise.all([
        axios.get(`/api/users/${id}`),
        axios.get(`/api/courses/teacher/${id}`)
      ]);

      setTeacher(teacherResponse.data.data);
      setCourses(coursesResponse.data.data);
      setLoading(false);
    } catch (error) {
      toast.error("Échec du chargement des détails de l'enseignant");
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Chargement...</div>;
  if (!teacher) return <div className="error">Enseignant non trouvé</div>;

  return (
    <div className="teacher-profile">
      <div className="teacher-header">
        <h2>{teacher.nom} {teacher.prenom}</h2>
      </div>

      <div className="teacher-content">
        <div className="teacher-details">
          <p><strong>Email:</strong> {teacher.email}</p>
          <p><strong>Téléphone:</strong> {teacher.telephone || 'Non spécifié'}</p>
          <p><strong>Adresse:</strong> {teacher.adresse || 'Non spécifiée'}</p>
          <p><strong>Spécialité:</strong> {teacher.specialite || 'Non spécifiée'}</p>
          <p><strong>Profit (%):</strong> {teacher.pourcentageProfit || 0}%</p>
          <p><strong>Sessions/Semaine:</strong> {teacher.sessionsParSemaine || 0}</p>
          <p><strong>Statut:</strong> {teacher.statut || 'Actif'}</p>
          <p><strong>Disponibilités:</strong></p>
          {teacher.heuresDisponibles?.length > 0 ? (
            <ul>
              {teacher.heuresDisponibles.map((horaire, idx) => (
                <li key={idx}>{horaire.jour}: {horaire.debut} - {horaire.fin}</li>
              ))}
            </ul>
          ) : (
            <p>Aucune disponibilité spécifiée</p>
          )}
        </div>

        <div className="teacher-courses">
          <h3>Cours Enseignés</h3>
          {courses.length > 0 ? (
            courses.map(course => (
              <div key={course._id} className="course-card">
                <h4>{course.nom}</h4>
                <p>{course.description}</p>
                <p><strong>Durée:</strong> {course.dureeHeures} heures</p>
                <p><strong>Salle:</strong> {course.salle}</p>
                <p><strong>Période:</strong> {new Date(course.dateDebut).toLocaleDateString()} - {new Date(course.dateFin).toLocaleDateString()}</p>
                <div className="course-schedule">
                  <strong>Horaires:</strong>
                  <ul>
                    {course.horaire.map((horaire, index) => (
                      <li key={index}>{horaire.jour}: {horaire.heureDebut} - {horaire.heureFin}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <p>Aucun cours assigné à cet enseignant</p>
          )}
        </div>
      </div>
    </div>
  );
}
