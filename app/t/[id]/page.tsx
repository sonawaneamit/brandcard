import PublicTemplateForm from "@/components/forms/PublicTemplateForm";

export default async function PublicFormPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  return <PublicTemplateForm templateId={id} />;
}