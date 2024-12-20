'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const upcomingTrainings = [
  { id: 1, title: 'Project Management Fundamentals', date: '2023-07-15', duration: '2 days' },
  { id: 2, title: 'Lean Six Sigma Green Belt', date: '2023-07-22', duration: '5 days' },
  { id: 3, title: 'Leadership Skills for Managers', date: '2023-08-05', duration: '3 days' },
  { id: 4, title: 'Data Analysis with Python', date: '2023-08-12', duration: '4 days' },
  { id: 5, title: 'Agile Scrum Master Certification', date: '2023-08-19', duration: '2 days' },
]

export default function TrainingCalendar() {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">Upcoming Trainings</h2>
        <div className="space-y-4">
          {upcomingTrainings.map((training) => (
            <motion.div
              key={training.id}
              className="bg-baby-blue bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg p-6 shadow-lg cursor-pointer"
              onClick={() => setExpandedId(expandedId === training.id ? null : training.id)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-blue-900">{training.title}</h3>
                <span className="text-blue-800">{training.date}</span>
              </div>
              {expandedId === training.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="mt-4"
                >
                  <p className="text-blue-800">Duration: {training.duration}</p>
                  <button className="mt-2 bg-blue-900 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-800 transition duration-300">
                    Register Now
                  </button>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

