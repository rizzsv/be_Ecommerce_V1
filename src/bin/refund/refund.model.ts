export interface refundModel {
    id : number
    order_number : string
    user_id : number
    reason : string
    status : string
    ammount : number
    created_at : Date
    updated_at : Date
}