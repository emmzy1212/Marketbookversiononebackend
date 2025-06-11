import { useState, useRef } from 'react';
import { HiX, HiPrinter, HiDownload } from 'react-icons/hi';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function InvoiceModal({ item, user, isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const invoiceRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: `Invoice-${item?.invoiceNumber}`,
  });

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    setLoading(true);
    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Invoice-${item.invoiceNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const formatNaira = (amt) => {
    const num = Number(amt);
    if (isNaN(num)) return '₦0.00';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(num);
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Invoice</h2>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="btn btn-outline flex items-center gap-2">
              <HiPrinter className="h-4 w-4" /> Print
            </button>
            <button onClick={handleDownloadPDF} disabled={loading} className="btn btn-primary flex items-center gap-2">
              <HiDownload className="h-4 w-4" /> {loading ? 'Generating...' : 'Download PDF'}
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <HiX className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div ref={invoiceRef} className="p-8 bg-white">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">MarketBook</h1>
              <p className="text-gray-600">Professional Marketplace</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">INVOICE</h2>
              <p className="text-gray-600">#{item.invoiceNumber}</p>
              <p className="text-gray-600">Date: {formatDate(item.createdAt)}</p>
              {item.dueDate && <p className="text-gray-600">Due: {formatDate(item.dueDate)}</p>}
            </div>
          </div>

          {/* Billing Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Bill From:</h3>
              <div className="text-gray-600">
                <p className="font-medium">{user?.name}</p>
                <p>{user?.email}</p>
                {user?.phone && <p>{user?.phone}</p>}
                {user?.location && <p>{user?.location}</p>}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Bill To:</h3>
              <div className="text-gray-600">
                {item.customerName ? (
                  <>
                    <p className="font-medium">{item.customerName}</p>
                    {item.customerEmail && <p>{item.customerEmail}</p>}
                    {item.customerPhone && <p>{item.customerPhone}</p>}
                  </>
                ) : (
                  <p className="italic">No customer information provided</p>
                )}
              </div>
            </div>
          </div>

          {/* Item Details */}
          <div className="mb-8">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Description</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Category</th>
                  <th className="border border-gray-300 px-4 py-3 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-3">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      {item.notes && <p className="text-sm text-gray-500 mt-1">Note: {item.notes}</p>}
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-3">{item.category}</td>
                  <td className="border border-gray-300 px-4 py-3 text-right font-medium">
                    {formatNaira(item.price)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="flex justify-between items-center py-2 border-t border-gray-300">
                <span className="font-semibold">Subtotal:</span>
                <span>{formatNaira(item.price)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-gray-300">
                <span className="font-semibold">Tax:</span>
                <span>₦0.00</span>
              </div>
              <div className="flex justify-between items-center py-3 border-t-2 border-gray-800 font-bold text-lg">
                <span>Total:</span>
                <span>{formatNaira(item.price)}</span>
              </div>
            </div>
          </div>

          {/* Payment & Stock Status */}
          <div className="mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Payment Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.paymentStatus === 'paid'
                    ? 'bg-green-100 text-green-800'
                    : item.paymentStatus === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {item.paymentStatus.charAt(0).toUpperCase() + item.paymentStatus.slice(1)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="font-semibold">Stock Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-500 text-sm border-t pt-4">
            <p>Thank you for your business!</p>
            <p>Generated on {formatDate(new Date())}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceModal;
