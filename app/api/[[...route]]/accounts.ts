import {Hono} from "hono";
import {db} from '@/db/drizzle'
import {z} from "zod";
import {zValidator} from '@hono/zod-validator'
import {createId} from '@paralleldrive/cuid2'
import { accounts, insertAccountSchema } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { and, eq, inArray } from 'drizzle-orm';

const app = new Hono()

// GET all accounts - UPDATED WITH TYPE AND BALANCE
.get('/',
  clerkMiddleware(),
  async(c)=>{
   const auth = getAuth(c);

   if(!auth?.userId){
    return c.json({error:'Unauthorized'},401)
   }
   
   const data = await db
    .select({
      id: accounts.id,
      name: accounts.name,
      type: accounts.type,        // ADDED
      balance: accounts.balance,  // ADDED
      plaidId: accounts.plaidId,
      userId: accounts.userId,
    })
    .from(accounts)
    .where(eq(accounts.userId, auth.userId));
    
   return c.json({data})
})

// GET single account - UPDATED WITH TYPE AND BALANCE
.get(
  '/:id',
  zValidator("param", z.object({
    id: z.string().optional(),
  })),
  clerkMiddleware(),
  async (c) => {
    const auth = getAuth(c);
    const { id } = c.req.valid("param");

    if(!id){
      return c.json({error: "Missing id"}, 400)
    }
    if(!auth?.userId){
      return c.json({error: "Unauthorized"}, 401)
    }

    const [data] = await db
      .select({
        id: accounts.id,
        name: accounts.name,
        type: accounts.type,        // ADDED
        balance: accounts.balance,  // ADDED
        plaidId: accounts.plaidId,
        userId: accounts.userId,
      })
      .from(accounts)
      .where(
        and(
          eq(accounts.userId, auth.userId),
          eq(accounts.id, id)
        ),
      );

    if(!data){
      return c.json({error: "Account not found"}, 404);
    }
    return c.json({data});
  }
)

// CREATE account - UPDATED SCHEMA
.post(
  '/',
  clerkMiddleware(),
  zValidator('json', insertAccountSchema.pick({
    name: true,
    type: true,        // ADDED
    balance: true,     // ADDED
  })),
  async (c) => {
    const auth = getAuth(c);
    const values = c.req.valid('json')
    
    if(!auth?.userId){
      return c.json({error: 'Unauthorized'}, 401)
    }

    const [data] = await db.insert(accounts).values({
      id: createId(),
      userId: auth.userId,
      ...values,
    }).returning();
    
    return c.json({data})
  } 
)

// BULK DELETE - IMPROVED ERROR HANDLING
.post(
  '/bulk-delete',
  clerkMiddleware(),
  zValidator(
    'json',
    z.object({
      ids: z.array(z.string()).min(1, "At least one account ID is required"),
    }),
  ),
  async (c) => {
    const auth = getAuth(c);
    const values = c.req.valid('json');

    if(!auth?.userId){
      return c.json({error: 'Unauthorized'}, 401);
    }

    if(!values.ids || values.ids.length === 0){
      return c.json({error: 'No accounts selected for deletion'}, 400);
    }

    const data = await db
      .delete(accounts)
      .where(
        and(
          eq(accounts.userId, auth.userId),
          inArray(accounts.id, values.ids)
        )
      )
      .returning({
        id: accounts.id,
      });
    
    return c.json({ 
      data, 
      message: `Successfully deleted ${data.length} account(s)` 
    });
  },
)

// UPDATE account - UPDATED SCHEMA
.patch(
  "/:id",
  clerkMiddleware(),
  zValidator(
    'param',
    z.object({
      id: z.string().min(1, "Account ID is required"),
    }),
  ),
  zValidator(
    'json',
    insertAccountSchema.pick({
      name: true,
      type: true,        // ADDED
      balance: true,     // ADDED
    })
  ),
  async (c) => {
    const auth = getAuth(c);
    const { id } = c.req.valid("param");
    const values = c.req.valid("json");

    if(!auth?.userId){
      return c.json({error: "Unauthorized"}, 401);
    }

    const [data] = await db
      .update(accounts)
      .set({
        ...values,
      })
      .where(
        and(
          eq(accounts.userId, auth.userId),
          eq(accounts.id, id),
        )
      )
      .returning();

    if(!data){
      return c.json({error: "Account not found"}, 404);
    }
    
    return c.json({data});
  }
)

// DELETE account - IMPROVED RESPONSE
.delete(
  "/:id",
  clerkMiddleware(),
  zValidator(
    'param',
    z.object({
      id: z.string().min(1, "Account ID is required"),
    }),
  ),
  async (c) => {
    const auth = getAuth(c);
    const { id } = c.req.valid("param");

    if(!auth?.userId){
      return c.json({error: "Unauthorized"}, 401);
    }

    const [data] = await db
      .delete(accounts)
      .where(
        and(
          eq(accounts.userId, auth.userId),
          eq(accounts.id, id),
        )
      )
      .returning({
        id: accounts.id,
        name: accounts.name, // ADDED name in response
      });

    if(!data){
      return c.json({error: "Account not found"}, 404);
    }
    
    return c.json({ 
      data, 
      message: `Account "${data.name}" deleted successfully` 
    });
  }
);

export default app;