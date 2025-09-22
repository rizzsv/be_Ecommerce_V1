export interface refundModel {
    id : number
    order_number : string
    user_id : number
    reason : string
    status : string
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