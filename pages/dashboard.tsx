import React, { useEffect, useState } from 'react'
import styles from '../styles/dashboard.module.css'
import { useAuth } from '../context/AuthContext'
import { checkAdmin } from '../config/firebase'
import AdminDashboard from "../components/AdminDashboard"
import StudentDashboard from '../components/StudentDashboard'

const Dashboard = () => {
  //delay
  const [showDashboard, setShowDashboard] = useState(false);
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Simulate a delay of 1 second before showing the dashboard
    const timer = setTimeout(() => {
      setShowDashboard(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function fetchAdminStatus() {
      if (!user?.uid) return;
      const isAdmin = await checkAdmin(user.uid)
      setIsAdmin(isAdmin)
    }
    if (user?.uid) {
      fetchAdminStatus()
    }
  }, [user])

  return (
    <>
      {showDashboard && (
        isAdmin ? <AdminDashboard /> : <StudentDashboard />
      )}
    </>
  )
}

export default Dashboard
