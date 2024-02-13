import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'
import { v4 as uuidv4 } from 'uuid';
import Jimp from 'jimp';

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

// Create Supabase client
const supabase = createClient(process.env.SUPABASE_PROJECT_URL!, process.env.SUPABASE_API_KEY!)

// Upload file using standard upload
async function uploadFile(file: UploadedFile) {
  try {
    const uniqueIdentifier = uuidv4();
    const fileName = `images/${uniqueIdentifier}_${file.originalname}`;
    const compressedBuffer = await (await Jimp.read(file.buffer))
      .quality(70)
      .getBufferAsync(Jimp.MIME_JPEG);

    const { error } = await supabase.storage.from(process.env.SUPABASE_BUCKET_NAME!).upload(fileName, compressedBuffer);

    if (error) {
      console.error(error);
      throw new Error("Failed to upload compressed image to Supabase");
    }

    const { data: { publicUrl } } = await supabase.storage.from(process.env.SUPABASE_BUCKET_NAME!).getPublicUrl(fileName);

    return publicUrl;
  } catch (err) {
    console.error(err);
    throw err;
  }
}


export { uploadFile }