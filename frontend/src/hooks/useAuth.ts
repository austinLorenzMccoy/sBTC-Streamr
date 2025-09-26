import { useAuth as useStacksAuth } from '@stacks/connect-react'

export function useAuth() {
  const { isSignedIn, userData, userSession } = useStacksAuth()
  
  return {
    isSignedIn,
    userData,
    userSession,
    address: userData?.profile?.stxAddress?.testnet || userData?.profile?.stxAddress?.mainnet,
  }
}
