export default class PlanUtil {
    private static YEAR_DISCOUNT = 15

    public static getCostWithDiscount (price: number, discount: number): number {
        return (1 - discount / 100) * price
    }

    public static getDiscountValue (price: number, discount: number): number {
        return discount / 100 * price
    }

    public static getPeriodDiscount (period: number): number {
        return period === 12 ? this.YEAR_DISCOUNT : 0
    }
}
