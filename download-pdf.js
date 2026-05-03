// Wait for page to fully load
document.getElementById("downloadPdfBtn").addEventListener("click", async () => {

  const button = document.getElementById("downloadPdfBtn")
  button.innerText = "Generating PDF..."
  button.disabled = true

  try {
    // Select the entire page
    const element = document.body

    // Convert page to canvas
    const canvas = await html2canvas(element, {
      scale: 2, // improves quality
      useCORS: true
    })

    const imgData = canvas.toDataURL("image/png")

    const { jsPDF } = window.jspdf
    const pdf = new jsPDF("p", "mm", "a4")

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    const imgWidth = pageWidth
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 0

    // First page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // Add extra pages if content is long
    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // Save PDF
    pdf.save("Election_Results.pdf")

  } catch (error) {
    console.error(error)
    alert("Error generating PDF")
  }

  button.innerText = "📄 Download Results as PDF"
  button.disabled = false
})