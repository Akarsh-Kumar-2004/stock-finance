const Progress = ({ value, max = 100, className = "" }) => {
    const percentage = Math.min((value / max) * 100, 100);
  
    return (
      <div className={`w-full bg-gray-700 rounded-full h-4 ${className}`}>
        <div
          className="bg-blue-500 h-4 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };
  
  export default Progress;
  