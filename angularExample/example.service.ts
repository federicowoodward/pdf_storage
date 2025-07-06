import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DocumentsService {
  constructor(private http: HttpClient) {}

  getAllDocuments() {
    return this.http.get<Document[]>('/api/documents');
  }

  getDownloadUrl(id: number) {
    return this.http.get<{ url: string }>(`/api/documents/${id}/download`);
  }
}

export interface Document {
  id: number;
  title: string;
  description?: string;
  category?: string;
  // otros campos según tu modelo
}
