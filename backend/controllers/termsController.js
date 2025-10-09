import path , {dirname} from 'path';
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const getTermsPage = (req,res) => {
    res.sendFile(path.join( __dirname, '/../../frontend/html/register.html'));
}