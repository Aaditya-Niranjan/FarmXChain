import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

class FileUploadService {
    getAuthHeaders() {
        const token = localStorage.getItem('token');
        return { Authorization: `Bearer ${token}` };
    }

    /**
     * Upload a single file
     * @param {File} file - The file to upload
     * @returns {Promise} - Response with file URL
     */
    async uploadFile(file) {
        if (!file) {
            throw new Error('No file provided');
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
                headers: {
                    ...this.getAuthHeaders(),
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('File upload error:', error);
            throw error.response?.data || error.message;
        }
    }

    /**
     * Upload multiple files
     * @param {FileList|Array} files - Array of files to upload
     * @returns {Promise<Array>} - Array of uploaded file URLs
     */
    async uploadMultipleFiles(files) {
        if (!files || files.length === 0) {
            throw new Error('No files provided');
        }

        const uploadPromises = Array.from(files).map(file => this.uploadFile(file));

        try {
            const responses = await Promise.all(uploadPromises);
            return responses;
        } catch (error) {
            console.error('Multiple file upload error:', error);
            throw error;
        }
    }

    /**
     * Validate file before upload
     * @param {File} file - File to validate
     * @param {Object} options - Validation options (maxSize, allowedTypes)
     * @returns {boolean} - True if valid
     */
    validateFile(file, options = {}) {
        const {
            maxSize = 5 * 1024 * 1024, // 5MB default
            allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp']
        } = options;

        // Check file size
        if (file.size > maxSize) {
            throw new Error(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
        }

        // Check file type
        if (!allowedTypes.includes(file.type)) {
            throw new Error(`File type ${file.type} not allowed. Allowed types: ${allowedTypes.join(', ')}`);
        }

        return true;
    }

    /**
     * Get file preview URL
     * @param {File} file - File to preview
     * @returns {string} - Object URL for preview
     */
    getFilePreview(file) {
        return URL.createObjectURL(file);
    }

    /**
     * Revoke file preview URL to free memory
     * @param {string} url - Object URL to revoke
     */
    revokeFilePreview(url) {
        URL.revokeObjectURL(url);
    }
}

const fileUploadService = new FileUploadService();
export default fileUploadService;
