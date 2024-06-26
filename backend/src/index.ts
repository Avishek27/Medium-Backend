import { Hono } from 'hono'
import { userRouter } from './routes/user'
import { blogRouter } from './routes/blog';
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('/*', cors())
app.route("/api/v1/user",userRouter);
app.route("/api/v1/blog",blogRouter);


app.get('/', (c) => {
  return c.text('Deployed on cloudflare. Please Connect to the Frontend.');
})

export default app
