const Card = ({ children, className = "" }) => {
    return (
      <div className={`bg-gray-800 p-4 rounded-lg shadow-md ${className}`}>
        {children}
      </div>
    );
  };
  
  const CardContent = ({ children, className = "" }) => {
    return <div className={`p-2 ${className}`}>{children}</div>;
  };
  
  export { Card, CardContent };
  