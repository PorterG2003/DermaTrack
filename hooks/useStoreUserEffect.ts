import { useConvexAuth, useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

export function useStoreUserEffect() {
  console.log('🔍 useStoreUserEffect: Hook called');
  
  const { isLoading, isAuthenticated } = useConvexAuth();
  // When this state is set we know the server has stored the user profile
  const [profileId, setProfileId] = useState<Id<"userProfiles"> | null>(null);
  const storeUser = useMutation(api.userProfiles.storeUser);
  
  console.log('📊 useStoreUserEffect: Initial state', {
    isLoading,
    isAuthenticated,
    profileId,
    hasStoreUser: !!storeUser
  });
  
  // Call the `storeUser` mutation function to store the current user profile
  // and return the `Id` value
  useEffect(() => {
    console.log('🔄 useStoreUserEffect: useEffect triggered', {
      isAuthenticated,
      profileId
    });
    
    // If the user is not logged in don't do anything
    if (!isAuthenticated) {
      console.log('❌ useStoreUserEffect: User not authenticated, returning early');
      return;
    }
    
    // Store the user profile in the database
    // Recall that `storeUser` gets the user information via the `auth`
    // object on the server. You don't need to pass anything manually here.
    async function createUserProfile() {
      console.log('👤 useStoreUserEffect: Creating user profile');
      try {
        const id = await storeUser();
        console.log('✅ useStoreUserEffect: User profile stored successfully', { id });
        setProfileId(id);
      } catch (error) {
        console.error("❌ useStoreUserEffect: Failed to store user profile:", error);
      }
    }
    
    createUserProfile();
    return () => {
      console.log('🧹 useStoreUserEffect: Cleanup function called');
      setProfileId(null);
    };
    // Make sure the effect reruns if the user logs in with a different identity
  }, [isAuthenticated, storeUser]);
  
  // Combine the local state with the state from context
  const result = {
    isLoading: isLoading || (isAuthenticated && profileId === null),
    isAuthenticated: isAuthenticated && profileId !== null,
  };
  
  console.log('✅ useStoreUserEffect: Returning result', result);
  
  return result;
}
