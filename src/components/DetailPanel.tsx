'use client';

import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Globe } from 'lucide-react';

const DetailPanel = ({ service, onClose }: { service: any; onClose: () => void }) => {
  if (!service) return null;

  return (
    <motion.div
      key={service.id2}
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute ml-[16rem] w-[30rem] p-6 bg-white shadow-lg z-40"
    >
      <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 text-xl font-bold">
        &times;
      </button>
      <h2 className="text-2xl font-bold mb-2">{service.name}</h2>
      <p className="flex items-center text-gray-700 mb-1"><MapPin size={16} className="mr-2" />{service.address}</p>
      <p className="flex items-center text-gray-700 mb-1"><Clock size={16} className="mr-2" />{service.hours}</p>
      <p className="flex items-center text-gray-700 mb-1"><Phone size={16} className="mr-2" />{service.phone}</p>
      <a href={service.website} target="_blank" rel="noreferrer" className="flex text-blue-600 mb-4">
        <Globe size={16} className="mr-2" />Website
      </a>
      <h3 className="text-lg font-medium">Amenities</h3>
      <div className="grid grid-cols-3 gap-2 mt-2">
        {service.amenities.map((a: string) => (
          <span key={a} className="bg-gray-200 rounded px-2 py-1 text-sm text-gray-800">{a}</span>
        ))}
      </div>
    </motion.div>
  );
};

export default DetailPanel;
