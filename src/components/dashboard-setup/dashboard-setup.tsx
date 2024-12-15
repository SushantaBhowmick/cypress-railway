"use client";

import { AuthUser } from "@supabase/supabase-js";
import React, { useState } from "react";
import { SubmitHandler } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import EmojiPicker from "../global/emoji-Picker";
import { Input } from "../ui/input";
import { FieldValues, useForm } from "react-hook-form";
import { Subscription, workspace } from "@/lib/supabase/supabase-types";
import { CreateWorkspaceFormSchema } from "@/lib/types";
import { z } from "zod";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import Loader from "../global/Loader";
import { v4 } from "uuid";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { createWorkspace } from "@/lib/supabase/queries";
import { useAppState } from "@/lib/providers/state-provider";
import { useRouter } from "next/navigation";

interface DashboardSetupProps {
  user: AuthUser;
  subscription: Subscription | null;
}

const DashboardSetup: React.FC<DashboardSetupProps> = ({
  subscription,
  user,
}) => {
console.log("gotit")
console.log("user",user)
  const [selectedEmoji, setSelectedEmoji] = useState("💼");
  const supabase = createClientComponentClient();
  const {dispatch} = useAppState();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting: isLoading, errors },
  } = useForm<z.infer<typeof CreateWorkspaceFormSchema>>({
    mode: "onChange",
    defaultValues: {
      logo: "",
      workspaceName: "",
    },
  });

  const onSubmit: SubmitHandler<
    z.infer<typeof CreateWorkspaceFormSchema>
  > = async (value) => {
    const file = value.logo?.[0];
    let filePath = null;
    const workspaceUUID = v4();

    if (file) {
      const fileUUID = v4();
      try {
        const { data, error } = await supabase.storage
          .from("workspace-logos")
          .upload(`workspaceLogo.${workspaceUUID}`, file, {
            cacheControl: "3600",
            upsert: true,
          });

        if (error) throw new Error("");
        filePath = data.path;
      } catch (error) {
        console.log("Error", error);
      }
    }

    try {
      const newWorkspace: workspace = {
        data: null,
        createdAt: new Date().toISOString(),
        iconId: selectedEmoji,
        id: workspaceUUID,
        inTrash: "",
        title: value.workspaceName,
        workspaceOwner: user.id,
        logo: filePath || null,
        bannerUrl: "",
      };

      const {data,error:createError}= await createWorkspace(newWorkspace);
      if(createError){
        throw new Error()
      }
      dispatch({
        type:'ADD_WORKSPACE',
        payload:{...newWorkspace,folders:[]}
      });
      

      router.replace(`/dashboard/${newWorkspace.id}`)
    } catch (error) {
      console.log("Error", error);
    } finally {
      reset();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create A Workspace</CardTitle>
        <CardDescription>
          Lets create a private workspace to get you started.You can add
          collaborators later from the workspace settings tab.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action="" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="text-5xl">
                <EmojiPicker getValue={(emoji) => setSelectedEmoji(emoji)}>
                  {selectedEmoji}
                </EmojiPicker>
              </div>
              <div className="w-full">
                <Label
                  htmlFor="workspaceName"
                  className="text-sm text-muted-foreground"
                >
                  Name
                </Label>
                <Input
                  id="workspaceName"
                  placeholder="Workspace Name"
                  type="text"
                  disabled={isLoading}
                  {...register("workspaceName", {
                    required: "Workspace name is required",
                  })}
                />
                <small>{errors?.workspaceName?.message?.toString()}</small>
              </div>
            </div>
            <div className="w-full">
              <Label htmlFor="logo" className="text-sm text-muted-foreground">
                Workspace Logo
              </Label>
              <Input
                id="logo"
                placeholder="Workspace Logo"
                accept="image/*"
                type="file"
                // disabled={isLoading || subscription?.status !== "active"}
                {...register("logo", {
                  required: "Workspace logo is required",
                })}
              />
              <small>{errors?.logo?.message?.toString()}</small>

              {subscription?.status !== "active" && (
                <small
                  className="
                 text-muted-foreground
                 block
             "
                >
                  To customize your workspace, you need to be on a Pro Plan
                </small>
              )}
            </div>
            <div className="self-end">
              <Button disabled={isLoading} type="submit">
                {!isLoading ? "Create Workspace" : <Loader />}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DashboardSetup;
