export const dynamic = "force-dynamic";

import QuillEditor from "@/components/quill-editor/quill-editor";
import { getWorkspaceDetails } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import React from "react";

const WorkspacePage = async ({ params}: {params: { workspaceId: string }}) => {
  const workspaceId=params?.workspaceId
  const { data, error } = await getWorkspaceDetails(workspaceId);
  if (error || !data.length) redirect("/dashboard");

  return (
    <div className="relative">
      <QuillEditor
        dirType="workspace"
        fileId={params.workspaceId}
        dirDetails={data[0] || {}}
      />
    </div>
  );
};

export default WorkspacePage;
