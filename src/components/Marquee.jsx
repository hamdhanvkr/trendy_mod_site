// src/components/Marquee.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Marquee = () => {
  const marqueeItems = [
    { text: "NO COD", bold: true },
    { text: "Delivery in 2-3 Working Days" },
    { text: "Free Shipping On Purchase above ₹1000!" }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-red-600 to-orange-600 text-white py-3">
      <motion.div
        animate={{ x: [0, -1500] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="whitespace-nowrap flex items-center"
      >
        {[...Array(2)].map((_, copyIndex) => (
          <div key={copyIndex} className="inline-flex items-center gap-4 mx-4">
            {marqueeItems.map((item, idx) => (
              <React.Fragment key={idx}>
                <span className={item.bold ? "font-semibold" : ""}>{item.text}</span>
                {idx < marqueeItems.length - 1 && <span className="mx-1">|</span>}
              </React.Fragment>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Marquee;