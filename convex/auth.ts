import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google],
  callbacks: {
    async redirect({ redirectTo }) {
      if (
        redirectTo.startsWith("exp://") ||
        redirectTo.startsWith("http://localhost:8081") ||
        redirectTo.startsWith("http://192.168.4.137:8081") ||
        redirectTo.startsWith("https://careful-pelican-865.clerk.site")
      ) {
        return redirectTo;
      }
      throw new Error(`Invalid redirectTo URI ${redirectTo}`);
    },
  },
});
