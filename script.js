document.addEventListener('DOMContentLoaded', async () => {
    // Generate the 12-page demo PDF using pdf-lib dynamically
    try {
        await generateDemoPDF();
    } catch (error) {
        console.error("Error generating PDF:", error);
        document.getElementById('loading-state').innerHTML = "<p style='color: #ef4444;'>Failed to generate PDF demo. Please check console.</p>";
    }
});

async function generateDemoPDF() {
    // pdf-lib is loaded via CDN in index.html, exposing the PDFLib global
    const { PDFDocument, rgb, StandardFonts } = PDFLib;
    
    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create();
    
    // Embed standard fonts
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const timesItalicFont = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

    const title = "Uncertainty Visualization in AI Interfaces";
    const subtitle = "A Scoping Review for Designing Trustworthy Systems";
    const authors = "Dr. Jane Doe, John Smith";

    // Generate exactly 12 pages
    for (let i = 1; i <= 12; i++) {
        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        
        // Add header & footer
        page.drawText(`Page ${i} of 12`, {
            x: width / 2 - 25,
            y: 35,
            size: 10,
            font: timesRomanFont,
            color: rgb(0.4, 0.4, 0.4),
        });

        page.drawText(`Demo Research Paper - Pre-print Version`, {
            x: 50,
            y: height - 40,
            size: 10,
            font: timesItalicFont,
            color: rgb(0.4, 0.4, 0.4),
        });

        if (i === 1) {
            // Title
            page.drawText(title, {
                x: 50,
                y: height - 120,
                size: 20,
                font: timesBoldFont,
                color: rgb(0, 0, 0),
                maxWidth: width - 100,
            });

            // Subtitle
            page.drawText(subtitle, {
                x: 50,
                y: height - 145,
                size: 16,
                font: timesRomanFont,
            });

            // Authors
            page.drawText(authors, {
                x: 50,
                y: height - 180,
                size: 12,
                font: timesRomanFont,
            });

            // Abstract Title
            page.drawText('Abstract', {
                x: width / 2 - 25,
                y: height - 240,
                size: 14,
                font: timesBoldFont,
            });

            // Abstract Content
            const abstractText = "Our study explores how AI systems communicate uncertainty through visualization, and We look at how different studies say visualization affects user trust. By synthesizing current frameworks, this review highlights effective design patterns that align human perception with algorithmic probabilistic outputs, thereby fostering calibrated trust in intelligent user interfaces.";
            
            page.drawText(abstractText, {
                x: 70,
                y: height - 275,
                size: 11,
                font: timesRomanFont,
                maxWidth: width - 140,
                lineHeight: 16,
            });
            
            // Introduction Heading
            page.drawText('1. Introduction', {
                x: 50,
                y: height - 380,
                size: 14,
                font: timesBoldFont,
            });
            
            // Introduction Paragraph
            page.drawText('As intelligent systems increasingly inform high-stakes environments, communicating the boundaries of algorithmic confidence becomes paramount. This paper...', {
                x: 50,
                y: height - 405,
                size: 11,
                font: timesRomanFont,
                maxWidth: width - 100,
                lineHeight: 16,
            });
            
        } else {
            // Placeholder content for other pages
            page.drawText(`Section ${i}`, {
                x: 50,
                y: height - 100,
                size: 14,
                font: timesBoldFont,
            });
            
            const loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

            // Draw some mock paragraphs
            for(let p = 0; p < 4; p++) {
                page.drawText(loremIpsum, {
                    x: 50,
                    y: height - 140 - (p * 100),
                    size: 11,
                    font: timesRomanFont,
                    maxWidth: width - 100,
                    lineHeight: 16,
                });
            }

            // If it's the last page, add a bold "References" section
            if (i === 12) {
                page.drawText('References', {
                    x: 50,
                    y: height - 580,
                    size: 14,
                    font: timesBoldFont,
                });
                page.drawText('[1] J. Doe, "Uncertainty in AI", Journal of Trustworthy Systems, 2024.', {
                    x: 50,
                    y: height - 600,
                    size: 11,
                    font: timesRomanFont,
                });
            }
        }
    }

    // Serialize the PDFDocument to bytes (Uint8Array)
    const pdfBytes = await pdfDoc.save();
    
    // Create a Blob and Object URL
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    // Setup iframe source
    const iframe = document.getElementById('pdf-frame');
    iframe.src = url;

    // We wait for iframe load event mostly, but setting src often renders it
    iframe.onload = () => {
        iframe.style.display = 'block';
        document.getElementById('loading-state').classList.add('hidden');
    };

    // Fallback: Show it anyway if onload doesn't fire immediately
    setTimeout(() => {
        iframe.style.display = 'block';
        document.getElementById('loading-state').classList.add('hidden');
    }, 1500);

    // Setup global download access for the toolbar button
    window.downloadDemoPDF = () => {
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Demo_Research_Paper.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };
}

// Attach download functionality
document.querySelector('.fa-download').parentElement.addEventListener('click', () => {
    if (window.downloadDemoPDF) {
        window.downloadDemoPDF();
    }
});

// Print functionality (Note: printing iframes cross-origin/blob can be tricky on some browsers)
document.querySelector('.fa-print').parentElement.addEventListener('click', () => {
    const iframe = document.getElementById('pdf-frame');
    if (iframe.contentWindow) {
        iframe.contentWindow.print();
    } else {
        alert("Please download the PDF to print it.");
    }
});
