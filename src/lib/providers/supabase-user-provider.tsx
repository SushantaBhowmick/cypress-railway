"use client";

import { AuthUser } from "@supabase/supabase-js";
import { Subscription } from "../supabase/supabase-types";
import { createContext, useContext, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { getUserSubscriptionStatus } from "../supabase/queries";
import { useToast } from "@/hooks/use-toast";

type SupabaseUserContextType = {
  user: AuthUser | null;
  subscription: Subscription | null;
};

const SupabaseUserContext = createContext<SupabaseUserContextType>({
  user: null,
  subscription: null,
});

export const useSupabaseUser = () => {
  return useContext(SupabaseUserContext);
};

interface SupabaseUserProviderProps {
  children: React.ReactNode;
}

export const SupabaseUserProvider: React.FC<SupabaseUserProviderProps> = ({
  children,
}) => {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const { toast } = useToast();

  //fetch the user details
  //subscription

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data, error } = await getUserSubscriptionStatus(user.id);
        if (data) setSubscription(data);
        if (error) {
          console.log("Subscription check Error :", error);
          toast({
            title: "Unexpected Error",
            description:
              "Oppse! An unexpected error happened. Try again later.",
          });
        }
      }
    };
    getUser()
  }, [supabase,toast]);

  return (
    <SupabaseUserContext.Provider value={{user,subscription}}>
        {children}
    </SupabaseUserContext.Provider>
  )
};
