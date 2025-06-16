/**
 * File handler module for file operations
 */

class FileHandler {
    constructor() {
        this.supportedTypes = {
            'text/plain': true,
            'text/javascript': true,
            'text/html': true,
            'text/css': true,
            'application/json': true
        };
    }

    /**
     * Handle file selection
     * @param {File} file - The selected file
     * @returns {Promise<Object>} File information and content
     */
    async handleFile(file) {
        if (!file) {
            throw new Error('No file selected');
        }

        if (!this.isFileTypeSupported(file.type)) {
            throw new Error('Unsupported file type');
        }

        try {
            const content = await this.readFileContent(file);
            return {
                name: file.name,
                type: file.type,
                size: this.formatFileSize(file.size),
                content,
                lastModified: new Date(file.lastModified).toLocaleString()
            };
        } catch (error) {
            throw new Error(`Error reading file: ${error.message}`);
        }
    }

    /**
     * Read file content
     * @param {File} file - The file to read
     * @returns {Promise<string>} File content
     */
    readFileContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                resolve(event.target.result);
            };
            
            reader.onerror = (error) => {
                reject(error);
            };
            
            reader.readAsText(file);
        });
    }

    /**
     * Check if file type is supported
     * @param {string} type - File MIME type
     * @returns {boolean} Whether the file type is supported
     */
    isFileTypeSupported(type) {
        return this.supportedTypes[type] || false;
    }

    /**
     * Format file size
     * @param {number} bytes - File size in bytes
     * @returns {string} Formatted file size
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Download file
     * @param {string} content - File content
     * @param {string} filename - Name of the file to download
     * @param {string} type - File MIME type
     */
    downloadFile(content, filename, type = 'text/plain') {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

export default new FileHandler(); 