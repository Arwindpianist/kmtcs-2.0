'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Import consultant images
import BimalRaj from './bimal-raj.jpg'
import Gopala from './gopala-krishnan.jpg'
import Shuras from './shuras-vasu.jpg'
import Muralitharan from './muralitharan.jpg'
import Latha from './latha.jpg'
import Joseph from './joseph.jpg'
import LokeMunKit from './loke.jpg'
import Venkat from './venkat.jpg';
import Rathinam from './rathinam.jpg';
import Prabagaran from './praba.jpg';

interface Consultant {
  id: number;
  name: string;
  role: string;
  image: any;
  shortBio: string;
  fullBio: {
    expertise: string[];
    experience: string[];
    education?: string[];
    certifications?: string[];
    achievements?: string[];
  };
}

const consultants: Consultant[] = [
  { 
    id: 1, 
    name: 'IR BIMAL RAJ', 
    role: 'Principal Consultant',
    image: BimalRaj,
    shortBio: 'Expert in process optimization and industrial engineering with over 25 years of experience.',
    fullBio: {
      expertise: [
        'Manufacturing Excellence',
        'Process Optimization',
        'Industrial Engineering',
        'Quality Management Systems',
        'Lean Six Sigma Implementation'
      ],
      experience: [
        'Led over 200 improvement projects across various industries',
        'Certified Six Sigma Black Belt',
        'Professional Engineer registered with Board of Engineers Malaysia',
        'Over 25 years of experience in manufacturing and process industries'
      ],
      certifications: [
        'Six Sigma Black Belt',
        'Professional Engineer (PE)',
        'Project Management Professional (PMP)'
      ]
    }
  },
  {
    id: 2,
    name: 'GOPALA KRISHNAN V PONNUSAMY',
    role: 'Senior Consultant',
    image: Gopala,
    shortBio: 'Quality management and operational excellence expert with extensive industry experience.',
    fullBio: {
      expertise: [
        'Quality Management Systems',
        'Operational Excellence',
        'Business Process Improvement',
        'Strategic Planning',
        'Change Management'
      ],
      experience: [
        'Over 20 years in quality management and process improvement',
        'Successfully implemented QMS in multiple organizations',
        'Led numerous operational excellence initiatives'
      ],
      certifications: [
        'ISO 9001 Lead Auditor',
        'Certified Quality Manager',
        'Lean Six Sigma Green Belt'
      ]
    }
  },
  {
    id: 3,
    name: 'SHURAS VASU',
    role: 'Lead Consultant',
    image: Shuras,
    shortBio: 'Lean manufacturing and continuous improvement specialist with proven track record.',
    fullBio: {
      expertise: [
        'Lean Manufacturing',
        'Continuous Improvement',
        'Production Management',
        'Supply Chain Optimization',
        'Team Development'
      ],
      experience: [
        'Implemented lean manufacturing systems across multiple facilities',
        'Reduced operational costs by 30% through process improvements',
        'Trained over 1000 professionals in lean methodologies'
      ],
      achievements: [
        'Successfully led plant-wide transformation projects',
        'Developed innovative training programs for lean implementation'
      ]
    }
  },
  {
    id: 4,
    name: 'R. MURALITHARAN R. RAJAMANICKAM',
    role: 'Senior Consultant',
    image: Muralitharan,
    shortBio: 'Project management and process optimization expert with diverse industry experience.',
    fullBio: {
      expertise: [
        'Project Management',
        'Process Optimization',
        'Risk Management',
        'Quality Control',
        'Team Leadership'
      ],
      experience: [
        'Managed large-scale improvement projects across multiple industries',
        'Developed and implemented risk management frameworks',
        'Led cross-functional teams in process improvement initiatives'
      ],
      certifications: [
        'Project Management Professional (PMP)',
        'Risk Management Professional (RMP)',
        'Six Sigma Green Belt'
      ]
    }
  },
  {
    id: 5,
    name: 'LATHA MUTHUSAMY',
    role: 'Senior Consultant',
    image: Latha,
    shortBio: 'Organizational development and change management specialist.',
    fullBio: {
      expertise: [
        'Change Management',
        'Organizational Development',
        'Leadership Development',
        'Training & Development',
        'Performance Management'
      ],
      experience: [
        'Designed and implemented organizational change programs',
        'Developed leadership training curricula',
        'Led major organizational transformation initiatives'
      ],
      achievements: [
        'Successfully transformed organizational cultures',
        'Developed innovative training methodologies'
      ]
    }
  },
  {
    id: 6,
    name: 'DR. JOSEPH CLARENCE EMMANUEL MICHAEL',
    role: 'Technical Consultant',
    image: Joseph,
    shortBio: 'Expert in technical training and engineering solutions with academic background.',
    fullBio: {
      expertise: [
        'Technical Training',
        'Engineering Solutions',
        'Research & Development',
        'Technology Integration',
        'Educational Program Development'
      ],
      experience: [
        'Developed comprehensive technical training programs',
        'Led research projects in engineering solutions',
        'Designed innovative educational methodologies'
      ],
      education: [
        'Ph.D. in Engineering',
        'Masters in Technical Education'
      ]
    }
  },
  {
    id: 7,
    name: 'Ts LOKE MUN KIT',
    role: 'Technology Consultant',
    image: LokeMunKit,
    shortBio: 'Digital transformation and technology integration specialist.',
    fullBio: {
      expertise: [
        'Digital Transformation',
        'Technology Integration',
        'IT Strategy',
        'Systems Architecture',
        'Innovation Management'
      ],
      experience: [
        'Led digital transformation initiatives for multiple organizations',
        'Developed and implemented IT strategies',
        'Managed large-scale technology integration projects'
      ],
      certifications: [
        'Professional Technologist (Ts)',
        'Certified IT Professional',
        'Digital Transformation Specialist'
      ]
    }
  },
  {
    id: 8,
    name: 'DR. N. VENKATARAMAN',
    role: 'Principal Consultant',
    image: Venkat,
    shortBio: 'Specialist in integrated management systems and process safety with over 30 years of experience.',
    fullBio: {
      expertise: [
        'QEHS Management Systems',
        'Process Safety Management',
        'Carbon Inventory and Reduction',
        'Risk Management',
        'Workplace Safety and Health'
      ],
      experience: [
        'Conducted over 500 trainings and assessments on process safety and QEHS topics',
        'Advised on carbon inventory and ESG integration for ST Engineering',
        '20+ years of chemical and manufacturing industry experience'
      ],
      certifications: [
        'Certified Associate in Project Management (CAPM)',
        'ISO Lead Auditor (9001/14001/45001/50001)',
        'Singapore Certified Energy Manager (SCEM)'
      ],
      education: [
        'Ph.D. in Engineering, OUM Malaysia',
        'M.Sc. in Environmental Management, NUS Singapore'
      ]
    }
  },
  {
    id: 9,
    name: 'RATHINAM RENGASAMY',
    role: 'Renewable Energy Consultant',
    image: Rathinam,
    shortBio: 'Pioneer in renewable energy power plant operations with over 30 years of experience.',
    fullBio: {
      expertise: [
        'Renewable Energy Power Plants',
        'Steam and Gas Turbine Operations',
        'Boiler and Plant Maintenance',
        'Training and Competency Development'
      ],
      experience: [
        'Managed 28.4MW biomass power plants in Malaysia',
        'Directed EPCC and O&M for renewable energy projects',
        'Over 13 years at Kuala Langat Power Plant as Shift Charge Engineer'
      ],
      certifications: [
        '1st Grade Steam Engineer (DOSH)',
        '1st Grade Internal Combustion Engineer (DOSH)',
        'Train the Trainer (HRDC-TTT)'
      ],
      education: [
        'Postgraduate in Engineering Management, UTM-Warwick',
        'Degree in Electrical Engineering, Southern Pacific University'
      ]
    }
  },
  {
    id: 10,
    name: 'PRABAGARAN MUNIANDY',
    role: 'Safety and Risk Consultant',
    image: Prabagaran,
    shortBio: 'Expert in occupational safety, risk management, and railway operations with over 30 years of experience.',
    fullBio: {
      expertise: [
        'Occupational Safety and Health',
        'Risk Management',
        'Railway Safety Operations',
        'Emergency Response Planning',
        'Behavior-Based Safety'
      ],
      experience: [
        'Developed OSH training programs for railways and industries',
        'Investigated over 400 incidents and implemented preventive measures',
        'Led safety management for large-scale railway projects'
      ],
      certifications: [
        'Registered Safety and Health Officer (DOSH)',
        'ISO 45001 Lead Auditor',
        'NEBOSH International General Certificate'
      ],
      education: [
        'Master’s Degree in OSH and Risk Management, OUM',
        'Bachelor’s Degree in OSH Management, OUM'
      ]
    }
  }
]

