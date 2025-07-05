export const useToast = () => {
  return {
    toast: ({ title, description, variant = 'default' }) => {
      alert(`${title}: ${description}`);
    }
  };
};
