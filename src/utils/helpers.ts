import { v4 as uuidv4 } from "uuid";

export const removeEmptyFields = (obj: any) => {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, value]) => value !== null && value !== undefined && value !== '')
    );
};

export const MakeUniqueFileName = (fileName: string): string => {
    
    return fileName+"-"+uuidv4()
}