export default function Consultants() {
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null)

  return (
    <div className="min-h-screen bg-baby-blue py-20">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-12">Our Consultants</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {consultants.map((consultant) => (
            <motion.div 
              key={consultant.id} 
              className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => setSelectedConsultant(consultant)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative w-48 h-48 mx-auto mb-4">
                <Image
                  src={consultant.image}
                  alt={consultant.name}
                  fill
                  className="rounded-full object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={consultant.id <= 3}
                />
              </div>
              <h2 className="text-xl font-semibold text-blue-900 text-center mb-2">
                {consultant.name}
              </h2>
              <p className="text-blue-800 text-center mb-4 font-medium">
                {consultant.role}
              </p>
              <p className="text-blue-800 text-center text-sm">
                {consultant.shortBio}
              </p>
              <p className="text-blue-600 text-center text-sm mt-4 hover:underline">
                Click to view full profile
              </p>
            </motion.div>
          ))}
        </div>

        {/* Modal for detailed consultant information */}
        <AnimatePresence>
          {selectedConsultant && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
              onClick={() => setSelectedConsultant(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center mb-6">
                  <div className="relative w-24 h-24 mr-6">
                    <Image
                      src={selectedConsultant.image}
                      alt={selectedConsultant.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-blue-900">{selectedConsultant.name}</h2>
                    <p className="text-blue-800 font-medium">{selectedConsultant.role}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {selectedConsultant.fullBio.expertise && (
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">Areas of Expertise</h3>
                      <ul className="list-disc list-inside text-blue-800">
                        {selectedConsultant.fullBio.expertise.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedConsultant.fullBio.experience && (
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">Experience</h3>
                      <ul className="list-disc list-inside text-blue-800">
                        {selectedConsultant.fullBio.experience.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedConsultant.fullBio.certifications && (
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">Certifications</h3>
                      <ul className="list-disc list-inside text-blue-800">
                        {selectedConsultant.fullBio.certifications.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <button
                  className="mt-8 bg-blue-900 text-white px-6 py-2 rounded-full hover:bg-blue-800 transition-colors"
                  onClick={() => setSelectedConsultant(null)}
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

