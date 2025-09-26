// Global error handler for wallet provider conflicts
export function setupErrorHandling() {
  if (typeof window === 'undefined') return;

  // Suppress wallet provider errors
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    const message = args.join(' ');
    
    // List of wallet provider error patterns to suppress
    const walletErrorPatterns = [
      'StacksProvider',
      'Could not establish connection',
      'Failed setting Xverse',
      'Cannot redefine property',
      'Another wallet may have already set it',
      'Receiving end does not exist'
    ];

    // Check if this is a wallet provider error
    const isWalletError = walletErrorPatterns.some(pattern => 
      message.toLowerCase().includes(pattern.toLowerCase())
    );

    if (isWalletError) {
      // Suppress wallet provider errors silently
      return;
    }

    // Log other errors normally
    originalConsoleError.apply(console, args);
  };

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const message = event.reason?.message || event.reason?.toString() || '';
    
    const walletErrorPatterns = [
      'stacksprovider',
      'could not establish connection',
      'failed setting xverse',
      'cannot redefine property'
    ];

    const isWalletError = walletErrorPatterns.some(pattern => 
      message.toLowerCase().includes(pattern)
    );

    if (isWalletError) {
      event.preventDefault();
      console.warn('Wallet provider conflict suppressed (normal with multiple extensions)');
    }
  });

  // Handle general errors
  window.addEventListener('error', (event) => {
    const message = event.message || '';
    
    const walletErrorPatterns = [
      'stacksprovider',
      'could not establish connection',
      'failed setting xverse',
      'cannot redefine property'
    ];

    const isWalletError = walletErrorPatterns.some(pattern => 
      message.toLowerCase().includes(pattern)
    );

    if (isWalletError) {
      event.preventDefault();
      console.warn('Wallet provider conflict suppressed (normal with multiple extensions)');
    }
  });
}
