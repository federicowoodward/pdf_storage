import { Component, OnInit } from '@angular/core';
import { DocumentsService, Document } from './documents.service';

@Component({
  selector: 'app-documents-list',
  templateUrl: './documents-list.component.html',
})
export class DocumentsListComponent implements OnInit {
  documents: Document[] = [];

  constructor(private documentsService: DocumentsService) {}

  ngOnInit() {
    this.documentsService.getAllDocuments().subscribe(docs => this.documents = docs);
  }

  downloadDoc(doc: Document) {
    this.documentsService.getDownloadUrl(doc.id).subscribe(response => {
      // Opción 1: Forzar descarga con nombre bonito
      const link = document.createElement('a');
      link.href = response.url;
      link.download = (doc.title || 'documento') + '.pdf'; // nombre bonito
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
}
