import { SHEETS } from '@/lib/google-sheets'
import { createEntityHandlers } from '@/lib/entity-routes'

const handlers = createEntityHandlers({ sheet: SHEETS.DOCTORS })

export const GET = handlers.GET
export const POST = handlers.POST
export const PUT = handlers.PUT
export const DELETE = handlers.DELETE
