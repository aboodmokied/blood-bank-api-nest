import { FileValidator } from "@nestjs/common/pipes/file/file-validator.interface";
import magicBytes from 'magic-bytes.js';

export class FileSignatureValidator extends FileValidator {
    constructor() {
        super({});
    }

    isValid(file: any): boolean | Promise<boolean> {
        const filesSignatures = magicBytes(file.buffer).map((file) => file.mime);
        console.log('filesSignatures', filesSignatures);

        if (!filesSignatures.length) return false;

        const isMatch = filesSignatures.includes(file.mimetype);
        if (!isMatch) return false;

        return true;
    }

    buildErrorMessage(file: any): string {

        return 'validation failed (file type does not match file signature)';
    }
}

