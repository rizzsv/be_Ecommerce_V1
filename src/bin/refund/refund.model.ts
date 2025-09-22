import { refundStatus } from "@prisma/client"

export interface refundModel {
    id : number
    order_id : string
    reason : string
    status : refundStatus
    created_at : Date
    updated_at : Date
}

export interface getRefundId {
    refund_id : number
}

export interface getRefundOrder {
    refund_id : number
    search?: string
    periode: number
    page: number
    quantity: number
}