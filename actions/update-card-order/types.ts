import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { Card } from "@prisma/client";
import { UpdateCardOrder } from "./schema";

export type InputType = z.infer<typeof UpdateCardOrder>;
export type ReturnType = ActionState<InputType, Card[]>;