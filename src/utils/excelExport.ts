/**
 * Export data to Excel file
 * Requires: npm install xlsx
 * Usage: import * as XLSX from 'xlsx'
 */

export interface ExcelExportOptions {
  filename?: string
  sheetName?: string
}

/**
 * Export array of objects to Excel file
 */
export function exportToExcel<T extends Record<string, unknown>>(
  data: T[],
  options: ExcelExportOptions = {}
): void {
  if (data.length === 0) {
    return
  }

  // Dynamic import to avoid SSR issues
  import('xlsx').then((XLSX) => {
    const { filename = 'export.xlsx', sheetName = 'Sheet1' } = options

    // Create a new workbook
    const workbook = XLSX.utils.book_new()

    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data)

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

    // Generate Excel file and download
    XLSX.writeFile(workbook, filename)
  }).catch((error) => {
    console.error('Failed to export Excel, falling back to CSV:', error)
    // Fallback to CSV if xlsx is not available
    const csvFilename = options.filename?.replace('.xlsx', '.csv') || 'export.csv'
    exportToCSV(data, csvFilename)
  })
}

/**
 * Export data to CSV file (fallback if xlsx is not available)
 */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string = 'export.csv'
): void {
  if (data.length === 0) {
    return
  }

  // Get headers from first object
  const headers = Object.keys(data[0])
  
  // Create CSV content
  const csvContent = [
    // Headers
    headers.join(','),
    // Data rows
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        // Handle values that might contain commas or quotes
        if (value === null || value === undefined) return ''
        const stringValue = String(value)
        // Escape quotes and wrap in quotes if contains comma or quote
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      }).join(',')
    )
  ].join('\n')

  // Create blob and download
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

