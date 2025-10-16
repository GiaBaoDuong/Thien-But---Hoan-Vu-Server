export enum DiscountType{
    PERCENTAGE = 'PERCENTAGE',
    FIXED_AMOUNT = 'FIXED_AMOUNT',
}

export class Promotion {
    id: string;
    name: string;
    description?: string;
    discountType : DiscountType;
    discountValue: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    createdAt: Date;
    upadatedAt: Date;
    companyId: number;
}
