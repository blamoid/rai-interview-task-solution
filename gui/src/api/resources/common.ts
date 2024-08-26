export interface DocumentTemplateBase {
  name: string;
  uploaded_at: string;
  template_filename: string;
  template_file_type: string;
}

export interface DocumentTemplateOut extends DocumentTemplateBase {
  id: number;
  created_at: string;
}
