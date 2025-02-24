import { CircularProgress } from '@mui/material';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-[400px]">
      <CircularProgress size={40} thickness={4} />
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  );
};

export default LoadingSpinner; 