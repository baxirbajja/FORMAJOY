import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/StudentProfile.css';

export default function StudentProfile() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentDetails();
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

  if (loading) return <div className="loading">Chargement...</div>;
  if (!student) return <div className="error">Étudiant non trouvé</div>;

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
