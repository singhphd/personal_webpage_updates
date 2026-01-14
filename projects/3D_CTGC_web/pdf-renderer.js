// Simple PDF renderer using PDF.js

// Configure worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

async function renderPDF(url, canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    
    try {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1); // Render first page
        
        // Adjust scale for high resolution
        const viewport = page.getViewport({ scale: 2.0 }); // 2x scale for crispness
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        // Render PDF page into canvas context
        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        await page.render(renderContext).promise;
        
        // Make responsive via CSS
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        
    } catch (error) {
        console.error('Error rendering PDF:', error);
        // Fallback or error handling
        canvas.parentElement.innerHTML = `<p class="error">Error loading PDF: ${error.message}</p>`;
    }
}

// Initialize all PDFs
document.addEventListener('DOMContentLoaded', () => {
    renderPDF('figures/figure01_lifecycle.pdf', 'pdf-canvas-1');
    renderPDF('figures/figure02_GC_path_map.pdf', 'pdf-canvas-2');
    renderPDF('figures/figure04_GC3D.pdf', 'pdf-canvas-4');
    renderPDF('figures/figure05_gc3_cross_section_anomaly.pdf', 'pdf-canvas-5');
});
