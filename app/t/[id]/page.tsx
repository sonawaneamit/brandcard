import PublicTemplateForm from "@/components/forms/PublicTemplateForm";

export default function PublicFormPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  return <PublicTemplateForm templateId={params.id} />;
}
