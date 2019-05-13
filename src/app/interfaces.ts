export interface PizzaItem {
  id: number;
  title: string;
  description: string;
  pictureUrl: string;
  energyValue: {
    fats: number;
    protein: number;
    carbohydrates: number;
    value: number;
  };
  price: number;
  size: {
    thickness: Array<{
      type: string;
      priceRate: number;
    }>;
    diameter: Array<{
      value: number;
      persons: {
        min: number;
        max: number;
      };
    }>;
  };
}

export interface RadioGroupButtonOption {
  title: string;
  value: string | number;
}