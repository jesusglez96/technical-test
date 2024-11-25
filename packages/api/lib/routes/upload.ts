import { FastifyInstance } from 'fastify';
import path from 'path';
import { saveFile } from 'services';

const FILE_UPLOAD_DIR = path.join(__dirname, '../../uploads');

export default async function (app: FastifyInstance) {
  app.post(
    '/upload',
    { preHandler: [app.authenticate] },
    async (req, reply) => {
      const data = await req.file(); // Parse the uploaded file

      if (!data) {
        return reply.status(400).send({ message: 'No file uploaded' });
      }

      const filePath = path.join(FILE_UPLOAD_DIR, data.filename);

      // Save the file locally (you can integrate cloud storage here)
      await saveFile(await data.toBuffer(), data.filename);

      return reply.send({
        message: 'File uploaded successfully',
        path: filePath,
      });
    }
  );
}
