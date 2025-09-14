import { z } from 'zod';

export const joinRoomPayloadSchema = z.object({
    roomId:  z.string().min(1, "Room ID cannot be empty")
})

export const changeDirectionSchema = z.object({
    direction: z.enum(['up', 'down', 'left', 'right'])
});

export const messageSchema = z.discriminatedUnion('type', [
    z.object({
        type: z.literal('createRoom')
    }),
    z.object({
        type: z.literal('joinRoom'),
        payload: joinRoomPayloadSchema
    }),
    z.object({
        type: z.literal('changeDirection'),
        payload: changeDirectionSchema
    }),
])