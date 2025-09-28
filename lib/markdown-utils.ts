// Markdown processing utilities

// Convert Wiki-style image links to standard markdown
export function processMarkdownImages(content: string): string {
  // Convert ![[image.ext]] to ![](path/image.ext)
  return content.replace(/!\[\[([^\]]+)\]\]/g, (match, filename) => {
    return `![${filename}](/doc/${filename})`
  })
}

// Process markdown content for dashboard display
export function processMarkdownContent(content: string): string {
  let processed = content

  // Fix image paths
  processed = processMarkdownImages(processed)

  // Add line breaks for better readability
  processed = processed.replace(/^(#{1,6})\s+(.+)$/gm, '$1 $2\n')

  return processed
}

// Copy text to clipboard with fallback
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-9999px'
      textArea.style.top = '-9999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      try {
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        return successful
      } catch (err) {
        document.body.removeChild(textArea)
        return false
      }
    }
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
    return false
  }
}

// Toast notification utility
export function showToast(message: string, type: 'success' | 'error' = 'success') {
  // Create toast element
  const toast = document.createElement('div')
  toast.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 ${
    type === 'success' ? 'bg-green-600' : 'bg-red-600'
  }`
  toast.textContent = message

  // Add to DOM
  document.body.appendChild(toast)

  // Animate in
  setTimeout(() => {
    toast.style.transform = 'translateX(0)'
    toast.style.opacity = '1'
  }, 10)

  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)'
    toast.style.opacity = '0'
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 300)
  }, 3000)
}