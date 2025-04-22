import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface BookingChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
    }[];
  };
}

const BookingChart: React.FC<BookingChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    // Function to load Chart.js dynamically
    const loadChartJs = async () => {
      if (!chartRef.current) {
        console.warn('Canvas ref not yet available.');
        return; // Exit early if canvas ref is null
      }
      
      try {
        // Dynamically import Chart.js
        const { Chart, registerables } = await import('chart.js');
        Chart.register(...registerables);
        
        // Clear any existing chart
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
        
        // Create new chart only if canvas element exists
        const ctx = chartRef.current.getContext('2d');
        if (ctx) {
          chartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                  }
                },
                x: {
                  grid: {
                    display: false
                  }
                }
              },
              plugins: {
                legend: {
                  display: true,
                  position: 'top',
                  labels: {
                    usePointStyle: true,
                    boxWidth: 6
                  }
                },
                tooltip: {
                  mode: 'index',
                  intersect: false,
                  padding: 10,
                  cornerRadius: 4,
                  titleFont: {
                    size: 14
                  },
                  bodyFont: {
                    size: 13
                  }
                }
              },
              animation: {
                duration: 2000,
                easing: 'easeOutQuart'
              }
            }
          });
        }
      } catch (error) {
        console.error('Error loading Chart.js or creating chart:', error);
      }
    };
    
    // Use requestAnimationFrame to ensure DOM is ready
    const executeLoadChartJs = () => {
      requestAnimationFrame(() => {
        loadChartJs();
      });
    };
    
    // Execute after a short delay to ensure component is fully mounted
    const timeoutId = setTimeout(executeLoadChartJs, 100);
    
    return () => {
      // Clean up timeout
      clearTimeout(timeoutId);
      
      // Cleanup chart on component unmount
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">Bookings Overview</h3>
        <p className="text-sm text-gray-500">Monthly booking statistics</p>
      </div>
      
      <div className="h-72">
        <canvas ref={chartRef}></canvas>
      </div>
    </motion.div>
  );
};

export default BookingChart;