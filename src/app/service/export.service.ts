import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';

export interface PDFTableConfig {
  headers: string[];
  data: any[][];
  title?: string;
  subTitle?: string;
  columnStyles?: Record<number, any>;
}

export interface PDFConfig {
  title: string;
  fileName: string;
  headerInfo?: { text: string, alignment?: 'left' | 'center' | 'right' }[];
  tableData: PDFTableConfig[];
}
@Injectable({
  providedIn: 'root',
})
export class ExportService {
  // private datePipe = new DatePipe('es');
  private datePipe = new DatePipe('en-US');


  formatDate(date: Date | string, format: string = 'dd/MM/yyyy HH:mm'): string {
    return this.datePipe.transform(date, format) || '';
  }

  exportToExcel(data: any[], fileName: string, sheetName: string = 'Datos'): void {
    try {
      // Crear hoja de cálculo
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const workbook: XLSX.WorkBook = {
        Sheets: { [sheetName]: worksheet },
        SheetNames: [sheetName]
      };

      // Guardar archivo
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsFile(
        new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
        `${fileName}_${this.getCurrentDate()}.xlsx`
      );
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      throw error;
    }
  }

  exportToPDF(config: PDFConfig): void {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPosition = 10;

      // Título principal
      doc.setFontSize(18);
      doc.setTextColor(104, 66, 255); // Color primario
      doc.text(config.title, pageWidth / 2, yPosition, { align: 'center' });

      // Fecha de generación
      yPosition += 8;
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text(`Generado: ${this.formatDate(new Date())}`, pageWidth / 2, yPosition, { align: 'center' });

      // Información adicional del encabezado
      if (config.headerInfo && config.headerInfo.length > 0) {
        yPosition += 10;
        doc.setFontSize(11);
        doc.setTextColor(60, 60, 60);

        config.headerInfo.forEach(info => {
          doc.text(info.text, info.alignment === 'right' ? pageWidth - 15 : 15, yPosition, {
            align: info.alignment || 'left'
          });
          yPosition += 5;
        });
      }

      // Crear tablas
      config.tableData.forEach((table, index) => {
        // Espacio entre tablas
        yPosition += index > 0 ? 15 : 10;

        // Verificar si necesitamos una nueva página
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }

        // Agregar título de la tabla si existe
        if (table.title) {
          doc.setFontSize(12);
          doc.setTextColor(104, 66, 255);
          doc.text(table.title, 15, yPosition);
          yPosition += 6;
        }

        // Agregar subtítulo si existe
        if (table.subTitle) {
          doc.setFontSize(10);
          doc.setTextColor(80, 80, 80);
          doc.text(table.subTitle, 15, yPosition);
          yPosition += 6;
        }

        // Crear tabla
        autoTable(doc, {
          head: [table.headers],
          body: table.data,
          startY: yPosition,
          theme: 'grid',
          styles: {
            fontSize: 9,
            cellPadding: 3
          },
          headStyles: {
            fillColor: [118, 75, 162],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
          },
          columnStyles: table.columnStyles || {}
        });

        // Actualizar la posición Y después de la tabla
        yPosition = (doc as any).lastAutoTable.finalY + 10;
      });

      // Guardar el PDF
      doc.save(`${config.fileName}_${this.getCurrentDate()}.pdf`);
    } catch (error) {
      console.error('Error al exportar a PDF:', error);
      throw error;
    }
  }

  /**
   * Guarda los datos como un archivo descargable
   */
  private saveAsFile(blob: Blob, fileName: string): void {
    const url: string = window.URL.createObjectURL(blob);
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Obtiene la fecha actual en formato yyyy-MM-dd
   */
  private getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }
  exportWorkbookToExcel(workbook: XLSX.WorkBook, fileName: string): void {
    try {
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsFile(
        new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
        `${fileName}_${this.getCurrentDate()}.xlsx`
      );
    } catch (error) {
      console.error('Error al exportar el workbook a Excel:', error);
      throw error;
    }
  }
}
