// Mock auth hook for demo purposes
export function useAuth() {
  // Suppress wallet provider errors globally
  if (typeof window !== 'undefined') {
    // Override console.error to filter out wallet provider conflicts
    const originalError = console.error;
    console.error = (...args) => {
      const message = args.join(' ');
      if (message.includes('StacksProvider') || 
          message.includes('Could not establish connection') ||
          message.includes('Failed setting Xverse') ||
          message.includes('Cannot redefine property')) {
        // Suppress these specific wallet provider errors
        return;
      }
      originalError.apply(console, args);
    };

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason?.message?.includes('StacksProvider') ||
          event.reason?.message?.includes('Could not establish connection')) {
        event.preventDefault();
        console.warn('Wallet provider conflict suppressed (normal with multiple extensions)');
      }
    });
  }

  return {
    isSignedIn: true,
    userData: null,
    userSession: null,
    address: 'ST1PGECE9RYR303FHZ24BJVYY3MG63FC3NHBSR6X4',
  }
}
