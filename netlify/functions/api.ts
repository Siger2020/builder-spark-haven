import serverless from "serverless-http";
import { createServer } from "../../server";

let handler: any = null;

export const handler = async (event: any, context: any) => {
  if (!handler) {
    console.log("🚀 تهيئة خادم Netlify للمرة الأولى...");
    const app = await createServer();
    handler = serverless(app);
  }

  return handler(event, context);
};
