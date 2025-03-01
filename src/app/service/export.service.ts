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

  async exportToPDF(config: PDFConfig): Promise<void> {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 15;

      // Agregar fondo decorativo para el encabezado
      doc.setFillColor(245, 247, 250);
      doc.rect(0, 0, pageWidth, 40, 'F');

      // Borde inferior del encabezado
      doc.setDrawColor(104, 66, 255);
      doc.setLineWidth(0.5);
      doc.line(0, 40, pageWidth, 40);

      // Título principal con círculo decorativo
      doc.setFontSize(22);
      doc.setTextColor(104, 66, 255);

      // Círculo decorativo
      doc.setFillColor(104, 66, 255);
      doc.circle(20, 20, 7, 'F');

      // Título del reporte
      doc.text(config.title, 40, 22);

      // Fecha de generación con círculo decorativo
      yPosition = 50;

      // Círculo decorativo más pequeño
      doc.setFillColor(118, 75, 162);
      doc.circle(15, yPosition - 1, 4, 'F');

      // Fecha y hora
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(10);
      doc.text(`Generado: ${this.formatDate(new Date())}`, 25, yPosition);

      // Información adicional del encabezado
      if (config.headerInfo && config.headerInfo.length > 0) {
        yPosition += 10;
        doc.setFontSize(11);
        doc.setTextColor(60, 60, 60);

        config.headerInfo.forEach((info, index) => {
          // Marcadores simples
          doc.setFillColor(index === 0 ? '#3498db' : '#e74c3c');
          doc.circle(15, yPosition - 2, 2, 'F');

          doc.text(info.text, 20, yPosition, { align: 'left' });
          yPosition += 8;
        });
      }

      // Línea decorativa antes de las tablas
      yPosition += 5;
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(15, yPosition, pageWidth - 15, yPosition);
      yPosition += 10;

      // Crear tablas (se mantiene igual)
      for (let index = 0; index < config.tableData.length; index++) {
        const table = config.tableData[index];
        // Espacio entre tablas
        yPosition += index > 0 ? 15 : 5;

        // Verificar si necesitamos una nueva página
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          yPosition = 20;
        }

        // Crear un rectángulo para el encabezado de la tabla
        doc.setFillColor(104, 66, 255);
        doc.rect(15, yPosition - 5, pageWidth - 30, 20, 'F');

        // Decoración simple en lugar de icono
        doc.setFillColor(255, 255, 255);
        doc.circle(25, yPosition + 5, 5, 'F');
        doc.setFillColor(104, 66, 255);
        doc.circle(25, yPosition + 5, 3, 'F');

        // Título de la tabla
        if (table.title) {
          doc.setFontSize(12);
          doc.setTextColor(255, 255, 255);
          doc.text(table.title, 35, yPosition + 5);
        }

        // Subtítulo de la tabla
        if (table.subTitle) {
          doc.setFontSize(9);
          doc.setTextColor(220, 220, 220);
          doc.text(table.subTitle, pageWidth - 20, yPosition + 5, { align: 'right' });
        }

        // Actualizar la posición Y después del banner
        yPosition += 20;

        // Crear tabla con estilo mejorado
        autoTable(doc, {
          head: [table.headers],
          body: table.data,
          startY: yPosition,
          theme: 'grid',
          styles: {
            fontSize: 9,
            cellPadding: 4,
            lineColor: [220, 220, 220],
            lineWidth: 0.1
          },
          headStyles: {
            fillColor: [118, 75, 162],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center'
          },
          alternateRowStyles: {
            fillColor: [248, 248, 255]
          },
          columnStyles: table.columnStyles || {}
        });

        // Actualizar la posición Y después de la tabla
        yPosition = (doc as any).lastAutoTable.finalY + 10;
      }

      // Pie de página simple y confiable
      const footerPosition = pageHeight - 20;
      doc.setFillColor(245, 247, 250);
      doc.rect(0, footerPosition - 5, pageWidth, 25, 'F');

      doc.setDrawColor(104, 66, 255);
      doc.setLineWidth(0.3);
      doc.line(0, footerPosition - 5, pageWidth, footerPosition - 5);

      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Space Station Games - Sistema de Gestión de Ventas', pageWidth / 2, footerPosition + 2, { align: 'center' });
      doc.text(`Documento generado el ${this.formatDate(new Date())}`, pageWidth / 2, footerPosition + 8, { align: 'center' });

      // Paginación
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(80, 80, 80);
        doc.text(`Página ${i} de ${totalPages}`, pageWidth - 20, pageHeight - 10);
      }

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
