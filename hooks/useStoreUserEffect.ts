import { useConvexAuth, useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

export function useStoreUserEffect() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  // When this state is set we know the server has stored the user profile
  const [profileId, setProfileId] = useState<Id<"userProfiles"> | null>(null);
  const storeUser = useMutation(api.userProfiles.storeUser);
  
  // Call the `storeUser` mutation function to store the current user profile
  // and return the `Id` value
  useEffect(() => {
    // If the user is not logged in don't do anything
    if (!isAuthenticated) {
      return;
    }
    
    // Store the user profile in the database
    // Recall that `storeUser` gets the user information via the `auth`
    // object on the server. You don't need to pass anything manually here.
    async function createUserProfile() {
      try {
        const id = await storeUser();
        setProfileId(id);
      } catch (error) {
        console.error("Failed to store user profile:", error);
      }
    }
    
    createUserProfile();
    return () => setProfileId(null);
    // Make sure the effect reruns if the user logs in with a different identity
  }, [isAuthenticated, storeUser]);
  
  // Combine the local state with the state from context
  return {
    isLoading: isLoading || (isAuthenticated && profileId === null),
    isAuthenticated: isAuthenticated && profileId !== null,
  };
}
