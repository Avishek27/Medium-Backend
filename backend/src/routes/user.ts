import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from "hono/jwt";
import { signupInput,signInInput } from "@avi_0912/common";
export const userRouter = new Hono<{
   Bindings : {
    DATABASE_URL: string,
    JWT_SECRET: string
   }
}>();
  
userRouter.post('/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate());
  const body  =  await c.req.json();
  const { success } = signupInput.safeParse(body);
  if(!success){
    c.status(411);
    return c.json({
      error: "inputs are not correct",
    });
  }
  try{
    const user = await prisma.user.create({
      data: {
        username: body.username,
        password: body.password,
        name: body.name,
      }
    });
    const jwt = await sign({
      id: user.id,
    },
    c.env.JWT_SECRET);
   return c.json({jwt: jwt});
  }catch(e){
    c.status(411);
    return c.json({error: "Not Signed Up"});
  }
});


  userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
   const body = await c.req.json();
   const { success } = signInInput.safeParse(body);
  if(!success){
    c.status(411);
    return c.json({
      error: "inputs are not correct",
    });
  }
   try{
    const user = await prisma.user.findFirst({
      where: {
        username: body.username,
        password: body.password,
      }
     });
     if(!user){
      c.status(403);
      return c.json({
        error: "User is not signed in",
      });
     }else{
      const jwt = await sign({
        id: user.id,
      },c.env.JWT_SECRET);
      return c.json({
        jwt
      });
     }
   }catch(e){
    c.status(411);
    return c.json({
      error: "Invalid",
    });
   }
  });
  
  
  
  
  